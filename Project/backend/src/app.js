// src/app.js
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const config = require("./config/env");

// Import routes
const imageRoutes = require("./routes/images");
const categoryRoutes = require("./routes/categories");
const docsRoutes = require("./routes/docs"); // NEW

const app = express();

// Trust proxy (for rate limiting behind reverse proxy)
app.set("trust proxy", 1);

// CORS Configuration
const corsOptions = {
  origin: config.frontendUrl,
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Compression
app.use(compression());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.url} - ${req.ip}`);
  next();
});

// Routes
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Wallpaper Backend API",
    version: "1.0.0",
    documentation: `${req.protocol}://${req.get("host")}/api/docs`,
  });
});

// API Routes
app.use("/api/images", imageRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/docs", docsRoutes); // NEW

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(config.nodeEnv === "development" && { stack: err.stack }),
  });
});

module.exports = app;
