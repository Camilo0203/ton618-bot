"use strict";

const { getDB, isDbUnavailableError, toDbUnavailableError } = require("./core");
const {
  ObjectId,
  buildTicketStatsPipeline,
  mapTicketStatsResult,
  buildSlaMetrics,
  resolveTicketSlaMinutes,
  buildSettingsDefaults,
  buildLevelSettingsDefaults,
  buildVerifSettingsDefaults,
  buildWelcomeSettingsDefaults,
  buildModlogSettingsDefaults,
  buildSuggestSettingsDefaults,
  sanitizeSettingsRecord,
  sanitizeSettingsPatch,
  hasSettingsDrift,
  now,
  uid,
  toValidDate,
  toObjectId,
  hydratePollRecord,
  hydratePollList,
  getAutoResponsesCache,
  setAutoResponsesCache,
  clearAutoResponsesCache,
  logError,
  validateInput,
  sanitizeString,
  sanitizeChannelName,
  normalizeTicketWorkflowStatus,
  normalizeTicketQueueType,
  normalizeTicketPriority,
  normalizeTicketTags,
  inferTicketQueueType,
} = require("./helpers");

const polls = {
  collection() { return getDB().collection("polls"); },
  
  async create(guildId, channelId, messageId, creatorId, question, options, endsAt, allowMultiple, proOptions = {}) {
    try {
      validateInput(question, "string", { required: true, maxLength: 500 });
      
      const poll = {
        _id: new ObjectId(),
        guild_id: guildId,
        channel_id: channelId,
        message_id: messageId,
        creator_id: creatorId,
        question: sanitizeString(question, 500),
        options: options.map((o, i) => ({ id: i, text: sanitizeString(o, 200), votes: [] })),
        allow_multiple: allowMultiple,
        anonymous: proOptions.anonymous || false,
        required_role: proOptions.required_role || null,
        max_votes: proOptions.max_votes || null,
        ended: false,
        ends_at: endsAt,
        created_at: now()
      };
      
      await this.collection().insertOne(poll);
      return hydratePollRecord(poll);
    } catch (error) {
      logError("polls.create", error, { guildId, question });
      throw error;
    }
  },

  async vote(id, userId, optionIds, options = {}) {
    try {
      const pollId = toObjectId(id);
      if (!pollId) return null;

      const poll = await this.collection().findOne({ _id: pollId });
      if (!poll || poll.ended) return null;

      const availableOptionIds = new Set((poll.options || []).map((option) => option.id));
      const normalizedOptionIds = Array.isArray(optionIds)
        ? optionIds
            .map((v) => Number(v))
            .filter((v) => Number.isInteger(v) && availableOptionIds.has(v))
        : [];

      const currentSelection = poll.options
        .filter((option) => Array.isArray(option.votes) && option.votes.includes(userId))
        .map((option) => option.id);

      let selected = [];
      if (poll.allow_multiple) {
        if (options.toggle === true && normalizedOptionIds.length === 1) {
          const toggledId = normalizedOptionIds[0];
          selected = currentSelection.includes(toggledId)
            ? currentSelection.filter((optionId) => optionId !== toggledId)
            : [...currentSelection, toggledId];
        } else {
          selected = Array.from(new Set(normalizedOptionIds));
        }
      } else {
        const nextId = normalizedOptionIds[0];
        if (Number.isInteger(nextId)) {
          selected = options.toggle === true && currentSelection.length === 1 && currentSelection[0] === nextId
            ? []
            : [nextId];
        }
      }

      const result = await this.collection().updateOne(
        { _id: poll._id, ended: false },
        [
          {
            $set: {
              options: {
                $map: {
                  input: "$options",
                  as: "opt",
                  in: {
                    $mergeObjects: [
                      "$$opt",
                      {
                        votes: {
                          $let: {
                            vars: {
                              withoutUser: {
                                $filter: {
                                  input: "$$opt.votes",
                                  as: "v",
                                  cond: { $ne: ["$$v", userId] },
                                },
                              },
                            },
                            in: {
                              $cond: [
                                { $in: ["$$opt.id", selected] },
                                { $concatArrays: ["$$withoutUser", [userId]] },
                                "$$withoutUser",
                              ],
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        ]
      );

      if (!result.matchedCount) return null;
      return hydratePollRecord(await this.collection().findOne({ _id: poll._id }));
    } catch (error) {
      logError("polls.vote", error, { id, userId });
      return null;
    }
  },

  async end(id) {
    try {
      const pollId = toObjectId(id);
      if (!pollId) return false;

      await this.collection().updateOne(
        { _id: pollId },
        { $set: { ended: true, ended_at: now() } }
      );
      return true;
    } catch (error) {
      logError("polls.end", error, { id });
      return false;
    }
  },

  async getActive(limit = 200) {
    try {
      const now_ = new Date();
      return hydratePollList(await this.collection()
        .find({
          ended: false,
          $expr: { $gt: [{ $toDate: "$ends_at" }, now_] },
        })
        .sort({ created_at: -1 })
        .limit(Math.max(1, Number(limit || 200)))
        .toArray());
    } catch (error) {
      logError("polls.getActive", error);
      return [];
    }
  },

  async getExpired(limit = 200) {
    try {
      const now_ = new Date();
      return hydratePollList(await this.collection()
        .find({
          ended: false,
          $expr: { $lte: [{ $toDate: "$ends_at" }, now_] },
        })
        .sort({ ends_at: 1 })
        .limit(Math.max(1, Number(limit || 200)))
        .toArray());
    } catch (error) {
      logError("polls.getExpired", error);
      return [];
    }
  },

  async getByMessage(messageId) {
    try {
      return hydratePollRecord(await this.collection().findOne({ message_id: messageId })) || null;
    } catch (error) {
      logError("polls.getByMessage", error, { messageId });
      return null;
    }
  },

  async getByGuild(guildId, includeEnded = false) {
    try {
      const query = { guild_id: guildId };
      if (!includeEnded) query.ended = false;
      
      return hydratePollList(await this.collection()
        .find(query)
        .sort({ created_at: -1 })
        .toArray());
    } catch (error) {
      logError("polls.getByGuild", error, { guildId });
      return [];
    }
  },
};

// ─────────────────────────────────────────────────────
//   OTRAS COLECCIONES (simplificadas para compatibilidad)
// ─────────────────────────────────────────────────────

module.exports = { polls };
