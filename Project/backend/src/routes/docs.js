// src/routes/docs.js
const express = require("express");
const router = express.Router();
const docsController = require("../controllers/docsController");

// GET /api/docs
router.get("/", docsController.getApiDocs);

module.exports = router;
