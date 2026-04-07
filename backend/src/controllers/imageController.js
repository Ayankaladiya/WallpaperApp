// src/controllers/imageController.js
const imageService = require("../services/imageService");

/**
 * Get images by category
 */
async function getImagesByCategory(req, res) {
  try {
    const { category } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    const result = await imageService.getImagesByCategory(
      category,
      page,
      limit,
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("❌ Error in getImagesByCategory:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get images",
      error: error.message,
    });
  }
}

/**
 * Search images
 */
async function searchImages(req, res) {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const result = await imageService.searchImages(q, page, limit);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("❌ Error in searchImages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search images",
      error: error.message,
    });
  }
}

/**
 * Get single image details
 */
async function getImageDetails(req, res) {
  try {
    const { id } = req.params;

    const image = await imageService.getImageById(id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    res.json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error("❌ Error in getImageDetails:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get image details",
      error: error.message,
    });
  }
}

/**
 * Download/stream image file
 */
async function downloadImage(req, res) {
  try {
    const { id } = req.params;

    const { buffer, image } = await imageService.getImageFile(id);

    // Set headers
    res.set({
      "Content-Type": "image/webp",
      "Content-Length": buffer.length,
      "Content-Disposition": `inline; filename="${image.filename}"`,
      "Cache-Control": "public, max-age=3600", // Cache for 1 hour
    });

    // Stream the image
    res.send(buffer);
  } catch (error) {
    console.error("❌ Error in downloadImage:", error);

    if (error.message === "Image not found") {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    if (error.message === "Image is corrupted") {
      return res.status(410).json({
        success: false,
        message: "Image is corrupted",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to download image",
      error: error.message,
    });
  }
}

/**
 * Get images with advanced filters
 */
async function getImagesWithFilters(req, res) {
  try {
    const filters = {
      category: req.query.category,
      subcategory: req.query.subcategory,
      orientation: req.query.orientation,
      aspectRatio: req.query.aspectRatio,
      resolution: req.query.resolution,
      minWidth: req.query.minWidth,
      minHeight: req.query.minHeight,
    };

    // Remove undefined values
    Object.keys(filters).forEach((key) => {
      if (filters[key] === undefined) {
        delete filters[key];
      }
    });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await imageService.getImagesWithFilters(
      filters,
      page,
      limit,
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("❌ Error in getImagesWithFilters:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get images",
      error: error.message,
    });
  }
}

/**
 * Get statistics
 */
async function getStatistics(req, res) {
  try {
    const stats = await imageService.getStatistics();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("❌ Error in getStatistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get statistics",
      error: error.message,
    });
  }
}

async function getImages(req, res) {
  try {
    const { category, page = 1, limit = 20 } = req.query;

    let query = {};
    if (category) {
      query.category = category.toLowerCase();
    }

    const skip = (page - 1) * limit;

    // If no category, get random images
    const images = category
      ? await Image.find(query).skip(skip).limit(parseInt(limit))
      : await Image.aggregate([{ $sample: { size: parseInt(limit) } }]);

    const total = await Image.countDocuments(query);

    res.json({
      success: true,
      data: {
        images,
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Update exports
module.exports = {
  getImagesByCategory,
  searchImages,
  getImageDetails,
  downloadImage,
  getImagesWithFilters, // NEW
  getStatistics, // NEW
  getImages, // NEW
};
