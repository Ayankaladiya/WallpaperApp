// src/services/syncService.js
const driveService = require("./driveService");
const metadataService = require("./metadataService");
const Image = require("../models/Image");

/**
 * Process a single file
 */
async function processFile(file, existingMap, stats) {
  // Parse folder structure
  const parsed = metadataService.parseFolderStructure(file.path);

  if (!parsed) {
    console.log(`⏭️  Skipped (invalid structure): ${file.path}`);
    stats.skipped++;
    return;
  }

  // Check if file is webp
  if (!file.name.toLowerCase().endsWith(".webp")) {
    console.log(`⏭️  Skipped (not webp): ${file.path}`);
    stats.skipped++;
    return;
  }

  try {
    // Download file
    const buffer = await driveService.downloadFile(file.id);

    // Validate image
    const isValid = await metadataService.isValidImage(buffer);
    if (!isValid) {
      console.log(`⚠️  Corrupted image: ${file.path}`);
      stats.corrupted++;

      // Mark as corrupted in database
      await Image.findOneAndUpdate(
        { driveFileId: file.id },
        { isCorrupted: true },
        { upsert: true },
      );
      return;
    }

    // Extract metadata
    const metadata = await metadataService.extractMetadata(buffer, file.name);

    // Prepare image data
    const imageData = {
      driveFileId: file.id,
      filename: parsed.filename,
      category: parsed.category,
      subcategory: parsed.subcategory,
      size: parseInt(file.size),
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      orientation: metadata.orientation,
      aspectRatio: metadata.aspectRatio,
      uploadedAt: new Date(file.createdTime),
      drivePath: file.path,
      lastSyncedAt: new Date(),
      isCorrupted: false,
    };

    // Check if image exists
    const existingImage = existingMap.get(file.id);

    if (existingImage) {
      // Check if path changed (moved to different category)
      if (existingImage.drivePath !== file.path) {
        console.log(`📁 Moved: ${existingImage.drivePath} → ${file.path}`);
        await Image.findOneAndUpdate({ driveFileId: file.id }, imageData);
        stats.updated++;
      } else {
        // Update existing image
        await Image.findOneAndUpdate({ driveFileId: file.id }, imageData);
        stats.updated++;
      }
    } else {
      // Create new image
      await Image.create(imageData);
      console.log(`➕ Added: ${file.path}`);
      stats.added++;
    }
  } catch (error) {
    console.error(`❌ Error processing ${file.path}:`, error.message);
    stats.skipped++;
  }
}

/**
 * Incremental sync - only check modified files
 */
async function incrementalSync() {
  console.log("🔄 Starting INCREMENTAL sync...");
  const startTime = Date.now();

  try {
    const stats = {
      total: 0,
      added: 0,
      updated: 0,
      skipped: 0,
      corrupted: 0,
    };

    // Get last sync time from the most recently synced image
    const lastSyncedImage = await Image.findOne()
      .sort({ lastSyncedAt: -1 })
      .select("lastSyncedAt");
    console.log(`Last sync Image: ${lastSyncedImage}`);

    const lastSyncTime = lastSyncedImage?.lastSyncedAt || new Date(0);

    // Get all files from Drive
    console.log("📁 Fetching files from Google Drive...");
    const driveFiles = await driveService.getAllFilesWithPath();

    // Filter only modified files
    const modifiedFiles = driveFiles.filter((file) => {
      const modifiedTime = new Date(file.modifiedTime);
      return modifiedTime > lastSyncTime;
    });

    console.log(
      `📊 Found ${modifiedFiles.length} modified files since last sync`,
    );

    if (modifiedFiles.length === 0) {
      console.log("✅ No changes detected, sync complete\n");
      return {
        success: true,
        message: "No changes detected",
        stats,
      };
    }

    // Get existing images
    const existingImages = await Image.find({}, "driveFileId drivePath");
    const existingMap = new Map(
      existingImages.map((img) => [img.driveFileId, img]),
    );

    // Process modified files
    for (const file of modifiedFiles) {
      stats.total++;

      try {
        await processFile(file, existingMap, stats);
      } catch (error) {
        console.error(`❌ Error processing file ${file.name}:`, error.message);
        stats.skipped++;
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log("\n✅ Incremental sync completed!");
    console.log(
      `📊 Stats: ${stats.added} added, ${stats.updated} updated, ${stats.skipped} skipped, ${stats.corrupted} corrupted`,
    );
    console.log(`⏱️  Duration: ${duration}s\n`);

    return {
      success: true,
      message: "Incremental sync completed successfully",
      stats,
      duration: `${duration}s`,
    };
  } catch (error) {
    console.error("❌ Incremental sync failed:", error);
    throw error;
  }
}

/**
 * Full sync - scan all files from Drive and delete removed ones
 */
async function fullSync() {
  console.log("🔄 Starting FULL sync...");
  const startTime = Date.now();

  try {
    const stats = {
      total: 0,
      added: 0,
      updated: 0,
      deleted: 0,
      skipped: 0,
      corrupted: 0,
    };

    // Get all files from Drive
    console.log("📁 Fetching files from Google Drive...");
    const driveFiles = await driveService.getAllFilesWithPath();
    console.log(`📊 Found ${driveFiles.length} files in Drive`);

    // Get all existing images from MongoDB
    const existingImages = await Image.find({}, "driveFileId drivePath");
    const existingMap = new Map(
      existingImages.map((img) => [img.driveFileId, img]),
    );

    const processedFileIds = new Set();

    // Process each file from Drive
    for (const file of driveFiles) {
      stats.total++;
      processedFileIds.add(file.id);

      try {
        await processFile(file, existingMap, stats);
      } catch (error) {
        console.error(`❌ Error processing file ${file.name}:`, error.message);
        stats.skipped++;
      }
    }

    // Delete images that no longer exist in Drive
    console.log("🗑️  Checking for deleted files...");
    for (const existingImage of existingImages) {
      if (!processedFileIds.has(existingImage.driveFileId)) {
        await Image.findByIdAndDelete(existingImage._id);
        console.log(`🗑️  Deleted: ${existingImage.drivePath}`);
        stats.deleted++;
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log("\n✅ Full sync completed!");
    console.log(
      `📊 Stats: ${stats.added} added, ${stats.updated} updated, ${stats.deleted} deleted, ${stats.skipped} skipped, ${stats.corrupted} corrupted`,
    );
    console.log(`⏱️  Duration: ${duration}s\n`);

    return {
      success: true,
      message: "Full sync completed successfully",
      stats,
      duration: `${duration}s`,
    };
  } catch (error) {
    console.error("❌ Full sync failed:", error);
    throw error;
  }
}

module.exports = {
  incrementalSync,
  fullSync,
};
