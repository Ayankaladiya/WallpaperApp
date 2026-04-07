// src/controllers/categoryController.js
const imageService = require("../services/imageService");

/**
 * Get all categories
 */
async function getAllCategories(req, res) {
  try {
    const categories = await imageService.getAllCategories();

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("❌ Error in getAllCategories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get categories",
      error: error.message,
    });
  }
}

/**
 * Get images by subcategory
 */
async function getImagesBySubcategory(req, res) {
  try {
    const { category, subcategory } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    if (!category || !subcategory) {
      return res.status(400).json({
        success: false,
        message: "Category and subcategory are required",
      });
    }

    const result = await imageService.getImagesBySubcategory(
      category,
      subcategory,
      page,
      limit,
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("❌ Error in getImagesBySubcategory:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get images",
      error: error.message,
    });
  }
}

module.exports = {
  getAllCategories,
  getImagesBySubcategory,
};
