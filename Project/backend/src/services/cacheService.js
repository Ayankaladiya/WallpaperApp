// src/services/cacheService.js
const fs = require("fs").promises;
const path = require("path");
const config = require("../config/env");

const CACHE_DIR = path.join(__dirname, "../../cache");

/**
 * Get cache file path for a drive file ID
 */
function getCachePath(driveFileId) {
  return path.join(CACHE_DIR, `${driveFileId}.webp`);
}

/**
 * Check if file exists in cache
 */
async function isCached(driveFileId) {
  try {
    const cachePath = getCachePath(driveFileId);
    await fs.access(cachePath);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Save file to cache
 */
async function saveToCache(driveFileId, buffer) {
  try {
    const cachePath = getCachePath(driveFileId);
    await fs.writeFile(cachePath, buffer);
    console.log(`💾 Cached: ${driveFileId}.webp`);
    return cachePath;
  } catch (error) {
    console.error(`❌ Error saving to cache:`, error.message);
    throw error;
  }
}

/**
 * Get file from cache
 */
async function getFromCache(driveFileId) {
  try {
    const cachePath = getCachePath(driveFileId);
    const buffer = await fs.readFile(cachePath);
    return buffer;
  } catch (error) {
    console.error(`❌ Error reading from cache:`, error.message);
    throw error;
  }
}

/**
 * Delete file from cache
 */
async function deleteFromCache(driveFileId) {
  try {
    const cachePath = getCachePath(driveFileId);
    await fs.unlink(cachePath);
    console.log(`🗑️  Deleted from cache: ${driveFileId}.webp`);
  } catch (error) {
    // Ignore errors (file might not exist)
  }
}

/**
 * Clean old cache files (older than specified hours)
 */
async function cleanOldCache() {
  try {
    console.log("🧹 Cleaning old cache files...");

    const files = await fs.readdir(CACHE_DIR);
    const now = Date.now();
    const maxAge = config.cacheDurationHours * 60 * 60 * 1000; // Convert hours to milliseconds

    let deletedCount = 0;

    for (const file of files) {
      if (file === ".gitkeep") continue;

      const filePath = path.join(CACHE_DIR, file);
      const stats = await fs.stat(filePath);
      const fileAge = now - stats.mtimeMs;

      if (fileAge > maxAge) {
        await fs.unlink(filePath);
        deletedCount++;
      }
    }

    console.log(`✅ Cache cleanup complete: ${deletedCount} files deleted`);
    return deletedCount;
  } catch (error) {
    console.error("❌ Error cleaning cache:", error.message);
    throw error;
  }
}

/**
 * Get cache statistics
 */
async function getCacheStats() {
  try {
    const files = await fs.readdir(CACHE_DIR);
    const validFiles = files.filter((f) => f !== ".gitkeep");

    let totalSize = 0;
    for (const file of validFiles) {
      const filePath = path.join(CACHE_DIR, file);
      const stats = await fs.stat(filePath);
      totalSize += stats.size;
    }

    return {
      fileCount: validFiles.length,
      totalSize: totalSize,
      totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
    };
  } catch (error) {
    console.error("❌ Error getting cache stats:", error.message);
    return { fileCount: 0, totalSize: 0, totalSizeMB: "0.00" };
  }
}

module.exports = {
  getCachePath,
  isCached,
  saveToCache,
  getFromCache,
  deleteFromCache,
  cleanOldCache,
  getCacheStats,
};
