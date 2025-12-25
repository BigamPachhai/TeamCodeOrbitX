import mongoose from "mongoose";

// Cached connection for serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // Return existing connection
  if (cached.conn) {
    return cached.conn;
  }

  // Check if MONGO_URI exists
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not defined in environment variables");
    throw new Error("MONGO_URI is required");
  }

  // Return existing connection promise
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose
      .connect(process.env.MONGO_URI, opts)
      .then((mongoose) => {
        console.log("MongoDB Connected Successfully");
        return mongoose;
      })
      .catch((error) => {
        console.error("MongoDB Connection Failed:", error.message);
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("Failed to establish MongoDB connection:", e.message);
    throw e;
  }

  return cached.conn;
};

export default connectDB;
