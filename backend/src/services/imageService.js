// src/services/imageService.js
const Image = require("../models/Image");
const driveService = require("./driveService");
const cacheService = require("./cacheService");

/**
 * Get image by ID
 */
async function getImageById(imageId) {
  try {
    const image = await Image.findById(imageId);

    if (!image) {
      return null;
    }

    if (image.isCorrupted) {
      throw new Error("Image is corrupted");
    }

    return image;
  } catch (error) {
    console.error(`❌ Error getting image ${imageId}:`, error.message);
    throw error;
  }
}

/**
 * Get image file (from cache or Drive)
 */
async function getImageFile(imageId) {
  try {
    const image = await getImageById(imageId);

    if (!image) {
      throw new Error("Image not found");
    }

    // Check cache first
    const cached = await cacheService.isCached(image.driveFileId);

    if (cached) {
      console.log(`📦 Serving from cache: ${image.filename}`);
      const buffer = await cacheService.getFromCache(image.driveFileId);
      return { buffer, image };
    }

    // Not in cache, download from Drive
    console.log(`☁️  Downloading from Drive: ${image.filename}`);
    const buffer = await driveService.downloadFile(image.driveFileId);

    // Save to cache
    await cacheService.saveToCache(image.driveFileId, buffer);

    return { buffer, image };
  } catch (error) {
    console.error(`❌ Error getting image file:`, error.message);
    throw error;
  }
}

/**
 * Get images by category with pagination
 */
async function getImagesByCategory(category, page = 1, limit = 20) {
  try {
    const skip = (page - 1) * limit;

    // Get total count
    const total = await Image.countDocuments({
      category: category.toLowerCase(),
      isCorrupted: false,
    });

    // Get random images from category
    const images = await Image.aggregate([
      {
        $match: {
          category: category.toLowerCase(),
          isCorrupted: false,
        },
      },
      { $sample: { size: Math.min(limit, total) } }, // Random sampling
      { $skip: skip },
      { $limit: limit },
    ]);

    return {
      images,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error(`❌ Error getting images by category:`, error.message);
    throw error;
  }
}

/**
 * Search images by keyword
 */
async function searchImages(query, page = 1, limit = 20) {
  try {
    const skip = (page - 1) * limit;
    const searchRegex = new RegExp(query, "i"); // Case-insensitive

    // Search in filename, category, and subcategory
    const filter = {
      isCorrupted: false,
      $or: [
        { filename: searchRegex },
        { category: searchRegex },
        { subcategory: searchRegex },
      ],
    };

    const total = await Image.countDocuments(filter);
    const images = await Image.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ uploadedAt: -1 });

    return {
      images,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      query,
    };
  } catch (error) {
    console.error(`❌ Error searching images:`, error.message);
    throw error;
  }
}

/**
 * Get all categories with image counts
 */
async function getAllCategories() {
  try {
    const categories = await Image.aggregate([
      { $match: { isCorrupted: false } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          subcategories: { $addToSet: "$subcategory" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return categories.map((cat) => ({
      name: cat._id,
      count: cat.count,
      subcategories: cat.subcategories.sort(),
    }));
  } catch (error) {
    console.error(`❌ Error getting categories:`, error.message);
    throw error;
  }
}

/**
 * Get images by subcategory
 */
async function getImagesBySubcategory(
  category,
  subcategory,
  page = 1,
  limit = 20,
) {
  try {
    const skip = (page - 1) * limit;

    const total = await Image.countDocuments({
      category: category.toLowerCase(),
      subcategory: subcategory.toLowerCase(),
      isCorrupted: false,
    });

    const images = await Image.aggregate([
      {
        $match: {
          category: category.toLowerCase(),
          subcategory: subcategory.toLowerCase(),
          isCorrupted: false,
        },
      },
      { $sample: { size: Math.min(limit, total) } },
      { $skip: skip },
      { $limit: limit },
    ]);

    return {
      images,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error(`❌ Error getting images by subcategory:`, error.message);
    throw error;
  }
}

/**
 * Get images with advanced filters
 */
async function getImagesWithFilters(filters = {}, page = 1, limit = 20) {
  try {
    const skip = (page - 1) * limit;

    // Build query
    const query = { isCorrupted: false };

    // Category filter
    if (filters.category) {
      query.category = filters.category.toLowerCase();
    }

    // Subcategory filter
    if (filters.subcategory) {
      query.subcategory = filters.subcategory.toLowerCase();
    }

    // Orientation filter
    if (filters.orientation) {
      query.orientation = filters.orientation.toLowerCase();
    }

    // Aspect ratio filter
    if (filters.aspectRatio) {
      query.aspectRatio = filters.aspectRatio;
    }

    // Resolution filter
    if (filters.minWidth) {
      query.width = { $gte: parseInt(filters.minWidth) };
    }
    if (filters.minHeight) {
      query.height = { $gte: parseInt(filters.minHeight) };
    }

    // Resolution presets
    if (filters.resolution) {
      const resolutionPresets = {
        "4k": { width: 3840, height: 2160 },
        fullhd: { width: 1920, height: 1080 },
        hd: { width: 1280, height: 720 },
      };

      const preset = resolutionPresets[filters.resolution.toLowerCase()];
      if (preset) {
        query.width = { $gte: preset.width };
        query.height = { $gte: preset.height };
      }
    }

    const total = await Image.countDocuments(query);

    const images = await Image.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ uploadedAt: -1 });

    return {
      images,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      filters,
    };
  } catch (error) {
    console.error(`❌ Error getting images with filters:`, error.message);
    throw error;
  }
}

/**
 * Get statistics
 */
async function getStatistics() {
  try {
    const totalImages = await Image.countDocuments({ isCorrupted: false });
    const corruptedImages = await Image.countDocuments({ isCorrupted: true });

    const categories = await Image.distinct("category", { isCorrupted: false });
    const totalCategories = categories.length;

    // Get total size
    const sizeResult = await Image.aggregate([
      { $match: { isCorrupted: false } },
      { $group: { _id: null, totalSize: { $sum: "$size" } } },
    ]);
    const totalSize = sizeResult[0]?.totalSize || 0;

    // Get orientation breakdown
    const orientations = await Image.aggregate([
      { $match: { isCorrupted: false } },
      { $group: { _id: "$orientation", count: { $sum: 1 } } },
    ]);

    // Get aspect ratio breakdown
    const aspectRatios = await Image.aggregate([
      { $match: { isCorrupted: false } },
      { $group: { _id: "$aspectRatio", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Get resolution breakdown
    const resolutions = await Image.aggregate([
      { $match: { isCorrupted: false } },
      {
        $group: {
          _id: {
            $cond: [
              {
                $and: [{ $gte: ["$width", 3840] }, { $gte: ["$height", 2160] }],
              },
              "4K",
              {
                $cond: [
                  {
                    $and: [
                      { $gte: ["$width", 1920] },
                      { $gte: ["$height", 1080] },
                    ],
                  },
                  "Full HD",
                  {
                    $cond: [
                      {
                        $and: [
                          { $gte: ["$width", 1280] },
                          { $gte: ["$height", 720] },
                        ],
                      },
                      "HD",
                      "SD",
                    ],
                  },
                ],
              },
            ],
          },
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      totalImages,
      corruptedImages,
      totalCategories,
      categories: categories.sort(),
      totalSize,
      totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
      totalSizeGB: (totalSize / (1024 * 1024 * 1024)).toFixed(2),
      orientations: orientations.map((o) => ({
        orientation: o._id,
        count: o.count,
      })),
      aspectRatios: aspectRatios.map((a) => ({
        aspectRatio: a._id,
        count: a.count,
      })),
      resolutions: resolutions.map((r) => ({
        resolution: r._id,
        count: r.count,
      })),
    };
  } catch (error) {
    console.error(`❌ Error getting statistics:`, error.message);
    throw error;
  }
}

// Export new functions
module.exports = {
  getImageById,
  getImageFile,
  getImagesByCategory,
  searchImages,
  getAllCategories,
  getImagesBySubcategory,
  getImagesWithFilters, // NEW
  getStatistics, // NEW
};
