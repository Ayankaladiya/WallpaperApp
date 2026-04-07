// src/routes/categories.js
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// GET /api/categories
router.get("/", categoryController.getAllCategories);

// GET /api/categories/images?category=cars&subcategory=bmw&page=1&limit=20
router.get("/images", categoryController.getImagesBySubcategory);

module.exports = router;
