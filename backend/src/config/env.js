// src/config/env.js
require("dotenv").config();

const config = {
  // Server
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  // MongoDB
  mongodbUri: process.env.MONGODB_URI,

  // Google Drive
  driveFolderId: process.env.DRIVE_FOLDER_ID,
  googleServiceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  googlePrivateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),

  // Frontend
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",

  // Cache
  cacheDurationHours: parseInt(process.env.CACHE_DURATION_HOURS) || 1,

  // Sync
  syncIntervalMinutes: parseInt(process.env.SYNC_INTERVAL_MINUTES) || 60,
};

// Validate required environment variables
const requiredEnvVars = [
  "MONGODB_URI",
  "DRIVE_FOLDER_ID",
  "GOOGLE_SERVICE_ACCOUNT_EMAIL",
  "GOOGLE_PRIVATE_KEY",
];

const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName],
);

if (missingEnvVars.length > 0) {
  console.error(
    `ERROR: Missing required environment variables: ${missingEnvVars.join(", ")}`,
  );
  process.exit(1);
}

module.exports = config;
