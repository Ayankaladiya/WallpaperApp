// src/config/drive.js
const { google } = require("googleapis");
const config = require("./env");

let driveClient = null;

const initializeDriveClient = () => {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: config.googleServiceAccountEmail,
        private_key: config.googlePrivateKey,
      },
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });

    driveClient = google.drive({ version: "v3", auth });
    console.log("✅ Google Drive client initialized successfully");

    return driveClient;
  } catch (error) {
    console.error("❌ Failed to initialize Google Drive client:", error);
    throw error;
  }
};

const getDriveClient = () => {
  if (!driveClient) {
    return initializeDriveClient();
  }
  return driveClient;
};

module.exports = {
  initializeDriveClient,
  getDriveClient,
};
