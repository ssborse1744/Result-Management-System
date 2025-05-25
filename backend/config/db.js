const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // MongoDB Compass (local) connection
    const conn = await mongoose.connect(process.env.MONGODB_LOCAL_URI, {
      serverSelectionTimeoutMS: 5000, // 5s timeout for initial connection
      socketTimeoutMS: 30000 // Close idle connections after 30s
    });

    console.log(`[SUCCESS] MongoDB Connected: ${conn.connection.host}`);

    // Event listeners
    mongoose.connection.on('connected', () => {
      console.log('[STATUS] Mongoose connected');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`[ERROR] Mongoose error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('[STATUS] Mongoose disconnected');
    });

    // Cleanup on app termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('[INFO] Connection closed (app termination)');
      process.exit(0);
    });

  } catch (err) {
    console.error(`[FAILED] Connection error: ${err.message}`);
    process.exit(1); // Exit with error
  }
};

module.exports = connectDB;