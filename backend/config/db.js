const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // If we don't have MongoDB running locally, don't crash the server instantly
    // We can run in mock mode
    console.warn("MongoDB connection failed. Continuing in mock mode...");
  }
};

module.exports = connectDB;
