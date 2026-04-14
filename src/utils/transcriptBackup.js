"use strict";

/**
 * Transcript Backup Service
 * guarda transcripts en múltiples ubicaciones para disaster recovery
 */

const { logStructured } = require("./observability");
const { getDB } = require("./database");

const CONFIG = {
  enableBackup: process.env.TRANSCRIPT_BACKUP_ENABLED === 'true',
  backupToMongo: process.env.TRANSCRIPT_BACKUP_TO_MONGO !== 'false',
  maxRetries: parseInt(process.env.TRANSCRIPT_MAX_RETRIES, 10) || 3,
  retryDelayMs: parseInt(process.env.TRANSCRIPT_RETRY_DELAY_MS, 10) || 1000,
};

class TranscriptBackup {
  constructor() {
    this.failedBackups = new Map();
  }

  async save(ticketId, content, metadata = {}) {
    const results = {
      mongo: { success: false, error: null },
    };

    if (CONFIG.backupToMongo) {
      results.mongo = await this.saveToMongo(ticketId, content, metadata);
    }

    const hasFailure = Object.values(results).some(r => !r.success);
    
    if (hasFailure) {
      logStructured("warn", "transcript.backup.partial", {
        ticketId,
        results,
      });
    } else {
      logStructured("info", "transcript.backup.success", { ticketId });
    }

    return results;
  }

  async saveToMongo(ticketId, content, metadata = {}) {
    for (let attempt = 1; attempt <= CONFIG.maxRetries; attempt++) {
      try {
        const db = getDB();
        if (!db) {
          throw new Error('Database not connected');
        }

        await db.collection('transcript_backups').insertOne({
          ticket_id: ticketId,
          content,
          metadata: {
            ...metadata,
            backed_up_at: new Date(),
          },
          created_at: new Date(),
        });

        return { success: true };
      } catch (error) {
        logStructured("warn", "transcript.backup.retry", {
          ticketId,
          attempt,
          error: error.message,
        });

        if (attempt < CONFIG.maxRetries) {
          await new Promise(r => setTimeout(r, CONFIG.retryDelayMs * attempt));
        }
      }
    }

    return { success: false, error: 'Max retries exceeded' };
  }

  async getBackup(ticketId) {
    try {
      const db = getDB();
      if (!db) return null;

      const backup = await db.collection('transcript_backups')
        .findOne({ ticket_id: ticketId }, { sort: { created_at: -1 } });

      return backup;
    } catch (error) {
      logStructured("error", "transcript.backup.get_failed", {
        ticketId,
        error: error.message,
      });
      return null;
    }
  }

  async cleanupOldBackups(daysToKeep = 30) {
    try {
      const db = getDB();
      if (!db) return 0;

      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - daysToKeep);

      const result = await db.collection('transcript_backups')
        .deleteMany({ created_at: { $lt: cutoff } });

      logStructured("info", "transcript.backup.cleanup", {
        deleted: result.deletedCount,
      });

      return result.deletedCount;
    } catch (error) {
      logStructured("error", "transcript.backup.cleanup_failed", {
        error: error.message,
      });
      return 0;
    }
  }
}

const transcriptBackup = new TranscriptBackup();

module.exports = {
  transcriptBackup,
  TranscriptBackup,
};