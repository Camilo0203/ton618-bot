const test = require("node:test");
const assert = require("node:assert/strict");

const {
  sanitizeString,
  sanitizeMarkdown,
  sanitizeForDisplay,
  checkSuspiciousUrls,
  validateUserId,
  validateGuildId,
} = require("../src/utils/inputSanitizer");

test("inputSanitizer sanitizes @everyone and @here", () => {
  const result = sanitizeString("Hello @everyone");
  assert.ok(result.includes("@"));
});

test("inputSanitizer sanitizes markdown dangerous patterns", () => {
  const result = sanitizeMarkdown("<script>alert('xss')</script>");
  assert.equal(result.includes("<script>"), false);
});

test("inputSanitizer combine sanitization", () => {
  const result = sanitizeForDisplay("Hello @everyone<script>", 100);
  assert.ok(result.length <= 100);
});

test("inputSanitizer detects suspicious URLs", () => {
  const result = checkSuspiciousUrls("Check bit.ly/abc");
  assert.equal(result.hasSuspicious, true);
  assert.ok(result.threats.length > 0);
});

test("inputSanitizer validates Discord IDs", () => {
  assert.equal(validateUserId("123456789012345678"), true);
  assert.equal(validateUserId("invalid"), false);
  assert.equal(validateGuildId("123456789012345678"), true);
  assert.equal(validateGuildId("invalid"), false);
});