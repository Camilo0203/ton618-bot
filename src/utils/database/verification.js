"use strict";

const crypto = require("crypto");
const { getDB, isDbUnavailableError, toDbUnavailableError } = require("./core");
const {
  buildVerifSettingsDefaults,
  now,
  logError,
  validateInput,
} = require("./helpers");
const { auditLogs } = require("./auditLogs");
const { logStructured } = require("../observability");

const DISCORD_ID_RE = /^\d{16,22}$/;
const VERIFICATION_MODE_SET = new Set(["button", "code", "question"]);
const ANTI_RAID_ACTION_SET = new Set(["pause", "kick"]);
const MEMBER_STATUS_SET = new Set(["pending", "failed", "verified", "unverified", "kicked"]);
const VERIF_SETTINGS_KEYS = new Set([
  "enabled",
  "mode",
  "channel",
  "verified_role",
  "unverified_role",
  "log_channel",
  "panel_message_id",
  "panel_title",
  "panel_description",
  "panel_color",
  "panel_image",
  "question",
  "question_answer",
  "question_pool",
  "antiraid_enabled",
  "antiraid_joins",
  "antiraid_seconds",
  "antiraid_action",
  "dm_on_verify",
  "kick_unverified_hours",
  "min_account_age_days",
  "risk_based_escalation",
  "captcha_type",
]);
const METRIC_FIELDS = new Set([
  "total_events",
  "starts_total",
  "verified_total",
  "failed_total",
  "kicked_total",
  "force_verified_total",
  "force_unverified_total",
  "code_sent_total",
  "question_prompt_total",
  "antiraid_trigger_total",
  "permission_error_total",
  "panel_publish_total",
  "panel_publish_failed_total",
]);

function toBool(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function toInt(value, min, max, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(parsed)));
}

function toDiscordIdOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const sanitized = String(value).replace(/[^\d]/g, "");
  return DISCORD_ID_RE.test(sanitized) ? sanitized : null;
}

function toShortStringOrNull(value, maxLen) {
  if (value === null || value === undefined) return null;
  const out = String(value).trim();
  if (!out) return null;
  return out.slice(0, maxLen);
}

function toDateOrNull(value) {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function sanitizeHexColor(value, fallback = "57F287") {
  const raw = String(value || "").replace("#", "").trim();
  if (!raw) return fallback;
  return /^[0-9a-fA-f]{6}$/.test(raw) ? raw.toUpperCase() : fallback;
}

function sanitizeVerificationMode(value, fallback = "button") {
  const normalized = String(value || "").trim().toLowerCase();
  return VERIFICATION_MODE_SET.has(normalized) ? normalized : fallback;
}

function sanitizeAntiRaidAction(value, fallback = "pause") {
  const normalized = String(value || "").trim().toLowerCase();
  return ANTI_RAID_ACTION_SET.has(normalized) ? normalized : fallback;
}

const CAPTCHA_TYPE_SET = new Set(["math", "emoji"]);

function sanitizeCaptchaType(value, fallback = "math") {
  const normalized = String(value || "").trim().toLowerCase();
  return CAPTCHA_TYPE_SET.has(normalized) ? normalized : fallback;
}

function sanitizeQuestionPool(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      question: toShortStringOrNull(item.question, 200) || "",
      answer: (toShortStringOrNull(item.answer, 100) || "").toLowerCase().trim(),
    }))
    .filter((item) => item.question && item.answer)
    .slice(0, 20);
}

function sanitizeVerificationSettingsRecord(guildId, raw = {}) {
  const defaults = buildVerifSettingsDefaults(guildId);
  const source = raw && typeof raw === "object" ? raw : {};

  return {
    guild_id: guildId || toShortStringOrNull(source.guild_id, 64) || defaults.guild_id,
    enabled: toBool(source.enabled, defaults.enabled),
    mode: sanitizeVerificationMode(source.mode, defaults.mode),
    channel: toDiscordIdOrNull(source.channel),
    verified_role: toDiscordIdOrNull(source.verified_role),
    unverified_role: toDiscordIdOrNull(source.unverified_role),
    log_channel: toDiscordIdOrNull(source.log_channel),
    panel_message_id: toDiscordIdOrNull(source.panel_message_id),
    panel_title: toShortStringOrNull(source.panel_title, 100) || defaults.panel_title,
    panel_description:
      toShortStringOrNull(source.panel_description, 1000) || defaults.panel_description,
    panel_color: sanitizeHexColor(source.panel_color, defaults.panel_color),
    panel_image: toShortStringOrNull(source.panel_image, 500),
    question: toShortStringOrNull(source.question, 200) || defaults.question,
    question_answer:
      (toShortStringOrNull(source.question_answer, 100) || defaults.question_answer)
        .toLowerCase()
        .trim(),
    antiraid_enabled: toBool(source.antiraid_enabled, defaults.antiraid_enabled),
    antiraid_joins: toInt(source.antiraid_joins, 3, 50, defaults.antiraid_joins),
    antiraid_seconds: toInt(source.antiraid_seconds, 5, 60, defaults.antiraid_seconds),
    antiraid_action: sanitizeAntiRaidAction(source.antiraid_action, defaults.antiraid_action),
    dm_on_verify: toBool(source.dm_on_verify, defaults.dm_on_verify),
    kick_unverified_hours: toInt(
      source.kick_unverified_hours,
      0,
      168,
      defaults.kick_unverified_hours
    ),
    min_account_age_days: toInt(source.min_account_age_days, 0, 365, defaults.min_account_age_days || 0),
    risk_based_escalation: toBool(source.risk_based_escalation, defaults.risk_based_escalation || false),
    captcha_type: sanitizeCaptchaType(source.captcha_type, defaults.captcha_type || "math"),
    question_pool: sanitizeQuestionPool(source.question_pool),
  };
}

function sanitizeVerificationSettingsPatch(guildId, currentSettings, patch = {}) {
  const sourcePatch = patch && typeof patch === "object" ? patch : {};
  const merged = sanitizeVerificationSettingsRecord(guildId, {
    ...(currentSettings || {}),
    ...sourcePatch,
    guild_id: guildId,
  });
  const sanitizedPatch = {};
  const unknownKeys = [];

  for (const key of Object.keys(sourcePatch)) {
    if (!VERIF_SETTINGS_KEYS.has(key)) {
      unknownKeys.push(key);
      continue;
    }
    sanitizedPatch[key] = merged[key];
  }

  return { sanitizedPatch, unknownKeys, merged };
}

function hasVerificationSettingsDrift(rawSettings, sanitizedSettings) {
  if (!rawSettings || typeof rawSettings !== "object") return true;
  for (const key of VERIF_SETTINGS_KEYS) {
    if (JSON.stringify(rawSettings[key]) !== JSON.stringify(sanitizedSettings[key])) {
      return true;
    }
  }
  return false;
}

function buildVerificationMemberStateDefaults(guildId, userId) {
  return {
    guild_id: guildId,
    user_id: userId,
    status: "pending",
    is_verified: false,
    current_mode: null,
    join_count: 0,
    attempts_started: 0,
    failed_attempts_total: 0,
    active_failures: 0,
    code_failures: 0,
    question_failures: 0,
    code_sent_count: 0,
    code_resend_count: 0,
    joined_at: null,
    last_joined_at: null,
    last_started_at: null,
    last_code_sent_at: null,
    last_failed_at: null,
    verified_at: null,
    last_verified_at: null,
    kicked_at: null,
    unverified_at: null,
    cooldown_until: null,
    verified_by: null,
    unverified_by: null,
    last_reason: null,
    created_at: now(),
    updated_at: now(),
  };
}

function buildVerificationMetricsDefaults(guildId) {
  return {
    guild_id: guildId,
    total_events: 0,
    starts_total: 0,
    verified_total: 0,
    failed_total: 0,
    kicked_total: 0,
    force_verified_total: 0,
    force_unverified_total: 0,
    code_sent_total: 0,
    question_prompt_total: 0,
    antiraid_trigger_total: 0,
    permission_error_total: 0,
    panel_publish_total: 0,
    panel_publish_failed_total: 0,
    created_at: now(),
    updated_at: now(),
  };
}

function normalizeLogStatus(status, fallback = "info") {
  const normalized = String(status || "").trim().toLowerCase();
  if (!normalized) return fallback;
  if (normalized === "verified") return "verified";
  if (normalized === "failed") return "failed";
  if (normalized === "kicked") return "kicked";
  if (normalized === "unverified") return "unverified";
  if (normalized === "started") return "started";
  if (normalized === "code_sent") return "code_sent";
  if (normalized === "question_prompt") return "question_prompt";
  if (normalized === "anti_raid") return "anti_raid";
  if (normalized === "permission_error") return "permission_error";
  return normalized.slice(0, 40) || fallback;
}

function mapLegacyStatusToEvent(status) {
  const normalized = normalizeLogStatus(status);
  if (normalized === "verified") return "verified_success";
  if (normalized === "failed") return "verification_failed";
  if (normalized === "kicked") return "unverified_kicked";
  if (normalized === "unverified") return "manual_unverify";
  return normalized;
}

function sanitizeLogEntry(input) {
  const source = input && typeof input === "object" ? input : {};
  const guildId = String(source.guild_id || source.guildId || "").trim();
  const userId = toDiscordIdOrNull(source.user_id || source.userId);
  const actorId = toDiscordIdOrNull(source.actor_id || source.actorId);
  const status = normalizeLogStatus(source.status || "info");
  const event = toShortStringOrNull(source.event || mapLegacyStatusToEvent(status), 80) || "unknown";
  const mode = source.mode ? sanitizeVerificationMode(source.mode, null) : null;
  const reason = toShortStringOrNull(source.reason, 500);
  const metadata =
    source.metadata && typeof source.metadata === "object" && !Array.isArray(source.metadata)
      ? source.metadata
      : {};

  return {
    guild_id: guildId,
    user_id: userId,
    actor_id: actorId,
    status,
    event,
    mode,
    reason,
    source: toShortStringOrNull(source.source, 80) || "verification",
    metadata,
    created_at: toDateOrNull(source.created_at) || now(),
  };
}

function buildLegacyLogInput(guildId, userId, status, reason = null) {
  return {
    guild_id: guildId,
    user_id: userId,
    status,
    reason,
    event: mapLegacyStatusToEvent(status),
    source: "verification.legacy",
  };
}

function buildMetricPatchFromLogEntry(entry) {
  const increments = { total_events: 1 };
  const event = String(entry.event || "").trim().toLowerCase();
  const status = String(entry.status || "").trim().toLowerCase();

  if (event === "verification_started") increments.starts_total = 1;
  if (event === "code_sent") increments.code_sent_total = 1;
  if (event === "question_prompt_opened") increments.question_prompt_total = 1;
  if (event === "force_verified") increments.force_verified_total = 1;
  if (event === "force_unverified") increments.force_unverified_total = 1;
  if (event === "anti_raid_triggered") increments.antiraid_trigger_total = 1;
  if (event === "permission_error") increments.permission_error_total = 1;
  if (event === "panel_published") increments.panel_publish_total = 1;
  if (event === "panel_publish_failed") increments.panel_publish_failed_total = 1;

  if (status === "verified") increments.verified_total = 1;
  if (status === "failed") increments.failed_total = 1;
  if (status === "kicked") increments.kicked_total = 1;

  return increments;
}

function resolveStructuredLogLevel(entry) {
  const event = String(entry.event || "").trim().toLowerCase();
  if (event === "permission_error" || event === "panel_publish_failed") return "error";
  if (
    event === "verification_failed" ||
    event === "anti_raid_triggered" ||
    entry.status === "failed" ||
    entry.status === "kicked"
  ) {
    return "warn";
  }
  return "info";
}

function buildStructuredLogPayload(entry) {
  return {
    guildId: entry.guild_id,
    userId: entry.user_id || null,
    actorId: entry.actor_id || null,
    mode: entry.mode || null,
    status: entry.status || null,
    reason: entry.reason || null,
    ...(
      entry.metadata && typeof entry.metadata === "object"
        ? { metadata: entry.metadata }
        : {}
    ),
  };
}

const verifSettings = {
  collection() {
    return getDB().collection("verifSettings");
  },

  _default(guildId) {
    return sanitizeVerificationSettingsRecord(guildId, buildVerifSettingsDefaults(guildId));
  },

  async get(guildId) {
    try {
      validateInput(guildId, "string", { required: true });
      const existing = await this.collection().findOne({ guild_id: guildId });

      if (!existing) {
        const created = this._default(guildId);
        await this.collection().insertOne(created);
        return created;
      }

      const sanitized = sanitizeVerificationSettingsRecord(guildId, existing);
      if (hasVerificationSettingsDrift(existing, sanitized)) {
        await this.collection().updateOne({ guild_id: guildId }, { $set: sanitized });
      }

      return { ...existing, ...sanitized };
    } catch (error) {
      logError("verifSettings.get", error, { guildId });
      return this._default(guildId);
    }
  },

  async update(guildId, data, options = {}) {
    try {
      validateInput(guildId, "string", { required: true });

      const existing = await this.collection().findOne({ guild_id: guildId });
      const base = existing || this._default(guildId);
      const { sanitizedPatch, unknownKeys } = sanitizeVerificationSettingsPatch(
        guildId,
        base,
        data || {}
      );

      if (unknownKeys.length > 0) {
        logStructured('verification', 'warn', `Ignored keys: ${unknownKeys.join(", ")}`, { ignoredKeys: unknownKeys });
      }

      if (!existing) {
        const created = sanitizeVerificationSettingsRecord(guildId, { ...base, ...(data || {}) });
        await this.collection().insertOne(created);
        return created;
      }

      if (Object.keys(sanitizedPatch).length > 0) {
        await this.collection().updateOne({ guild_id: guildId }, { $set: sanitizedPatch });
      }

      if (!options.skipDashboardSync) {
        try {
          const { queueDashboardBridgeSync } = require("../dashboardBridgeSync");
          queueDashboardBridgeSync(null, {
            guildId,
            reason: options.dashboardSyncReason || "verifSettings.update",
            delayMs: 1500,
          });
        } catch (syncError) {
          logError("verifSettings.dashboardSync.update_queue", syncError, { guildId });
        }
      }

      return this.get(guildId);
    } catch (error) {
      if (isDbUnavailableError(error)) throw toDbUnavailableError(error, "verifSettings.update");
      logError("verifSettings.update", error, { guildId, data });
      return null;
    }
  },
};

const verifCodes = {
  collection() {
    return getDB().collection("verifCodes");
  },

  generateCode() {
    return crypto.randomBytes(6).toString("base64url").slice(0, 8).toUpperCase();
  },

  async generate(userId, guildId) {
    try {
      validateInput(userId, "string", { required: true });
      validateInput(guildId, "string", { required: true });

      const code = this.generateCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await this.collection().deleteMany({ user_id: userId, guild_id: guildId });
      await this.collection().insertOne({
        user_id: userId,
        guild_id: guildId,
        code,
        created_at: now(),
        expires_at: expiresAt,
      });

      return code;
    } catch (error) {
      logError("verifCodes.generate", error, { userId, guildId });
      throw error;
    }
  },

  async verify(userId, guildId, inputCode) {
    try {
      const entry = await this.collection().findOne({ user_id: userId, guild_id: guildId });
      if (!entry) return { valid: false, reason: "no_code" };

      if (new Date(entry.expires_at).getTime() < Date.now()) {
        await this.collection().deleteOne({ _id: entry._id });
        return { valid: false, reason: "expired" };
      }

      if (entry.code !== String(inputCode || "").toUpperCase().trim()) {
        return { valid: false, reason: "wrong" };
      }

      await this.collection().deleteOne({ _id: entry._id });
      return { valid: true };
    } catch (error) {
      logError("verifCodes.verify", error, { userId, guildId });
      return { valid: false, reason: "error" };
    }
  },

  async getActive(userId, guildId) {
    try {
      const entry = await this.collection().findOne({
        user_id: userId,
        guild_id: guildId,
        expires_at: { $gt: new Date() },
      });
      return entry ? entry.code : null;
    } catch (error) {
      logError("verifCodes.getActive", error, { userId, guildId });
      return null;
    }
  },

  async clearForUser(userId, guildId) {
    try {
      await this.collection().deleteMany({ user_id: userId, guild_id: guildId });
      return true;
    } catch (error) {
      logError("verifCodes.clearForUser", error, { userId, guildId });
      return false;
    }
  },

  async cleanup() {
    try {
      await this.collection().deleteMany({
        expires_at: { $lt: new Date() },
      });
    } catch (error) {
      logError("verifCodes.cleanup", error);
    }
  },
};

const verifMemberStates = {
  collection() {
    return getDB().collection("verifMemberStates");
  },

  _default(guildId, userId) {
    return buildVerificationMemberStateDefaults(guildId, userId);
  },

  async get(guildId, userId) {
    try {
      validateInput(guildId, "string", { required: true });
      validateInput(userId, "string", { required: true });
      const existing = await this.collection().findOne({ guild_id: guildId, user_id: userId });
      return existing || this._default(guildId, userId);
    } catch (error) {
      logError("verifMemberStates.get", error, { guildId, userId });
      return this._default(guildId, userId);
    }
  },

  async markJoined(guildId, userId, joinedAt = now()) {
    try {
      const timestamp = toDateOrNull(joinedAt) || now();
      await this.collection().updateOne(
        { guild_id: guildId, user_id: userId },
        {
          $setOnInsert: {
            ...this._default(guildId, userId),
            created_at: timestamp,
          },
          $set: {
            status: "pending",
            is_verified: false,
            joined_at: timestamp,
            last_joined_at: timestamp,
            current_mode: null,
            cooldown_until: null,
            kicked_at: null,
            unverified_at: null,
            verified_by: null,
            unverified_by: null,
            last_reason: "member_joined",
            updated_at: timestamp,
          },
          $inc: {
            join_count: 1,
          },
        },
        { upsert: true }
      );
      return this.get(guildId, userId);
    } catch (error) {
      logError("verifMemberStates.markJoined", error, { guildId, userId });
      return null;
    }
  },

  async markStarted(guildId, userId, mode, extra = {}) {
    try {
      const timestamp = now();
      await this.collection().updateOne(
        { guild_id: guildId, user_id: userId },
        {
          $setOnInsert: {
            ...this._default(guildId, userId),
            created_at: timestamp,
          },
          $set: {
            status: "pending",
            is_verified: false,
            current_mode: sanitizeVerificationMode(mode, "button"),
            last_started_at: timestamp,
            last_reason: toShortStringOrNull(extra.reason, 300) || "verification_started",
            updated_at: timestamp,
          },
          $inc: {
            attempts_started: 1,
          },
        },
        { upsert: true }
      );
      return this.get(guildId, userId);
    } catch (error) {
      logError("verifMemberStates.markStarted", error, { guildId, userId, mode });
      return null;
    }
  },

  async markCodeSent(guildId, userId, options = {}) {
    try {
      const timestamp = now();
      await this.collection().updateOne(
        { guild_id: guildId, user_id: userId },
        {
          $setOnInsert: {
            ...this._default(guildId, userId),
            created_at: timestamp,
          },
          $set: {
            current_mode: "code",
            last_code_sent_at: timestamp,
            last_reason: options.reason || "code_sent",
            updated_at: timestamp,
          },
          $inc: {
            code_sent_count: 1,
            ...(options.isResend ? { code_resend_count: 1 } : {}),
          },
        },
        { upsert: true }
      );
      return this.get(guildId, userId);
    } catch (error) {
      logError("verifMemberStates.markCodeSent", error, { guildId, userId });
      return null;
    }
  },

  async markFailed(guildId, userId, mode, reason, options = {}) {
    try {
      const timestamp = now();
      const normalizedMode = sanitizeVerificationMode(mode, "button");
      const cooldownUntil = toDateOrNull(options.cooldownUntil);
      await this.collection().updateOne(
        { guild_id: guildId, user_id: userId },
        {
          $setOnInsert: {
            ...this._default(guildId, userId),
            created_at: timestamp,
          },
          $set: {
            status: "failed",
            is_verified: false,
            current_mode: normalizedMode,
            last_failed_at: timestamp,
            last_reason: toShortStringOrNull(reason, 300) || "verification_failed",
            ...(cooldownUntil ? { cooldown_until: cooldownUntil } : {}),
            updated_at: timestamp,
          },
          $inc: {
            failed_attempts_total: 1,
            active_failures: 1,
            ...(normalizedMode === "code" ? { code_failures: 1 } : {}),
            ...(normalizedMode === "question" ? { question_failures: 1 } : {}),
          },
        },
        { upsert: true }
      );
      return this.get(guildId, userId);
    } catch (error) {
      logError("verifMemberStates.markFailed", error, { guildId, userId, mode, reason });
      return null;
    }
  },

  async markVerified(guildId, userId, options = {}) {
    try {
      const timestamp = now();
      await this.collection().updateOne(
        { guild_id: guildId, user_id: userId },
        {
          $setOnInsert: {
            ...this._default(guildId, userId),
            created_at: timestamp,
          },
          $set: {
            status: "verified",
            is_verified: true,
            current_mode: options.mode ? sanitizeVerificationMode(options.mode, "button") : null,
            verified_at: timestamp,
            last_verified_at: timestamp,
            verified_by: toDiscordIdOrNull(options.actorId),
            cooldown_until: null,
            active_failures: 0,
            last_reason: toShortStringOrNull(options.reason, 300) || "verified",
            updated_at: timestamp,
          },
        },
        { upsert: true }
      );
      return this.get(guildId, userId);
    } catch (error) {
      logError("verifMemberStates.markVerified", error, { guildId, userId, options });
      return null;
    }
  },

  async markUnverified(guildId, userId, options = {}) {
    try {
      const timestamp = now();
      await this.collection().updateOne(
        { guild_id: guildId, user_id: userId },
        {
          $setOnInsert: {
            ...this._default(guildId, userId),
            created_at: timestamp,
          },
          $set: {
            status: "unverified",
            is_verified: false,
            unverified_at: timestamp,
            unverified_by: toDiscordIdOrNull(options.actorId),
            cooldown_until: null,
            last_reason: toShortStringOrNull(options.reason, 300) || "manual_unverify",
            updated_at: timestamp,
          },
        },
        { upsert: true }
      );
      return this.get(guildId, userId);
    } catch (error) {
      logError("verifMemberStates.markUnverified", error, { guildId, userId, options });
      return null;
    }
  },

  async markKicked(guildId, userId, options = {}) {
    try {
      const timestamp = now();
      await this.collection().updateOne(
        { guild_id: guildId, user_id: userId },
        {
          $setOnInsert: {
            ...this._default(guildId, userId),
            created_at: timestamp,
          },
          $set: {
            status: "kicked",
            is_verified: false,
            kicked_at: timestamp,
            cooldown_until: null,
            last_reason: toShortStringOrNull(options.reason, 300) || "unverified_kicked",
            updated_at: timestamp,
          },
        },
        { upsert: true }
      );
      return this.get(guildId, userId);
    } catch (error) {
      logError("verifMemberStates.markKicked", error, { guildId, userId, options });
      return null;
    }
  },

  async listAutoKickCandidates(guildId, cutoffDate, limit = 500) {
    try {
      const cutoff = toDateOrNull(cutoffDate);
      if (!cutoff) return [];
      return await this.collection()
        .find({
          guild_id: guildId,
          is_verified: { $ne: true },
          joined_at: { $lte: cutoff },
          status: { $nin: ["kicked", "verified"] },
        })
        .sort({ joined_at: 1 })
        .limit(Math.max(1, Math.min(5000, Number(limit) || 500)))
        .toArray();
    } catch (error) {
      logError("verifMemberStates.listAutoKickCandidates", error, { guildId, cutoffDate, limit });
      return [];
    }
  },

  async countRecentJoins(guildId, sinceDate) {
    try {
      const since = toDateOrNull(sinceDate);
      if (!since) return 0;
      return await this.collection().countDocuments({
        guild_id: guildId,
        last_joined_at: { $gte: since },
      });
    } catch (error) {
      logError("verifMemberStates.countRecentJoins", error, { guildId, sinceDate });
      return 0;
    }
  },

  async setActiveQuestion(guildId, userId, questionData) {
    try {
      const timestamp = now();
      await this.collection().updateOne(
        { guild_id: guildId, user_id: userId },
        {
          $setOnInsert: {
            ...this._default(guildId, userId),
            created_at: timestamp,
          },
          $set: {
            active_question: {
              question: toShortStringOrNull(questionData.question, 200),
              answer: toShortStringOrNull(questionData.answer, 100),
              index: Number(questionData.index) || 0,
              set_at: timestamp,
            },
            updated_at: timestamp,
          },
        },
        { upsert: true }
      );
      return true;
    } catch (error) {
      logError("verifMemberStates.setActiveQuestion", error, { guildId, userId });
      return false;
    }
  },

  async getActiveQuestion(guildId, userId) {
    try {
      const state = await this.collection().findOne(
        { guild_id: guildId, user_id: userId },
        { projection: { active_question: 1 } }
      );
      return state?.active_question || null;
    } catch (error) {
      logError("verifMemberStates.getActiveQuestion", error, { guildId, userId });
      return null;
    }
  },

  async clearActiveQuestion(guildId, userId) {
    try {
      await this.collection().updateOne(
        { guild_id: guildId, user_id: userId },
        { $unset: { active_question: "" }, $set: { updated_at: now() } }
      );
      return true;
    } catch (error) {
      logError("verifMemberStates.clearActiveQuestion", error, { guildId, userId });
      return false;
    }
  },

  async getStatusCounts(guildId) {
    try {
      const rows = await this.collection()
        .aggregate([
          { $match: { guild_id: guildId } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ])
        .toArray();

      const out = {
        pending: 0,
        failed: 0,
        verified: 0,
        unverified: 0,
        kicked: 0,
      };

      for (const row of rows) {
        const key = String(row?._id || "").trim().toLowerCase();
        if (MEMBER_STATUS_SET.has(key)) {
          out[key] = Number(row?.count || 0);
        }
      }

      return out;
    } catch (error) {
      logError("verifMemberStates.getStatusCounts", error, { guildId });
      return {
        pending: 0,
        failed: 0,
        verified: 0,
        unverified: 0,
        kicked: 0,
      };
    }
  },
};

const verifMetrics = {
  collection() {
    return getDB().collection("verifMetrics");
  },

  _default(guildId) {
    return buildVerificationMetricsDefaults(guildId);
  },

  async get(guildId) {
    try {
      validateInput(guildId, "string", { required: true });
      const existing = await this.collection().findOne({ guild_id: guildId });
      if (existing) {
        return { ...this._default(guildId), ...existing };
      }

      const created = this._default(guildId);
      await this.collection().insertOne(created);
      return created;
    } catch (error) {
      logError("verifMetrics.get", error, { guildId });
      return this._default(guildId);
    }
  },

  async inc(guildId, increments = {}) {
    try {
      validateInput(guildId, "string", { required: true });
      const safeInc = {};
      for (const [key, value] of Object.entries(increments || {})) {
        if (!METRIC_FIELDS.has(key)) continue;
        const amount = Number(value);
        if (!Number.isFinite(amount) || amount === 0) continue;
        safeInc[key] = amount;
      }

      if (Object.keys(safeInc).length === 0) {
        return this.get(guildId);
      }

      const timestamp = now();
      await this.collection().updateOne(
        { guild_id: guildId },
        {
          $setOnInsert: {
            ...this._default(guildId),
            created_at: timestamp,
          },
          $inc: safeInc,
          $set: {
            updated_at: timestamp,
          },
        },
        { upsert: true }
      );

      return this.get(guildId);
    } catch (error) {
      logError("verifMetrics.inc", error, { guildId, increments });
      return this._default(guildId);
    }
  },
};

const verifLogs = {
  collection() {
    return getDB().collection("verifLogs");
  },

  async add(...args) {
    try {
      const input =
        args.length >= 3 && typeof args[0] === "string"
          ? buildLegacyLogInput(args[0], args[1], args[2], args[3] || null)
          : args[0];
      const entry = sanitizeLogEntry(input);

      if (!entry.guild_id) return null;

      await this.collection().insertOne(entry);
      await verifMetrics.inc(entry.guild_id, buildMetricPatchFromLogEntry(entry));

      await auditLogs.add({
        guild_id: entry.guild_id,
        actor_id: entry.actor_id || null,
        target_id: entry.user_id || null,
        kind: "verification",
        action: entry.event,
        status: entry.status,
        source: entry.source,
        metadata: {
          ...(entry.mode ? { mode: entry.mode } : {}),
          ...(entry.reason ? { reason: entry.reason } : {}),
          ...(entry.metadata || {}),
        },
      });

      logStructured(
        resolveStructuredLogLevel(entry),
        `verification.${entry.event}`,
        buildStructuredLogPayload(entry)
      );

      return entry;
    } catch (error) {
      logError("verifLogs.add", error, { argsLength: args.length });
      return null;
    }
  },

  async getStats(guildId) {
    try {
      const [metrics, statusCounts, total, aggregated] = await Promise.all([
        verifMetrics.get(guildId),
        verifMemberStates.getStatusCounts(guildId),
        this.collection().countDocuments({ guild_id: guildId }),
        this.collection()
          .aggregate([
            { $match: { guild_id: guildId } },
            {
              $group: {
                _id: null,
                verified: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "verified"] }, 1, 0],
                  },
                },
                failed: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "failed"] }, 1, 0],
                  },
                },
                kicked: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "kicked"] }, 1, 0],
                  },
                },
                starts: {
                  $sum: {
                    $cond: [{ $eq: ["$event", "verification_started"] }, 1, 0],
                  },
                },
                force_verified: {
                  $sum: {
                    $cond: [{ $eq: ["$event", "force_verified"] }, 1, 0],
                  },
                },
                force_unverified: {
                  $sum: {
                    $cond: [{ $eq: ["$event", "force_unverified"] }, 1, 0],
                  },
                },
                code_sent: {
                  $sum: {
                    $cond: [{ $eq: ["$event", "code_sent"] }, 1, 0],
                  },
                },
                question_prompt: {
                  $sum: {
                    $cond: [{ $eq: ["$event", "question_prompt_opened"] }, 1, 0],
                  },
                },
                anti_raid_triggers: {
                  $sum: {
                    $cond: [{ $eq: ["$event", "anti_raid_triggered"] }, 1, 0],
                  },
                },
                permission_errors: {
                  $sum: {
                    $cond: [{ $eq: ["$event", "permission_error"] }, 1, 0],
                  },
                },
              },
            },
          ])
          .toArray(),
      ]);
      const fallback = aggregated[0] || {};

      return {
        total,
        verified: metrics.verified_total || fallback.verified || 0,
        failed: metrics.failed_total || fallback.failed || 0,
        kicked: metrics.kicked_total || fallback.kicked || 0,
        starts: metrics.starts_total || fallback.starts || 0,
        force_verified: metrics.force_verified_total || fallback.force_verified || 0,
        force_unverified: metrics.force_unverified_total || fallback.force_unverified || 0,
        code_sent: metrics.code_sent_total || fallback.code_sent || 0,
        question_prompt: metrics.question_prompt_total || fallback.question_prompt || 0,
        anti_raid_triggers: metrics.antiraid_trigger_total || fallback.anti_raid_triggers || 0,
        permission_errors: metrics.permission_error_total || fallback.permission_errors || 0,
        panel_published: metrics.panel_publish_total || 0,
        panel_publish_failed: metrics.panel_publish_failed_total || 0,
        pending_members: (statusCounts.pending || 0) + (statusCounts.failed || 0) + (statusCounts.unverified || 0),
        verified_members: statusCounts.verified || 0,
      };
    } catch (error) {
      logError("verifLogs.getStats", error, { guildId });
      return {
        total: 0,
        verified: 0,
        failed: 0,
        kicked: 0,
        starts: 0,
        force_verified: 0,
        force_unverified: 0,
        code_sent: 0,
        question_prompt: 0,
        anti_raid_triggers: 0,
        permission_errors: 0,
        panel_published: 0,
        panel_publish_failed: 0,
        pending_members: 0,
        verified_members: 0,
      };
    }
  },

  async getRecent(guildId, limit = 5) {
    try {
      return await this.collection()
        .find({ guild_id: guildId })
        .sort({ created_at: -1 })
        .limit(Math.max(1, Math.min(100, Number(limit) || 5)))
        .toArray();
    } catch (error) {
      logError("verifLogs.getRecent", error, { guildId, limit });
      return [];
    }
  },
};

const verifCaptchas = {
  collection() {
    return getDB().collection("verifCaptchas");
  },

  async generate(userId, guildId, captchaData) {
    try {
      validateInput(userId, "string", { required: true });
      validateInput(guildId, "string", { required: true });

      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      await this.collection().deleteMany({ user_id: userId, guild_id: guildId });
      await this.collection().insertOne({
        user_id: userId,
        guild_id: guildId,
        question: captchaData.question,
        answer: String(captchaData.answer),
        valid_answers: captchaData.validAnswers || [String(captchaData.answer)],
        type: captchaData.type || "math",
        created_at: now(),
        expires_at: expiresAt,
      });

      return captchaData;
    } catch (error) {
      logError("verifCaptchas.generate", error, { userId, guildId });
      throw error;
    }
  },

  async verify(userId, guildId, inputAnswer) {
    try {
      const entry = await this.collection().findOne({ user_id: userId, guild_id: guildId });
      if (!entry) return { valid: false, reason: "no_captcha" };

      if (new Date(entry.expires_at).getTime() < Date.now()) {
        await this.collection().deleteOne({ _id: entry._id });
        return { valid: false, reason: "expired" };
      }

      const normalized = String(inputAnswer || "").trim().toLowerCase();
      const validAnswers = entry.valid_answers || [entry.answer];
      const isCorrect = validAnswers.some(
        (valid) => String(valid).toLowerCase() === normalized
      );

      if (!isCorrect) {
        return { valid: false, reason: "wrong" };
      }

      await this.collection().deleteOne({ _id: entry._id });
      return { valid: true };
    } catch (error) {
      logError("verifCaptchas.verify", error, { userId, guildId });
      return { valid: false, reason: "error" };
    }
  },

  async getActive(userId, guildId) {
    try {
      const entry = await this.collection().findOne({
        user_id: userId,
        guild_id: guildId,
        expires_at: { $gt: new Date() },
      });
      return entry || null;
    } catch (error) {
      logError("verifCaptchas.getActive", error, { userId, guildId });
      return null;
    }
  },

  async clearForUser(userId, guildId) {
    try {
      await this.collection().deleteMany({ user_id: userId, guild_id: guildId });
      return true;
    } catch (error) {
      logError("verifCaptchas.clearForUser", error, { userId, guildId });
      return false;
    }
  },

  async cleanup() {
    try {
      await this.collection().deleteMany({
        expires_at: { $lt: new Date() },
      });
    } catch (error) {
      logError("verifCaptchas.cleanup", error);
    }
  },
};

module.exports = {
  sanitizeVerificationSettingsRecord,
  sanitizeVerificationSettingsPatch,
  verifSettings,
  verifCodes,
  verifCaptchas,
  verifMemberStates,
  verifMetrics,
  verifLogs,
};
