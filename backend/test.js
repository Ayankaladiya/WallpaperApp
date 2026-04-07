// test-mongodb.js
require("dotenv").config();
const mongoose = require("mongoose");

const testConnection = async () => {
  try {
    console.log("Testing MongoDB connection...");
    console.log(
      "URI:",
      process.env.MONGODB_URI.replace(/:([^:@]+)@/, ":****@"),
    );

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ SUCCESS! MongoDB connected");
    console.log("Database name:", mongoose.connection.name);

    await mongoose.connection.close();
    console.log("Connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ FAILED! Error:", error.message);
    process.exit(1);
  }
};

testConnection();
