"use strict";

/**
 * Tests for structuredLogger utility
 * Ensures proper log levels, formatting, and environment-based filtering
 */

const { describe, it, before, after } = require("node:test");
const assert = require("node:assert");

// Store original env vars
const originalEnv = { ...process.env };

describe("structuredLogger", () => {
  let logger;
  let loggedMessages = [];

  // Mock console methods
  const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
  };

  // Helper to strip ANSI color codes
  function stripAnsi(str) {
    if (typeof str !== 'string') return str;
    // eslint-disable-next-line no-control-regex
    return str.replace(/\u001b\[\d+m/g, '');
  }

  before(() => {
    // Capture logged messages
    console.log = (...args) => loggedMessages.push({ level: "log", args: args.map(stripAnsi) });
    console.error = (...args) => loggedMessages.push({ level: "error", args: args.map(stripAnsi) });
    console.warn = (...args) => loggedMessages.push({ level: "warn", args: args.map(stripAnsi) });

    // Clear require cache to test with fresh state
    delete require.cache[require.resolve("../src/utils/structuredLogger")];
  });

  after(() => {
    // Restore original console methods
    console.log = originalConsole.log;
    console.error = originalConsole.error;
    console.warn = originalConsole.warn;

    // Restore original env vars
    Object.keys(process.env).forEach((key) => delete process.env[key]);
    Object.assign(process.env, originalEnv);

    // Clear require cache
    delete require.cache[require.resolve("../src/utils/structuredLogger")];
  });

  before(() => {
    // Set development mode
    process.env.NODE_ENV = "development";
    process.env.LOG_LEVEL = "debug";
    logger = require("../src/utils/structuredLogger");
  });

  it("should export logger with required methods", () => {
    assert.strictEqual(typeof logger.error, "function");
    assert.strictEqual(typeof logger.warn, "function");
    assert.strictEqual(typeof logger.info, "function");
    assert.strictEqual(typeof logger.debug, "function");
    assert.strictEqual(typeof logger.structured, "function");
    assert.strictEqual(typeof logger.startup, "function");
  });

  it("should log error messages", () => {
    loggedMessages = [];
    logger.error("test.context", "Test error message", { code: 500 });

    assert.ok(loggedMessages.length >= 1, "Should have logged at least 1 message");
    const errorMsg = loggedMessages[0].args.join(" ");
    assert.ok(errorMsg.includes("[ERROR]"), "Should include ERROR level");
    assert.ok(errorMsg.includes("test.context"), "Should include context");
    assert.ok(errorMsg.includes("Test error message"), "Should include message");
  });

  it("should log info messages", () => {
    loggedMessages = [];
    logger.info("test.context", "Test info message");

    assert.ok(loggedMessages.length >= 1, "Should have logged at least 1 message");
    const infoMsg = loggedMessages[0].args.join(" ");
    assert.ok(infoMsg.includes("[INFO]"), "Should include INFO level");
    assert.ok(infoMsg.includes("test.context"), "Should include context");
  });

  it("should log debug messages in development", () => {
    loggedMessages = [];
    logger.debug("test.context", "Test debug message", { extra: "data" });

    assert.ok(loggedMessages.length >= 1, "Should have logged at least 1 message");
    const debugMsg = loggedMessages[0].args.join(" ");
    assert.ok(debugMsg.includes("[DEBUG]"), "Should include DEBUG level");
  });

  it("should not log debug messages when LOG_LEVEL=warn", () => {
    // Clear cache and reload with different log level
    delete require.cache[require.resolve("../src/utils/structuredLogger")];
    const originalLogLevel = process.env.LOG_LEVEL;
    process.env.LOG_LEVEL = "warn";

    const limitedLogger = require("../src/utils/structuredLogger");
    loggedMessages = [];

    limitedLogger.debug("test.context", "Should not appear");
    limitedLogger.info("test.context", "Should not appear");
    limitedLogger.warn("test.context", "Should appear");

    assert.strictEqual(loggedMessages.length, 1, "Should only log warn level");
    const warnMsg = loggedMessages[0].args.join(" ");
    assert.ok(warnMsg.includes("[WARN]") || warnMsg.includes("[WARNING]"), "Should include WARN level");
    
    // Restore LOG_LEVEL for subsequent tests
    process.env.LOG_LEVEL = originalLogLevel;
  });

  it("should handle startup logging", () => {
    loggedMessages = [];
    logger.startup("test-stage", "Test startup message", "blue");

    assert.ok(loggedMessages.length >= 1, "Should have logged startup message");
    const startupMsg = loggedMessages[0].args.join(" ");
    assert.ok(startupMsg.includes("[startup:test-stage]"), "Should include stage");
    assert.ok(startupMsg.includes("Test startup message"), "Should include message");
  });

  it("should support legacy structured log format", () => {
    // Reload logger with debug level since previous test changed it to warn
    delete require.cache[require.resolve("../src/utils/structuredLogger")];
    process.env.LOG_LEVEL = "debug";
    const freshLogger = require("../src/utils/structuredLogger");
    
    loggedMessages = [];
    freshLogger.structured("info", "legacy.context", { message: "Legacy format" });

    // Verify that logging occurred (exact content depends on chalk ANSI codes)
    assert.ok(loggedMessages.length >= 1, "Should have logged structured message");
    
    // Restore original logger for subsequent tests
    logger = freshLogger;
  });

  it("should output JSON in production with ENABLE_JSON_LOGS", () => {
    delete require.cache[require.resolve("../src/utils/structuredLogger")];
    process.env.NODE_ENV = "production";
    process.env.ENABLE_JSON_LOGS = "true";
    process.env.LOG_LEVEL = "info";

    const prodLogger = require("../src/utils/structuredLogger");
    loggedMessages = [];

    prodLogger.info("prod.context", "Production message");

    assert.ok(loggedMessages.length >= 1, "Should have logged message");
    const logOutput = loggedMessages[0].args[0];
    assert.ok(typeof logOutput === "string", "Output should be string");
    assert.doesNotThrow(() => {
      const parsed = JSON.parse(logOutput);
      assert.strictEqual(parsed.level, "info");
      assert.strictEqual(parsed.context, "prod.context");
      assert.strictEqual(parsed.message, "Production message");
    }, "Should be valid JSON");
  });
});
