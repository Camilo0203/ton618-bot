#!/usr/bin/env node
"use strict";

/**
 * Security Setup Script
 * Run this once to initialize the security system
 * Usage: node scripts/setup-security.js
 */

require("dotenv").config();

const { setupAuditIndexes, verifyAuditIndexes } = require("../src/utils/database/setupAuditIndexes");
const { startSecurityScheduler } = require("../src/utils/securityScheduler");
const { connectDB } = require("../src/utils/database/core");

async function setupSecurity() {
  console.log("\n");
  console.log("╔════════════════════════════════════════════════════════╗");
  console.log("║         TON618 SECURITY SYSTEM SETUP                  ║");
  console.log("╚════════════════════════════════════════════════════════╝");
  console.log("\n");

  try {
    // 1. Connect to database
    console.log("[1/3] Connecting to MongoDB...");
    await connectDB();
    console.log("✅ MongoDB connected\n");

    // 2. Setup indexes
    console.log("[2/3] Setting up audit trail indexes...");
    const indexResult = await setupAuditIndexes();
    if (!indexResult) {
      console.error("❌ Failed to create indexes");
      process.exit(1);
    }
    console.log("✅ Indexes created\n");

    // Verify indexes
    console.log("[2.5/3] Verifying indexes...");
    const verifyResult = await verifyAuditIndexes();
    if (!verifyResult) {
      console.warn("⚠️ Some indexes may be missing");
    } else {
      console.log("✅ All indexes verified\n");
    }

    // 3. Start scheduler
    console.log("[3/3] Starting security scheduler...");
    const schedulerResult = startSecurityScheduler();
    if (!schedulerResult) {
      console.error("❌ Failed to start scheduler");
      process.exit(1);
    }
    console.log("✅ Security scheduler started\n");

    console.log("╔════════════════════════════════════════════════════════╗");
    console.log("║         SECURITY SETUP COMPLETE ✅                     ║");
    console.log("╚════════════════════════════════════════════════════════╝");
    console.log("\n📊 Security monitoring is now active:");
    console.log("   • Pro brute force detection: Every 5 minutes");
    console.log("   • Code generation abuse: Every 5 minutes");
    console.log("   • Admin action monitoring: Every 5 minutes");
    console.log("   • Error rate monitoring: Every 5 minutes");
    console.log("   • Alert cleanup: Every hour");
    console.log("\n🔧 Owner Commands:");
    console.log("   /security alerts - View security alerts");
    console.log("   /security status - Check system status");
    console.log("   /security check - Run manual check");
    console.log("   /security setup - Re-run setup");
    console.log("\n");

    // Keep process alive for a moment to let scheduler start
    setTimeout(() => {
      console.log("✅ Setup script complete. Security system is running.");
      process.exit(0);
    }, 2000);

  } catch (error) {
    console.error("\n❌ Setup failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run setup
setupSecurity();
