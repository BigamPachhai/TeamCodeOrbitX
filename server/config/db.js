import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Prevent multiple connections in serverless
mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    // If already connected, return
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB already connected");
      return;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    throw error;
  }
};

export default connectDB;
