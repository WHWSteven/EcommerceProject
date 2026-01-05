const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn("⚠️  MONGO_URI not set. Skipping MongoDB connection.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};

const isDBConnected = () => isConnected;

module.exports = { connectDB, isDBConnected };
