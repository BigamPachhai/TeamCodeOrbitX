import cloudinary from "../config/cloudinary.js";
import {
  analyzeImageCategory,
  generateDescriptionAI,
  suggestPriorityAI,
  assessSeverityAI,
  generateTagsAI,
  predictResolutionTime,
  enhanceDescriptionAI,
  suggestCategoriesAI,
  findSimilarIssues,
  suggestDepartment,
  analyzeSentiment,
  predictImpact,
  detectDuplicateWithDetails,
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

    // Run additional AI analysis
    const priority = await suggestPriorityAI(imageUrl, req.body.description || "");
    const severity = await assessSeverityAI(imageUrl, req.body.description || "");
    const tags = await generateTagsAI(imageUrl, req.body.description || "", category);
    const categories = await suggestCategoriesAI(imageUrl, req.body.description || "");

    return res.json({
      success: true,
      imageUrl,
      category,
      aiDescription,
      priority,
      severity,
      tags,
      categories,
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

/**
 * Enhanced AI endpoint for comprehensive analysis
 */
export const analyzeIssueComprehensive = async (req, res) => {
  try {
    const { imageUrl, description, category, priority } = req.body;

    if (!imageUrl && !description) {
      return res.status(400).json({
        success: false,
        message: "Image URL or description is required",
      });
    }

    const results = {};

    // If image provided
    if (imageUrl) {
      // Category suggestions
      results.categories = await suggestCategoriesAI(imageUrl, description || "");
      
      // Priority suggestion
      results.priority = await suggestPriorityAI(imageUrl, description || "");
      
      // Severity assessment
      results.severity = await assessSeverityAI(imageUrl, description || "");
      
      // Tags generation
      results.tags = await generateTagsAI(imageUrl, description || "", category || "");
    }

    // If description provided, enhance it
    if (description && description.length > 10) {
      results.enhancedDescription = await enhanceDescriptionAI(description);
    }

    // Predict resolution time if category and priority available
    if (category && priority) {
      results.resolutionPrediction = await predictResolutionTime(
        category,
        priority,
        description || ""
      );
    }

    return res.json({
      success: true,
      ...results,
    });
  } catch (error) {
    console.error("Comprehensive AI Error:", error);
    return res.status(500).json({
      success: false,
      message: "AI analysis failed",
      error: error.message,
    });
  }
};

/**
 * Enhance description endpoint
 */
export const enhanceDescription = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Description must be at least 10 characters",
      });
    }

    const enhanced = await enhanceDescriptionAI(description);

    return res.json({
      success: true,
      original: description,
      enhanced,
    });
  } catch (error) {
    console.error("Description Enhancement Error:", error);
    return res.status(500).json({
      success: false,
      message: "Description enhancement failed",
      error: error.message,
    });
  }
};

/**
 * Find similar issues
 */
export const findSimilar = async (req, res) => {
  try {
    const { description, category, lat, lng } = req.body;

    if (!description || description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Description is required (minimum 10 characters)",
      });
    }

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Location coordinates are required",
      });
    }

    const similar = await findSimilarIssues(description, category || "", Number(lat), Number(lng));

    return res.json({
      success: true,
      similarIssues: similar,
      count: similar.length,
    });
  } catch (error) {
    console.error("Find Similar Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to find similar issues",
      error: error.message,
    });
  }
};

/**
 * Suggest department for routing
 */
export const suggestDepartmentRoute = async (req, res) => {
  try {
    const { imageUrl, description, category } = req.body;

    if (!description && !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image URL or description is required",
      });
    }

    const suggestion = await suggestDepartment(imageUrl, description || "", category || "");

    return res.json({
      success: true,
      ...suggestion,
    });
  } catch (error) {
    console.error("Department Suggestion Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to suggest department",
      error: error.message,
    });
  }
};

/**
 * Analyze sentiment
 */
export const analyzeTextSentiment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Text is required (minimum 5 characters)",
      });
    }

    const sentiment = await analyzeSentiment(text);

    return res.json({
      success: true,
      ...sentiment,
    });
  } catch (error) {
    console.error("Sentiment Analysis Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to analyze sentiment",
      error: error.message,
    });
  }
};

/**
 * Predict impact
 */
export const predictIssueImpact = async (req, res) => {
  try {
    const { imageUrl, description, category, locationName } = req.body;

    if (!description && !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image URL or description is required",
      });
    }

    const impact = await predictImpact(
      imageUrl || null,
      description || "",
      category || "",
      locationName || ""
    );

    return res.json({
      success: true,
      ...impact,
    });
  } catch (error) {
    console.error("Impact Prediction Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to predict impact",
      error: error.message,
    });
  }
};

/**
 * Check for duplicates with details
 */
export const checkDuplicate = async (req, res) => {
  try {
    const { lat, lng, imageUrl, description } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Location coordinates are required",
      });
    }

    const duplicateInfo = await detectDuplicateWithDetails(
      Number(lat),
      Number(lng),
      imageUrl || null,
      description || ""
    );

    return res.json({
      success: true,
      ...duplicateInfo,
    });
  } catch (error) {
    console.error("Duplicate Check Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check for duplicates",
      error: error.message,
    });
  }
};
