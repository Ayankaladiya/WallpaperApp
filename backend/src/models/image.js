// src/models/Image.js
const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    driveFileId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    filename: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    subcategory: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    size: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    format: {
      type: String,
      required: true,
      lowercase: true,
    },
    orientation: {
      type: String,
      enum: ["landscape", "portrait", "square"],
      required: true,
    },
    aspectRatio: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      required: true,
    },
    drivePath: {
      type: String,
      required: true,
    },
    lastSyncedAt: {
      type: Date,
      default: Date.now,
    },
    isCorrupted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for category + subcategory queries
imageSchema.index({ category: 1, subcategory: 1 });

module.exports = mongoose.model("Image", imageSchema);
