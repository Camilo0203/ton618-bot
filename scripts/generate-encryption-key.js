#!/usr/bin/env node
"use strict";

/**
 * Generate Encryption Key Script
 * Generates a secure key for ENCRYPTION_KEY environment variable
 * 
 * Usage: node scripts/generate-encryption-key.js
 */

const crypto = require("crypto");

console.log("\n");
console.log("╔════════════════════════════════════════════════════════╗");
console.log("║     🔐 ENCRYPTION KEY GENERATOR                        ║");
console.log("╚════════════════════════════════════════════════════════╝");
console.log("\n");

// Generate a secure 256-bit (32 byte) key
const key = crypto.randomBytes(32).toString("hex");

console.log("✅ Generated secure 256-bit encryption key:\n");
console.log("─".repeat(56));
console.log(key);
console.log("─".repeat(56));
console.log("\n");

console.log("📋 INSTRUCTIONS:");
console.log("1. Copy the key above");
console.log("2. Add it to your .env file:");
console.log("   ENCRYPTION_KEY=" + key);
console.log("\n");
console.log("⚠️  IMPORTANT:");
console.log("   • Keep this key SECRET - anyone with it can decrypt your data");
console.log("   • Store it in a password manager or secure vault");
console.log("   • If you lose this key, encrypted data CANNOT be recovered");
console.log("   • Never commit .env files to git");
console.log("\n");
console.log("🔒 This key enables AES-256-GCM encryption for:");
console.log("   • API tokens stored in database");
console.log("   • Sensitive configuration values");
console.log("   • Webhook secrets");
console.log("\n");
