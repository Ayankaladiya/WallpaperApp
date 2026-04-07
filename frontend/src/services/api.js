// src/services/api.js
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error("❌ Response Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

// API functions

/**
 * Get all categories
 */
export const getCategories = async () => {
  const response = await apiClient.get("/categories");
  return response.data;
};

/**
 * Get images by category
 */
export const getImagesByCategory = async (category, page = 1, limit = 20) => {
  const response = await apiClient.get("/images", {
    params: { category, page, limit },
  });
  return response.data;
};

/**
 * Search images
 */
export const searchImages = async (query, page = 1, limit = 20) => {
  const response = await apiClient.get("/images/search", {
    params: { q: query, page, limit },
  });
  return response.data;
};

/**
 * Get images with filters
 */
export const getImagesWithFilters = async (
  filters = {},
  page = 1,
  limit = 20,
) => {
  const response = await apiClient.get("/images/filter", {
    params: { ...filters, page, limit },
  });
  return response.data;
};

/**
 * Get single image details
 */
export const getImageDetails = async (id) => {
  const response = await apiClient.get(`/images/${id}`);
  return response.data;
};

/**
 * Get statistics
 */
export const getStatistics = async () => {
  const response = await apiClient.get("/images/stats");
  return response.data;
};

/**
 * Get image download URL
 */
export const getImageDownloadUrl = (id) => {
  return `${API_BASE_URL}/images/${id}/download`;
};

export default apiClient;
