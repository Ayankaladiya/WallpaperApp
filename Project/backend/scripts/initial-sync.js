// scripts/initial-sync.js
require("dotenv").config();
const mongoose = require("mongoose");
const { initializeDriveClient } = require("../src/config/drive");
const { fullSync } = require("../src/services/syncService");
const config = require("../src/config/env");

async function runInitialSync() {
  try {
    console.log("🚀 Starting Initial Full Sync...\n");

    // Connect to MongoDB
    await mongoose.connect(config.mongodbUri);
    console.log("✅ MongoDB connected\n");

    // Initialize Google Drive
    initializeDriveClient();

    // Run full sync
    await fullSync();

    console.log("✅ Initial sync completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Initial sync failed:", error);
    process.exit(1);
  }
}

runInitialSync();
