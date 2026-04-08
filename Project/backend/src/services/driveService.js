// src/services/driveService.js
const { getDriveClient } = require("../config/drive");
const config = require("../config/env");

/**
 * List all files in a folder
 */
async function listFilesInFolder(folderId, pageToken = null) {
  try {
    const drive = getDriveClient();
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields:
        "nextPageToken, files(id, name, mimeType, size, createdTime, modifiedTime)",
      pageSize: 1000,
      pageToken: pageToken,
    });

    return response.data;
  } catch (error) {
    console.error(
      `❌ Error listing files in folder ${folderId}:`,
      error.message,
    );
    throw error;
  }
}

/**
 * Get all files recursively from root folder with full path
 */
async function getAllFilesWithPath(
  folderId = config.driveFolderId,
  currentPath = "",
) {
  const allFiles = [];

  try {
    let pageToken = null;

    do {
      const data = await listFilesInFolder(folderId, pageToken);
      const files = data.files || [];
      pageToken = data.nextPageToken;

      for (const file of files) {
        const filePath = currentPath
          ? `${currentPath}/${file.name}`
          : file.name;

        if (file.mimeType === "application/vnd.google-apps.folder") {
          // Recursively get files from subfolder
          const subFiles = await getAllFilesWithPath(file.id, filePath);
          allFiles.push(...subFiles);
        } else {
          // Add file with its full path
          allFiles.push({
            ...file,
            path: filePath,
          });
        }
      }
    } while (pageToken);

    return allFiles;
  } catch (error) {
    console.error("Error getting all files:", error.message);
    throw error;
  }
}

/**
 * Download file content as buffer
 */
async function downloadFile(fileId) {
  try {
    const drive = getDriveClient();
    const response = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "arraybuffer" },
    );

    return Buffer.from(response.data);
  } catch (error) {
    console.error(`Error downloading file ${fileId}:`, error.message);
    throw error;
  }
}

/**
 * Get file metadata
 */
async function getFileMetadata(fileId) {
  try {
    const drive = getDriveClient();
    const response = await drive.files.get({
      fileId,
      fields: "id, name, mimeType, size, createdTime, modifiedTime",
    });

    return response.data;
  } catch (error) {
    console.error(`Error getting file metadata ${fileId}:`, error.message);
    throw error;
  }
}

/**
 * Check if file exists
 */
async function fileExists(fileId) {
  try {
    const drive = getDriveClient();
    await drive.files.get({
      fileId,
      fields: "id",
    });
    return true;
  } catch (error) {
    if (error.code === 404) {
      return false;
    }
    throw error;
  }
}

module.exports = {
  listFilesInFolder,
  getAllFilesWithPath,
  downloadFile,
  getFileMetadata,
  fileExists,
};
