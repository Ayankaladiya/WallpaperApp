// src/services/metadataService.js
const sharp = require("sharp");

/**
 * Extract metadata from image buffer
 */
async function extractMetadata(buffer, filename) {
  try {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    // Calculate orientation
    const orientation = calculateOrientation(metadata.width, metadata.height);

    // Calculate aspect ratio
    const aspectRatio = calculateAspectRatio(metadata.width, metadata.height);

    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: buffer.length,
      orientation,
      aspectRatio,
    };
  } catch (error) {
    console.error(
      `❌ Error extracting metadata from ${filename}:`,
      error.message,
    );
    throw error;
  }
}

/**
 * Calculate orientation based on dimensions
 */
function calculateOrientation(width, height) {
  if (width > height) return "landscape";
  if (height > width) return "portrait";
  return "square";
}

/**
 * Calculate aspect ratio
 */
function calculateAspectRatio(width, height) {
  const gcd = getGCD(width, height);
  const ratioWidth = width / gcd;
  const ratioHeight = height / gcd;

  // Common aspect ratios
  const commonRatios = {
    "16:9": [16, 9],
    "16:10": [16, 10],
    "4:3": [4, 3],
    "3:2": [3, 2],
    "21:9": [21, 9],
    "1:1": [1, 1],
  };

  // Check if it matches common ratios
  for (const [name, [w, h]] of Object.entries(commonRatios)) {
    if (ratioWidth === w && ratioHeight === h) {
      return name;
    }
  }

  // Return calculated ratio
  return `${ratioWidth}:${ratioHeight}`;
}

/**
 * Calculate Greatest Common Divisor
 */
function getGCD(a, b) {
  return b === 0 ? a : getGCD(b, a % b);
}

/**
 * Validate if file is a valid image
 */
async function isValidImage(buffer) {
  try {
    await sharp(buffer).metadata();
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Parse folder structure to get category and subcategory
 * Expected format: Category/Subcategory/filename.webp
 */
function parseFolderStructure(path) {
  const parts = path.split("/");

  // Should have exactly 3 parts: category, subcategory, filename
  if (parts.length !== 3) {
    return null;
  }

  const [category, subcategory, filename] = parts;

  // Validate all parts exist
  if (!category || !subcategory || !filename) {
    return null;
  }

  return {
    category: category.toLowerCase().trim(),
    subcategory: subcategory.toLowerCase().trim(),
    filename: filename.trim(),
  };
}

module.exports = {
  extractMetadata,
  calculateOrientation,
  calculateAspectRatio,
  getGCD,
  isValidImage,
  parseFolderStructure,
};
