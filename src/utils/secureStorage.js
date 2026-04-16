"use strict";

/**
 * Secure Storage Service
 * Automatically encrypts/decrypts sensitive fields in database operations
 */

const { encrypt, decrypt, isEncryptionEnabled, mask } = require("./cryptoService");
const { getDB } = require("./database/core");
const logger = require("./structuredLogger");

// Fields that should be encrypted automatically
const SENSITIVE_FIELDS = [
  // API Keys and tokens
  "api_key",
  "api_secret",
  "token",
  "access_token",
  "refresh_token",
  "webhook_secret",
  "webhook_token",
  "bot_token",
  "discord_token",
  
  // OAuth credentials
  "oauth_secret",
  "client_secret",
  "app_secret",
  
  // Payment/Pro codes (when stored)
  "activation_code",
  "license_key",
  
  // Webhook URLs with tokens
  "webhook_url", // If contains token in URL
];

/**
 * Check if a field should be encrypted
 */
function isSensitiveField(fieldName) {
  const lowerName = fieldName.toLowerCase();
  return SENSITIVE_FIELDS.some((field) => lowerName.includes(field));
}

/**
 * Encrypt sensitive fields in an object
 */
function encryptSensitiveFields(obj) {
  if (!obj || typeof obj !== "object" || !isEncryptionEnabled()) {
    return obj;
  }

  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (isSensitiveField(key) && typeof value === "string" && value.length > 0) {
      result[key] = encrypt(value);
      result[`${key}_enc`] = true; // Flag indicating encryption
    } else if (typeof value === "object" && value !== null) {
      // Recursively encrypt nested objects
      result[key] = encryptSensitiveFields(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Decrypt sensitive fields in an object
 */
function decryptSensitiveFields(obj) {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skip encryption flags
    if (key.endsWith("_enc")) {
      continue;
    }

    // Check if this field was encrypted
    const encFlag = obj[`${key}_enc`];
    if (encFlag && typeof value === "string") {
      try {
        result[key] = decrypt(value);
      } catch (error) {
        logger.error("secureStorage", `Failed to decrypt ${key}`, { error: error.message });
        result[key] = value; // Keep encrypted on error
      }
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      // Recursively decrypt nested objects
      result[key] = decryptSensitiveFields(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Create secure collection wrapper
 * Automatically encrypts on insert/update, decrypts on find
 */
function createSecureCollection(collectionName) {
  const db = getDB();
  const collection = db.collection(collectionName);

  return {
    // Insert with encryption
    async insertOne(doc, options = {}) {
      const encryptedDoc = encryptSensitiveFields(doc);
      return collection.insertOne(encryptedDoc, options);
    },

    // Insert many with encryption
    async insertMany(docs, options = {}) {
      const encryptedDocs = docs.map((doc) => encryptSensitiveFields(doc));
      return collection.insertMany(encryptedDocs, options);
    },

    // Update with encryption
    async updateOne(filter, update, options = {}) {
      // Encrypt $set values if present
      if (update.$set) {
        update.$set = encryptSensitiveFields(update.$set);
      }
      // Encrypt $setOnInsert if present
      if (update.$setOnInsert) {
        update.$setOnInsert = encryptSensitiveFields(update.$setOnInsert);
      }
      return collection.updateOne(filter, update, options);
    },

    // Update many with encryption
    async updateMany(filter, update, options = {}) {
      if (update.$set) {
        update.$set = encryptSensitiveFields(update.$set);
      }
      return collection.updateMany(filter, update, options);
    },

    // Find with automatic decryption
    async findOne(query, options = {}) {
      const result = await collection.findOne(query, options);
      return result ? decryptSensitiveFields(result) : null;
    },

    // Find many with automatic decryption
    async find(query, options = {}) {
      const cursor = collection.find(query, options);
      const results = await cursor.toArray();
      return results.map((doc) => decryptSensitiveFields(doc));
    },

    // Find with limit
    async findToArray(query, options = {}) {
      return this.find(query, options);
    },

    // Delete operations (no encryption needed)
    async deleteOne(filter, options = {}) {
      return collection.deleteOne(filter, options);
    },

    async deleteMany(filter, options = {}) {
      return collection.deleteMany(filter, options);
    },

    // Aggregation (results decrypted)
    async aggregate(pipeline, options = {}) {
      const cursor = collection.aggregate(pipeline, options);
      const results = await cursor.toArray();
      return results.map((doc) => decryptSensitiveFields(doc));
    },

    // Count (no decryption needed)
    async countDocuments(query, options = {}) {
      return collection.countDocuments(query, options);
    },

    // Raw collection access for advanced operations
    getRawCollection() {
      return collection;
    },
  };
}

/**
 * Secure storage for specific entity types
 */
const secureStorage = {
  // Settings with encrypted sensitive fields
  settings() {
    return createSecureCollection("settings");
  },

  // Verification settings
  verifSettings() {
    return createSecureCollection("verifSettings");
  },

  // Auto responses
  autoResponses() {
    return createSecureCollection("autoResponses");
  },

  // Generic secure collection
  collection(name) {
    return createSecureCollection(name);
  },
};

module.exports = {
  SENSITIVE_FIELDS,
  isSensitiveField,
  encryptSensitiveFields,
  decryptSensitiveFields,
  createSecureCollection,
  secureStorage,
  mask,
};
