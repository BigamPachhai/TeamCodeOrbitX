import Issue from "../models/Issue.js";
import cloudinary from "../config/cloudinary.js";
import {
  analyzeImageCategory,
  generateDescriptionAI,
  detectDuplicateIssue,
} from "../utils/aiUtils.js";

/* ============================================================
   CREATE ISSUE (with AI + Cloudinary)
============================================================ */
export const createIssue = async (req, res) => {
  try {
    let { description, category, locationName, lat, lng } = req.body;

    // Convert to numbers
    lat = Number(lat);
    lng = Number(lng);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        message: "Latitude and Longitude must be valid numbers",
      });
    }

    // Upload image to Cloudinary
    let uploadedImage = null;
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "issues",
      });
      uploadedImage = upload.secure_url;
    }

    // Duplicate Detection
    const isDuplicate = await detectDuplicateIssue(lat, lng, uploadedImage);
    if (isDuplicate) {
      return res.status(400).json({
        message: "Duplicate issue detected in this location",
      });
    }

    // AI Category
    if (!category) {
      category = await analyzeImageCategory(uploadedImage);
    }

    // AI Description
    if (!description || description.trim().length < 5) {
      description = await generateDescriptionAI(uploadedImage);
    }

    // Save Issue
    const issue = await Issue.create({
      user: req.user._id,
      description,
      category,
      locationName,
      lat,
      lng,
      image: uploadedImage,
    });

    return res.json({
      message: "Issue created successfully",
      issue,
    });
  } catch (error) {
    console.error("Error creating issue:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

/* ============================================================
   GET ALL ISSUES  (THIS IS WHAT YOU WERE MISSING)
============================================================ */
export const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate("user", "fullName email")
      .populate("upvoteCount")
      .sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    console.error("Error fetching issues:", error);
    res.status(500).json({ message: "Error getting issues", error });
  }
};

/* ============================================================
   GET ISSUE BY ID  (ALSO REQUIRED)
============================================================ */
export const getIssueById = async (req, res) => {
  try {
    // Validate ObjectId format
    const mongoose = await import("mongoose");
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid issue ID format" });
    }

    const issue = await Issue.findById(req.params.id)
      .populate("user", "fullName email")
      .populate("upvoteCount")
      .populate({
        path: "comments",
        populate: { path: "user", select: "fullName email" },
      });

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    res.json(issue);
  } catch (error) {
    console.error("Error fetching issue:", error);
    res.status(500).json({ message: "Error fetching issue", error });
  }
};
