import cloudinary from "../config/cloudinary.js";
import {
  analyzeImageCategory,
  generateDescriptionAI,
} from "../utils/aiUtils.js";

/**
 * AI endpoint to generate:
 * - Category from image
 * - Description from image
 *
 * This is used when the user clicks "Generate Description" in ReportIssue.jsx
 */
export const generateAIContent = async (req, res) => {
  try {
    // Ensure image is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required for AI analysis",
      });
    }

    // Upload image to Cloudinary
    const uploaded = await cloudinary.uploader.upload(req.file.path, {
      folder: "ai-temp",
    });

    const imageUrl = uploaded.secure_url;

    // Run AI category detection
    const category = await analyzeImageCategory(imageUrl);

    // Run AI description generator
    const aiDescription = await generateDescriptionAI(imageUrl);

    return res.json({
      success: true,
      imageUrl,
      category,
      aiDescription,
    });
  } catch (error) {
    console.error("AI Error:", error);
    return res.status(500).json({
      success: false,
      message: "AI processing failed",
      error: error.message,
    });
  }
};
