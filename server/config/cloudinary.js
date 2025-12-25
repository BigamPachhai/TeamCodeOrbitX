import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with error handling for serverless
try {
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  } else {
    console.warn("⚠️  Cloudinary credentials not fully configured. Image uploads may fail.");
  }
} catch (error) {
  console.error("Cloudinary configuration error:", error.message);
}

export default cloudinary;
