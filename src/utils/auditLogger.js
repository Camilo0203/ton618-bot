"use strict";

/**
 * Audit Logger - Tracks admin and sensitive operations
 * Provides forensic trail for security analysis
 */

const { getDB } = require("./database/core");
const { sanitizeMongoString } = require("./mongoSanitizer");

// Operations that should always be logged
const SENSITIVE_OPERATIONS = new Set([
  'proadmin.generate',
  'proadmin.revoke',
  'config.backup.restore',
  'config.settings.update',
  'moderation.ban',
  'moderation.kick',
  'moderation.mute',
  'moderation.warn',
  'moderation.unban',
  'staff.grant',
  'staff.revoke',
  'ticket.transcript.export',
  'ticket.delete',
  'verification.bypass',
  'giveaway.reroll',
  'poll.delete',
  'suggestion.delete',
]);

// Fields that should never be logged (PII/sensitive)
const NEVER_LOG_FIELDS = new Set([
  'password',
  'secret',
  'token',
  'api_key',
  'webhook_token',
  'private_key',
  'email',
  'phone',
  'ip_address',
  'session_id',
  'cookie',
  'credit_card',
  'ssn',
  'personal_id',
]);

/**
 * Sanitize data for audit logging - remove PII and sensitive info
 * @param {object} data - Data to sanitize
 * @returns {object} - Sanitized data
 */
function sanitizeAuditData(data) {
  if (!data || typeof data !== 'object') return data;
  
  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    
    // Skip sensitive fields entirely
    if (NEVER_LOG_FIELDS.has(lowerKey) || NEVER_LOG_FIELDS.has(key)) {
      sanitized[key] = '[REDACTED]';
      continue;
    }
    
    // Recursively sanitize nested objects
    if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeAuditData(value);
    } else if (typeof value === 'string') {
      // Limit string length
      sanitized[key] = sanitizeMongoString(value, 1000);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Create an audit log entry
 * @param {object} entry - Audit entry data
 * @returns {Promise<object>} - Created entry
 */
async function createAuditEntry(entry) {
  try {
    const db = getDB();
    const collection = db.collection('audit_trail');
    
    const sanitizedEntry = {
      ...entry,
      details: sanitizeAuditData(entry.details || {}),
      before_state: sanitizeAuditData(entry.before_state || {}),
      after_state: sanitizeAuditData(entry.after_state || {}),
    };
    
    const result = await collection.insertOne({
      ...sanitizedEntry,
      created_at: new Date(),
      _id: new (require('mongodb').ObjectId)(),
    });
    
    return result;
  } catch (error) {
    // Don't throw - audit logging should never break the main flow
    console.error('[AUDIT] Failed to create audit entry:', error.message);
    return null;
  }
}

/**
 * Log a command execution
 * @param {object} context - Command context
 * @returns {Promise<void>}
 */
async function logCommandExecution(context) {
  const {
    commandName,
    subcommand,
    userId,
    userTag,
    guildId,
    guildName,
    channelId,
    options = {},
    success = true,
    errorMessage = null,
    executionTimeMs = 0,
  } = context;
  
  const operation = `${commandName}.${subcommand || 'main'}`;
  
  // Always log sensitive operations
  const isSensitive = SENSITIVE_OPERATIONS.has(operation) || 
                      SENSITIVE_OPERATIONS.has(commandName);
  
  // In production, only log sensitive operations or failures
  if (process.env.NODE_ENV === 'production' && !isSensitive && success) {
    return;
  }
  
  const entry = {
    type: 'command_execution',
    operation,
    severity: isSensitive ? 'high' : (success ? 'info' : 'warning'),
    actor: {
      user_id: userId,
      user_tag: userTag,
    },
    target: {
      guild_id: guildId,
      guild_name: sanitizeMongoString(guildName, 100),
      channel_id: channelId,
    },
    details: {
      options: sanitizeAuditData(options),
      execution_time_ms: executionTimeMs,
      success,
      error: errorMessage ? sanitizeMongoString(errorMessage, 500) : null,
    },
    metadata: {
      is_sensitive: isSensitive,
      ip_address: null, // Don't log IP addresses (GDPR/privacy)
      user_agent: null, // Don't log user agents
    },
  };
  
  await createAuditEntry(entry);
  
  // Also log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[AUDIT] ${operation} by ${userTag} in ${guildName}: ${success ? 'SUCCESS' : 'FAILED'}`);
  }
}

/**
 * Log admin action with before/after state
 * @param {object} context - Admin action context
 * @returns {Promise<void>}
 */
async function logAdminAction(context) {
  const {
    action,
    actorId,
    actorTag,
    targetId,
    targetType,
    guildId,
    guildName,
    beforeState,
    afterState,
    reason,
  } = context;
  
  const entry = {
    type: 'admin_action',
    operation: action,
    severity: 'high',
    actor: {
      user_id: actorId,
      user_tag: actorTag,
    },
    target: {
      target_id: targetId,
      target_type: targetType,
      guild_id: guildId,
      guild_name: sanitizeMongoString(guildName, 100),
    },
    details: {
      reason: reason ? sanitizeMongoString(reason, 500) : null,
    },
    before_state: beforeState || {},
    after_state: afterState || {},
    metadata: {
      is_sensitive: true,
    },
  };
  
  await createAuditEntry(entry);
  
  // Always log admin actions to console for monitoring
  console.log(`[AUDIT:ADMIN] ${action} by ${actorTag} -> ${targetType}:${targetId} in ${guildName}`);
}

/**
 * Log authentication event
 * @param {object} context - Auth context
 * @returns {Promise<void>}
 */
async function logAuthEvent(context) {
  const {
    event, // 'login', 'logout', 'failed_login', 'token_refresh'
    userId,
    userTag,
    success,
    failureReason,
    metadata = {},
  } = context;
  
  // Never log successful auth tokens, only failures for security monitoring
  const entry = {
    type: 'auth_event',
    operation: `auth.${event}`,
    severity: success ? 'info' : 'warning',
    actor: {
      user_id: userId,
      user_tag: userTag,
    },
    target: {},
    details: {
      success,
      failure_reason: failureReason ? sanitizeMongoString(failureReason, 200) : null,
      // Don't include tokens, IPs, or other sensitive data
      attempt_count: metadata.attempt_count || 1,
    },
    metadata: {
      is_sensitive: !success, // Failed logins are sensitive (possible attacks)
    },
  };
  
  await createAuditEntry(entry);
}

/**
 * Query audit trail with filters
 * @param {object} filters - Query filters
 * @param {object} options - Query options (limit, offset, sort)
 * @returns {Promise<Array>} - Audit entries
 */
async function queryAuditTrail(filters = {}, options = {}) {
  try {
    const db = getDB();
    const collection = db.collection('audit_trail');
    
    const {
      type,
      operation,
      severity,
      userId,
      guildId,
      startDate,
      endDate,
    } = filters;
    
    const query = {};
    if (type) query.type = type;
    if (operation) query.operation = operation;
    if (severity) query.severity = severity;
    if (userId) query['actor.user_id'] = userId;
    if (guildId) query['target.guild_id'] = guildId;
    if (startDate || endDate) {
      query.created_at = {};
      if (startDate) query.created_at.$gte = new Date(startDate);
      if (endDate) query.created_at.$lte = new Date(endDate);
    }
    
    const limit = Math.min(options.limit || 100, 1000); // Max 1000 results
    const skip = options.offset || 0;
    const sort = options.sort || { created_at: -1 };
    
    const entries = await collection
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();
    
    return entries;
  } catch (error) {
    console.error('[AUDIT] Failed to query audit trail:', error.message);
    return [];
  }
}

/**
 * Get audit statistics
 * @param {object} filters - Date range filters
 * @returns {Promise<object>} - Statistics
 */
async function getAuditStats(filters = {}) {
  try {
    const db = getDB();
    const collection = db.collection('audit_trail');
    
    const { startDate, endDate } = filters;
    const query = {};
    if (startDate || endDate) {
      query.created_at = {};
      if (startDate) query.created_at.$gte = new Date(startDate);
      if (endDate) query.created_at.$lte = new Date(endDate);
    }
    
    const stats = await collection.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total_entries: { $sum: 1 },
          by_type: { $push: '$type' },
          by_severity: { $push: '$severity' },
          failed_operations: {
            $sum: { $cond: [{ $eq: ['$details.success', false] }, 1, 0] }
          },
        },
      },
    ]).toArray();
    
    return stats[0] || { total_entries: 0 };
  } catch (error) {
    console.error('[AUDIT] Failed to get audit stats:', error.message);
    return { total_entries: 0 };
  }
}

module.exports = {
  SENSITIVE_OPERATIONS,
  NEVER_LOG_FIELDS,
  createAuditEntry,
  logCommandExecution,
  logAdminAction,
  logAuthEvent,
  queryAuditTrail,
  getAuditStats,
  sanitizeAuditData,
};
