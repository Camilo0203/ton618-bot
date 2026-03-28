"use strict";

const { getDB, isDbUnavailableError, toDbUnavailableError } = require("./core");
const { logError, now, validateInput } = require("./helpers");

const ticketCreateLocks = {
  collection() {
    return getDB().collection("ticketCreateLocks");
  },

  _key(guildId, userId) {
    return `${guildId}::${userId}`;
  },

  async acquire(guildId, userId, ttlMs = 30_000) {
    try {
      validateInput(guildId, "string", { required: true, maxLength: 50 });
      validateInput(userId, "string", { required: true, maxLength: 50 });

      const nowDate = now();
      const expiresAt = new Date(nowDate.getTime() + Math.max(5_000, Number(ttlMs) || 30_000));
      const lockId = this._key(guildId, userId);

      await this.collection().findOneAndUpdate(
        {
          _id: lockId,
          $or: [
            { expires_at: { $lte: nowDate } },
            { expires_at: { $exists: false } },
          ],
        },
        {
          $set: {
            guild_id: guildId,
            user_id: userId,
            expires_at: expiresAt,
            updated_at: nowDate,
          },
          $setOnInsert: {
            created_at: nowDate,
          },
        },
        {
          upsert: true,
        }
      );

      return true;
    } catch (error) {
      if (error?.code === 11000) {
        return false;
      }
      if (isDbUnavailableError(error)) throw toDbUnavailableError(error, "ticketCreateLocks.acquire");
      logError("ticketCreateLocks.acquire", error, { guildId, userId, ttlMs });
      return false;
    }
  },

  async release(guildId, userId) {
    try {
      validateInput(guildId, "string", { required: true, maxLength: 50 });
      validateInput(userId, "string", { required: true, maxLength: 50 });
      await this.collection().deleteOne({ _id: this._key(guildId, userId) });
      return true;
    } catch (error) {
      if (isDbUnavailableError(error)) throw toDbUnavailableError(error, "ticketCreateLocks.release");
      logError("ticketCreateLocks.release", error, { guildId, userId });
      return false;
    }
  },
};

module.exports = { ticketCreateLocks };
