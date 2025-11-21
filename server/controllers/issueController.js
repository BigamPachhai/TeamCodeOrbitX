import Issue from "../models/Issue.js";
import BeforeAfter from "../models/BeforeAfter.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import {
  analyzeImageCategory,
  generateDescriptionAI,
  detectDuplicateIssue,
} from "../utils/aiUtils.js";
import { generateIssueQRCode } from "../utils/qrGenerator.js";
import { generateIssuePDF } from "../utils/pdfGenerator.js";
import { getTemplate, getAllTemplates } from "../utils/issueTemplates.js";

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

    // Duplicate Detection - Optional, only if user wants it
    // For now, we'll skip automatic duplicate detection to avoid blocking submissions
    // You can enable this later if needed
    // const isDuplicate = await detectDuplicateIssue(lat, lng, uploadedImage);
    // if (isDuplicate) {
    //   return res.status(400).json({
    //     message: "Duplicate issue detected in this location",
    //   });
    // }

    // AI Category - Only use if category is not provided by user
    // Don't auto-process, let user choose or use AI button
    if (!category || category.trim() === "") {
      // Only auto-detect if no category selected
      if (uploadedImage) {
        try {
          category = await analyzeImageCategory(uploadedImage);
        } catch (error) {
          console.error("Error auto-detecting category:", error);
          category = "Other"; // Fallback
        }
      } else {
        category = "Other"; // Default if no image
      }
    }

    // Description validation - user must provide description (either written themselves or AI-generated)
    // NO automatic AI generation - users must explicitly click the "AI Analysis" button
    if (!description || description.trim().length < 10) {
      return res.status(400).json({
        message: "Description is required. Please write a description or use AI Analysis to generate one.",
      });
    }

    // Save Issue
    const issue = await Issue.create({
      user: req.user._id,
      description,
      category,
      ward: req.body.ward || "",
      locationName,
      lat,
      lng,
      image: uploadedImage,
      isAnonymous: req.body.isAnonymous === "true" || req.body.isAnonymous === true,
    });

    // Award 10 points for reporting a new issue
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { points: 10 },
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
    
    // Hide user info for anonymous posts (but keep it in the data structure)
    const processedIssues = issues.map((issue) => {
      const issueObj = issue.toObject();
      if (issueObj.isAnonymous) {
        // Keep user data but mark as anonymous for frontend
        issueObj.user = {
          _id: issueObj.user?._id,
          fullName: "Anonymous",
          email: "anonymous@example.com",
        };
      }
      return issueObj;
    });
    
    res.json(processedIssues);
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
    
    // Hide user info for anonymous posts
    const issueObj = issue.toObject();
    if (issueObj.isAnonymous) {
      issueObj.user = {
        _id: issueObj.user?._id,
        fullName: "Anonymous",
        email: "anonymous@example.com",
      };
    }
    
    res.json(issueObj);
  } catch (error) {
    console.error("Error fetching issue:", error);
    res.status(500).json({ message: "Error fetching issue", error });
  }
};

/* ============================================================
   GET BEFORE/AFTER PHOTOS FOR AN ISSUE (PUBLIC)
============================================================ */
export const getBeforeAfterPhotos = async (req, res) => {
  try {
    const { id } = req.params;
    
    const beforeAfter = await BeforeAfter.find({ issue: id })
      .populate("issue", "category locationName status")
      .sort({ createdAt: -1 });
    
    res.json(beforeAfter);
  } catch (error) {
    console.error("Error fetching before/after photos:", error);
    res.status(500).json({ message: "Error fetching photos", error });
  }
};

/* ============================================================
   GET QR CODE FOR ISSUE SHARING
============================================================ */
export const getIssueQRCode = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const baseUrl = process.env.FRONTEND_URL || req.protocol + "://" + req.get("host");
    const qrData = await generateIssueQRCode(id, baseUrl);

    res.json({
      success: true,
      ...qrData,
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    res.status(500).json({ message: "Error generating QR code", error: error.message });
  }
};

/* ============================================================
   EXPORT ISSUE AS PDF (Public)
============================================================ */
export const exportIssuePDF = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await Issue.findById(id).populate("user", "fullName");

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const baseUrl = process.env.FRONTEND_URL || req.protocol + "://" + req.get("host");
    const pdfPath = await generateIssuePDF(issue, baseUrl);

    res.download(pdfPath, `issue_${id}.pdf`, (err) => {
      if (err) {
        console.error("Error downloading PDF:", err);
      }
      // Clean up file after download
      setTimeout(() => {
        try {
          const fs = require("fs");
          if (fs.existsSync(pdfPath)) {
            fs.unlinkSync(pdfPath);
          }
        } catch (cleanupError) {
          console.error("Error cleaning up PDF:", cleanupError);
        }
      }, 5000);
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Error generating PDF", error: error.message });
  }
};

/* ============================================================
   GET ISSUE TEMPLATE
============================================================ */
export const getIssueTemplate = async (req, res) => {
  try {
    const { category } = req.params;
    const template = getTemplate(category || "Other");

    res.json({
      success: true,
      template,
    });
  } catch (error) {
    console.error("Error getting template:", error);
    res.status(500).json({ message: "Error getting template", error: error.message });
  }
};

/* ============================================================
   GET ALL ISSUE TEMPLATES
============================================================ */
export const getAllIssueTemplates = async (req, res) => {
  try {
    const templates = getAllTemplates();

    res.json({
      success: true,
      templates,
    });
  } catch (error) {
    console.error("Error getting templates:", error);
    res.status(500).json({ message: "Error getting templates", error: error.message });
  }
};
