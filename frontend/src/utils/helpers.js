// src/utils/helpers.js
import config from "../config/config";

/**
 * Format file size in bytes to human readable format
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

/**
 * Format resolution (width x height)
 */
export const formatResolution = (width, height) => {
  return `${width} × ${height}`;
};

/**
 * Capitalize first letter of string
 */
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Get image download URL
 */
export const getImageDownloadUrl = (imageId) => {
  return `${config.apiUrl}/images/${imageId}/download`;
};

/**
 * Download image programmatically
 */
export const downloadImage = (imageId, filename) => {
  const url = getImageDownloadUrl(imageId);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "wallpaper.webp";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Check if user is near bottom of page (for infinite scroll)
 */
export const isNearBottom = (threshold = 500) => {
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = document.documentElement.scrollTop;
  const clientHeight = document.documentElement.clientHeight;

  return scrollHeight - scrollTop - clientHeight < threshold;
};
