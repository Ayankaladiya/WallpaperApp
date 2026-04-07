// server.js
const cron = require("node-cron");
const app = require("./src/app");
const connectDatabase = require("./src/config/database");
const { initializeDriveClient } = require("./src/config/drive");
const { incrementalSync } = require("./src/services/syncService");
const { cleanOldCache } = require("./src/services/cacheService");
const config = require("./src/config/env");

const startServer = async () => {
  try {
    console.log("🚀 Starting Wallpaper Backend Server...\n");

    // Connect to MongoDB
    await connectDatabase();

    // Initialize Google Drive client
    initializeDriveClient();

    // Start Express server
    const server = app.listen(config.port, () => {
      console.log(`\n✅ Server running on port ${config.port}`);
      console.log(`🌍 Environment: ${config.nodeEnv}`);
      console.log(`🔗 Frontend URL: ${config.frontendUrl}`);
      console.log(`📡 API: http://localhost:${config.port}\n`);
    });

    // Setup cron job for incremental sync (hourly)
    const syncCronExpression = `0 */${config.syncIntervalMinutes} * * *`;
    console.log(
      `⏰ Setting up sync cron job: Every ${config.syncIntervalMinutes} minutes`,
    );

    cron.schedule(syncCronExpression, async () => {
      console.log("\n⏰ Sync cron job triggered: Starting incremental sync");
      try {
        await incrementalSync();
      } catch (error) {
        console.error("❌ Sync cron job error:", error);
      }
    });

    // Setup cron job for cache cleanup (every hour)
    const cacheCronExpression = "0 * * * *"; // Every hour at minute 0
    console.log(`🧹 Setting up cache cleanup cron job: Every hour`);

    cron.schedule(cacheCronExpression, async () => {
      console.log("\n⏰ Cache cleanup cron job triggered");
      try {
        await cleanOldCache();
      } catch (error) {
        console.error("❌ Cache cleanup error:", error);
      }
    });

    console.log("✅ All cron jobs scheduled successfully\n");

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("⚠️  SIGTERM signal received: closing HTTP server");
      server.close(() => {
        console.log("🔌 HTTP server closed");
      });
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
