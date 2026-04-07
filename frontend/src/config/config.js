const config = {
  // Vite uses import.meta.env, not process.env
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  itemsPerPage: 20,
  debounceDelay: 500,
  cacheDuration: 5 * 60 * 1000,
};

// Debug log
if (import.meta.env.DEV) {
  console.log("🔧 Config loaded:", config);
}

export default config;
