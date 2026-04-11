"use strict";

/**
 * MongoDB Sanitizer - Prevents NoSQL Injection attacks
 * Sanitizes keys and values before they are used in MongoDB queries
 */

// Keys that could enable NoSQL injection operators
const DANGEROUS_KEY_PATTERNS = [
  /^\$/,          // MongoDB operators start with $
  /^\./,          // Dot notation can be exploited
];

// Operators that are safe to use (read-only, non-destructive)
const SAFE_OPERATORS = new Set([
  '$eq', '$ne', '$gt', '$gte', '$lt', '$lte', '$in', '$nin',
  '$exists', '$type', '$regex', '$options', '$mod', '$text',
  '$search', '$language', '$caseSensitive', '$diacriticSensitive'
]);

// Operators that are dangerous (can modify data or execute code)
const DANGEROUS_OPERATORS = new Set([
  '$where', '$accumulator', '$function', '$accumulator', '$accumulator',
  '$map', '$reduce', '$filter', '$mergeObjects', '$replaceRoot',
  '$replaceWith', '$set', '$unset', '$inc', '$mul', '$rename',
  '$setOnInsert', '$setWindowFields', '$jsSchema'
]);

/**
 * Check if a key contains potentially dangerous patterns
 * @param {string} key - Object key to check
 * @returns {boolean}
 */
function isDangerousKey(key) {
  if (typeof key !== 'string') return false;
  return DANGEROUS_KEY_PATTERNS.some(pattern => pattern.test(key));
}

/**
 * Sanitize an object key by replacing dangerous characters
 * @param {string} key - Key to sanitize
 * @returns {string}
 */
function sanitizeKey(key) {
  if (typeof key !== 'string') return key;
  
  // Replace $ at start with _
  if (key.startsWith('$')) {
    return '_' + key.substring(1);
  }
  
  // Replace dots with unicode equivalent to prevent injection
  return key.replace(/\./g, '\uFF0E');
}

/**
 * Deep sanitize an object for MongoDB queries
 * Prevents NoSQL injection by sanitizing keys and checking operators
 * @param {object} obj - Object to sanitize
 * @param {object} options - Sanitization options
 * @param {boolean} options.allowOperators - Whether to allow safe MongoDB operators
 * @param {number} options.maxDepth - Maximum recursion depth
 * @param {number} _currentDepth - Internal depth tracker
 * @returns {object}
 */
function sanitizeMongoObject(obj, options = {}, _currentDepth = 0) {
  const { allowOperators = true, maxDepth = 10 } = options;
  
  // Prevent deep recursion attacks
  if (_currentDepth > maxDepth) {
    throw new Error('Sanitization depth exceeded - possible nested object attack');
  }
  
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeMongoObject(item, options, _currentDepth + 1));
  }
  
  const sanitized = {};
  
  for (const [key, value] of Object.entries(obj)) {
    // Check for dangerous operators
    if (key.startsWith('$')) {
      if (!allowOperators) {
        // Remove all operators
        continue;
      }
      
      if (DANGEROUS_OPERATORS.has(key)) {
        // Log and skip dangerous operators
        console.warn(`[MONGO-SANITIZER] Dangerous operator blocked: ${key}`);
        continue;
      }
      
      // Allow safe operators
      if (SAFE_OPERATORS.has(key)) {
        sanitized[key] = sanitizeMongoObject(value, options, _currentDepth + 1);
        continue;
      }
      
      // Unknown operator - sanitize it
      const safeKey = sanitizeKey(key);
      console.warn(`[MONGO-SANITIZER] Unknown operator sanitized: ${key} -> ${safeKey}`);
      sanitized[safeKey] = sanitizeMongoObject(value, options, _currentDepth + 1);
      continue;
    }
    
    // Sanitize regular keys that might contain dots
    const safeKey = isDangerousKey(key) ? sanitizeKey(key) : key;
    
    // Recursively sanitize nested objects
    sanitized[safeKey] = sanitizeMongoObject(value, options, _currentDepth + 1);
  }
  
  return sanitized;
}

/**
 * Sanitize a string for use in MongoDB queries
 * @param {string} str - String to sanitize
 * @param {number} maxLength - Maximum length
 * @returns {string}
 */
function sanitizeMongoString(str, maxLength = 1000) {
  if (typeof str !== 'string') return '';
  
  // Remove null bytes
  let sanitized = str.replace(/\x00/g, '');
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

/**
 * Validate and sanitize a MongoDB ID
 * @param {string} id - ID to validate
 * @returns {string|null} - Sanitized ID or null if invalid
 */
function sanitizeMongoId(id) {
  if (typeof id !== 'string') return null;
  
  // Remove any non-alphanumeric characters (MongoDB ObjectIds are hex)
  const sanitized = id.replace(/[^a-fA-F0-9]/g, '');
  
  // ObjectId is 24 hex characters
  if (sanitized.length !== 24) {
    return null;
  }
  
  return sanitized;
}

/**
 * Create a safe MongoDB query wrapper
 * @param {Function} queryFn - Original query function
 * @returns {Function} - Wrapped query function
 */
function createSafeQueryWrapper(queryFn) {
  return async function safeQuery(collection, operation, query, ...args) {
    // Sanitize query before execution
    const sanitizedQuery = sanitizeMongoObject(query, { allowOperators: true });
    
    // Log in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('[MONGO-SANITIZER] Query sanitized:', { original: query, sanitized: sanitizedQuery });
    }
    
    return queryFn(collection, operation, sanitizedQuery, ...args);
  };
}

module.exports = {
  isDangerousKey,
  sanitizeKey,
  sanitizeMongoObject,
  sanitizeMongoString,
  sanitizeMongoId,
  createSafeQueryWrapper,
  SAFE_OPERATORS,
  DANGEROUS_OPERATORS,
};
