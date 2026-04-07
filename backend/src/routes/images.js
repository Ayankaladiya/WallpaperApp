// src/routes/images.js
const express = require("express");
const router = express.Router();
const imageController = require("../controllers/imageController");

// GET /api/images?category=cars&page=1&limit=20
router.get("/", imageController.getImagesByCategory);

// GET /api/images/search?q=bmw&page=1&limit=20
router.get("/search", imageController.searchImages);

// GET /api/images/filter?orientation=landscape&resolution=4k&page=1
router.get("/filter", imageController.getImagesWithFilters);

// GET /api/images/stats
router.get("/stats", imageController.getStatistics);

// GET /api/images/:id
router.get("/:id", imageController.getImageDetails);

// GET /api/images/:id/download
router.get("/:id/download", imageController.downloadImage);

module.exports = router;
