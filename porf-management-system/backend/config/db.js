const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // For local development without MongoDB, we'll create a mock connection
    if (process.env.NODE_ENV === 'development' && !process.env.MONGO_URI.includes('mongodb+srv')) {
      console.log('Running in development mode without MongoDB connection');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Don't exit the process in development mode
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
