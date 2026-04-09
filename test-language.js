#!/usr/bin/env node
"use strict";

/**
 * Language Detection Diagnostic Script
 * Run this to verify language detection is working correctly
 */

const { resolveGuildLanguage } = require("./src/utils/i18n");
const { settings } = require("./src/utils/database");

async function testLanguageDetection() {
  console.log("=== TON618 Language Detection Test ===\n");

  // Test cases
  const testCases = [
    { guildId: "test-1", bot_language: "es", preferredLocale: "en-US", expected: "es", desc: "DB says ES, Discord says EN" },
    { guildId: "test-2", bot_language: "en", preferredLocale: "es-ES", expected: "en", desc: "DB says EN, Discord says ES" },
    { guildId: "test-3", bot_language: null, preferredLocale: "es-ES", expected: "es", desc: "DB null, Discord ES" },
    { guildId: "test-4", bot_language: null, preferredLocale: "en-US", expected: "en", desc: "DB null, Discord EN" },
    { guildId: "test-5", bot_language: undefined, preferredLocale: "es-419", expected: "es", desc: "DB undefined, Discord ES-419" },
  ];

  console.log("Testing resolveGuildLanguage from i18n.js:\n");

  for (const test of testCases) {
    const mockSettings = { bot_language: test.bot_language };
    const result = resolveGuildLanguage(mockSettings, "en");
    const status = result === test.expected ? "✅" : "❌";

    console.log(`${status} ${test.desc}`);
    console.log(`   Input: bot_language="${test.bot_language}", preferredLocale="${test.preferredLocale}"`);
    console.log(`   Expected: "${test.expected}", Got: "${result}"\n`);
  }

  // Test database connection
  console.log("\nTesting database connection...");
  try {
    // Get a real guild ID from settings if available
    const allSettings = await settings.getAll ? await settings.getAll() : [];
    console.log(`Found ${allSettings.length} guild settings in database`);

    if (allSettings.length > 0) {
      const sample = allSettings[0];
      console.log(`\nSample guild: ${sample.guild_id || sample._id}`);
      console.log(`  bot_language: "${sample.bot_language || "NOT SET"}"`);
      console.log(`  language_onboarding_completed: ${sample.language_onboarding_completed || false}`);

      // Test with real settings
      const realResult = resolveGuildLanguage(sample, "en");
      console.log(`  Detected language: "${realResult}"`);
    }
  } catch (error) {
    console.error("❌ Database error:", error.message);
  }

  console.log("\n=== Test Complete ===");
  process.exit(0);
}

testLanguageDetection().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
