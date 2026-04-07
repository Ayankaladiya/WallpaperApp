// src/controllers/docsController.js

/**
 * Get API documentation
 */
function getApiDocs(req, res) {
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  const documentation = {
    title: "Wallpaper Backend API Documentation",
    version: "1.0.0",
    baseUrl: baseUrl,
    endpoints: {
      images: {
        "Get images by category": {
          method: "GET",
          path: "/api/images",
          query: {
            category: "string (required) - Category name (e.g., cars, nature)",
            page: "number (optional) - Page number (default: 1)",
            limit: "number (optional) - Items per page (default: 20)",
          },
          example: `${baseUrl}/api/images?category=cars&page=1&limit=10`,
        },
        "Search images": {
          method: "GET",
          path: "/api/images/search",
          query: {
            q: "string (required) - Search query",
            page: "number (optional) - Page number (default: 1)",
            limit: "number (optional) - Items per page (default: 20)",
          },
          example: `${baseUrl}/api/images/search?q=bmw&page=1&limit=10`,
        },
        "Filter images": {
          method: "GET",
          path: "/api/images/filter",
          query: {
            category: "string (optional) - Category name",
            subcategory: "string (optional) - Subcategory name",
            orientation: "string (optional) - landscape, portrait, or square",
            aspectRatio: "string (optional) - e.g., 16:9, 4:3, 21:9",
            resolution: "string (optional) - 4k, fullhd, or hd",
            minWidth: "number (optional) - Minimum width in pixels",
            minHeight: "number (optional) - Minimum height in pixels",
            page: "number (optional) - Page number (default: 1)",
            limit: "number (optional) - Items per page (default: 20)",
          },
          example: `${baseUrl}/api/images/filter?orientation=landscape&resolution=4k&page=1`,
        },
        "Get statistics": {
          method: "GET",
          path: "/api/images/stats",
          query: {},
          example: `${baseUrl}/api/images/stats`,
        },
        "Get image details": {
          method: "GET",
          path: "/api/images/:id",
          params: {
            id: "string (required) - Image MongoDB ID",
          },
          example: `${baseUrl}/api/images/65f1234567890abcdef`,
        },
        "Download image": {
          method: "GET",
          path: "/api/images/:id/download",
          params: {
            id: "string (required) - Image MongoDB ID",
          },
          example: `${baseUrl}/api/images/65f1234567890abcdef/download`,
        },
      },
      categories: {
        "Get all categories": {
          method: "GET",
          path: "/api/categories",
          query: {},
          example: `${baseUrl}/api/categories`,
        },
        "Get images by subcategory": {
          method: "GET",
          path: "/api/categories/images",
          query: {
            category: "string (required) - Category name",
            subcategory: "string (required) - Subcategory name",
            page: "number (optional) - Page number (default: 1)",
            limit: "number (optional) - Items per page (default: 20)",
          },
          example: `${baseUrl}/api/categories/images?category=cars&subcategory=bmw&page=1`,
        },
      },
    },
    responseFormat: {
      success: {
        success: true,
        data: "{ ... response data ... }",
      },
      error: {
        success: false,
        message: "Error message",
        error: "Detailed error (only in development)",
      },
    },
    filterExamples: {
      "4K landscape images": `${baseUrl}/api/images/filter?resolution=4k&orientation=landscape`,
      "16:9 aspect ratio": `${baseUrl}/api/images/filter?aspectRatio=16:9`,
      "BMW cars in Full HD": `${baseUrl}/api/images/filter?category=cars&subcategory=bmw&resolution=fullhd`,
      "Portrait images": `${baseUrl}/api/images/filter?orientation=portrait`,
      "Images wider than 3000px": `${baseUrl}/api/images/filter?minWidth=3000`,
    },
  };

  res.json(documentation);
}

module.exports = {
  getApiDocs,
};
