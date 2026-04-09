# Utils Folder Structure

This directory contains utility modules organized by domain. Each module should have a single responsibility and be well-documented.

## 📁 Directory Structure

```
src/utils/
├── database/              # Database operations
│   ├── core.js           # MongoDB connection & indexes
│   ├── helpers.js        # Generic DB helpers
│   ├── index.js          # Database exports
│   ├── tickets.js        # Ticket operations
│   ├── settings.js       # Guild settings
│   └── ...
├── dashboardBridge/       # Dashboard sync
│   ├── config.js         # Config sync
│   ├── tickets.js        # Ticket sync
│   ├── metrics.js        # Metrics sync
│   └── ...
├── services/             # Business logic services
│   └── premiumService.js # Premium status management
├── validators/           # Input validation
│   └── envValidator.js   # Environment validation
├── logging/              # Logging utilities
│   └── structuredLogger.js # Structured logging
├── security/             # Security utilities
│   ├── inputSanitizer.js # Input sanitization
│   └── permissionValidator.js # Permission checks
├── i18n/                   # Internationalization
│   └── i18n.js           # Localization helpers
├── crons/                  # Cron jobs (future)
└── misc/                   # Misc utilities
    └── ...
```

## 🎯 Guidelines

### File Organization

1. **Single Responsibility**: Each file should do one thing well
2. **Clear Naming**: Use descriptive names (e.g., `ticketEmbedUpdater.js` not `utils.js`)
3. **Exports**: Use named exports for clarity
4. **Documentation**: Add JSDoc comments for all public functions

### Adding New Files

```javascript
/**
 * Brief description of the module
 * 
 * @module utils/category/fileName
 * 
 * @example
 * const { myFunction } = require('./category/fileName');
 * const result = myFunction(args);
 */

'use strict';

const logger = require('./logging/structuredLogger');

/**
 * Description of what this function does
 * 
 * @param {string} param1 - Description
 * @param {Object} options - Options object
 * @param {boolean} [options.optional=true] - Optional param
 * @returns {Promise<Object>} Description of return value
 * @throws {Error} When something goes wrong
 */
async function myFunction(param1, options = {}) {
  try {
    // Implementation
    logger.debug('context', 'Operation started', { param1 });
    
    // ... logic ...
    
    return { success: true };
  } catch (error) {
    logger.error('context', 'Operation failed', { error: error.message });
    throw error;
  }
}

module.exports = {
  myFunction,
};
```

### Using the Logger

Always use the structured logger instead of console:

```javascript
const logger = require('./logging/structuredLogger');

// Instead of: console.log('Something happened')
logger.info('context', 'Something happened');

// Instead of: console.error('Error:', error)
logger.error('context', 'Operation failed', { error: error.message });

// Debug logs (only shown when LOG_LEVEL=debug)
logger.debug('context', 'Detailed info', { data });
```

### Error Handling

Always handle errors properly:

```javascript
async function riskyOperation() {
  try {
    return await somethingAsync();
  } catch (error) {
    logger.error('operation', 'Failed', { error: error.message });
    throw error; // Re-throw if caller needs to handle it
  }
}

// Or handle locally
async function safeOperation() {
  try {
    return await somethingAsync();
  } catch (error) {
    logger.warn('operation', 'Using fallback', { error: error.message });
    return getDefaultValue();
  }
}
```

### Database Operations

Use the database helpers:

```javascript
const { getDB } = require('./database/core');
const db = getDB();

// Use the collection
const result = await db.collection('tickets').findOne({ id });
```

### Environment Variables

Use the env validator:

```javascript
const { getEnv } = require('./validators/envValidator');

// Get with default
const timeout = getEnv('API_TIMEOUT_MS', 5000);

// Validate on startup
const { quickValidate } = require('./validators/envValidator');
const validation = quickValidate();
if (!validation.valid) {
  console.error('Missing env vars:', validation.missing);
  process.exit(1);
}
```

## 🔧 Migration Plan

### Phase 1 (Complete)
- [x] Create structuredLogger.js
- [x] Create envValidator.js
- [x] Replace console.log in core files

### Phase 2 (In Progress)
- [ ] Move all console.log files to use structuredLogger
- [ ] Create services/ directory
- [ ] Move premiumService.js to services/
- [ ] Create logging/ directory
- [ ] Move structuredLogger.js, errorLogger.js to logging/

### Phase 3 (Planned)
- [ ] Create validators/ directory
- [ ] Move inputSanitizer.js, permissionValidator.js to validators/
- [ ] Create security/ directory
- [ ] Move security-related utils
- [ ] Create i18n/ directory
- [ ] Move i18n.js, languageService.js to i18n/

### Phase 4 (Planned)
- [ ] Create crons/ directory
- [ ] Move cron job handlers from crons/ at root
- [ ] Normalize database helpers naming
- [ ] Add comprehensive JSDoc to all files

## 📚 Key Modules

### Database
- `core.js` - MongoDB connection, indexes
- `helpers.js` - Common DB operations
- Domain-specific: `tickets.js`, `settings.js`, etc.

### Logging
- `structuredLogger.js` - Centralized logging
- Supports: error, warn, info, debug levels
- JSON output in production
- Colored output in development

### Validation
- `envValidator.js` - Environment variable validation
- `inputSanitizer.js` - User input sanitization
- `permissionValidator.js` - Discord permission checks

### Services
- `premiumService.js` - Premium status management
- Future: `billingService.js`, `analyticsService.js`

### Bridge
- `dashboardBridge/` - Dashboard synchronization
- Real-time state sync
- Config mutations
- Ticket updates

## 🧪 Testing

Each utility should have corresponding tests in `tests/`:

```
tests/
├── structuredLogger.test.js
├── envValidator.test.js
└── ...
```

Run tests:
```bash
npm test
```

## 📖 Best Practices

1. **No console.log**: Use structuredLogger
2. **No magic numbers**: Use constants or env vars
3. **No string concatenation**: Use template literals
4. **No callback hell**: Use async/await
5. **No var**: Use const/let
6. **No ==**: Use ===
7. **No eval**: Never use eval()
8. **No sync fs**: Use async file operations
9. **Handle all errors**: Never swallow errors
10. **Document exports**: Add JSDoc to all public functions

## 🐛 Debugging

Enable debug logging:
```bash
LOG_LEVEL=debug npm start
```

View all logs with context:
```bash
LOG_LEVEL=debug node index.js 2>&1 | grep "[ERROR]"
```

## 🔒 Security

- Never log sensitive data (tokens, passwords)
- Always sanitize user input
- Validate all environment variables on startup
- Use parameterized queries (no SQL injection risk with MongoDB)
- Check permissions before operations

---

Last updated: April 2026
