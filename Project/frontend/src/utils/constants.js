// src/utils/constants.js
import config from "../config/config";

// Use hardcoded config instead of process.env
export const API_BASE_URL = config.apiUrl;

export const ITEMS_PER_PAGE = config.itemsPerPage;

export const DEBOUNCE_DELAY = config.debounceDelay;

export const MASONRY_BREAKPOINTS = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

export const IMAGE_ORIENTATIONS = {
  LANDSCAPE: "landscape",
  PORTRAIT: "portrait",
  SQUARE: "square",
};

export const RESOLUTIONS = {
  "4K": "4k",
  FULL_HD: "fullhd",
  HD: "hd",
};

export const QUERY_KEYS = {
  CATEGORIES: "categories",
  IMAGES: "images",
  SEARCH: "search",
  STATISTICS: "statistics",
};

export const ROUTES = {
  HOME: "/",
  CATEGORY: "/category/:categoryName",
  SEARCH: "/search",
};

// Debug
console.log("🔧 API Base URL:", API_BASE_URL);
