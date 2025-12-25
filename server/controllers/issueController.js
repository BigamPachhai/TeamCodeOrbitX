import Issue from "../models/Issue.js";
import BeforeAfter from "../models/BeforeAfter.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import {
  analyzeImageCategory,
  generateDescriptionAI,
  detectDuplicateIssue,
  allocateBudgetAI,
} from "../utils/aiUtils.js";
import Budget from "../models/Budget.js";
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

    // Upload image to Cloudinary (serverless compatible - use buffer)
    let uploadedImage = null;
    if (req.file) {
      const upload = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "issues" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
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
      municipality: req.body.municipality || "",
      category,
      ward: req.body.ward || "",
      locationName,
      lat,
      lng,
      image: uploadedImage,
      isAnonymous: req.body.isAnonymous === "true" || req.body.isAnonymous === true,
    });

    // Create initial history entry
    const IssueHistory = (await import("../models/IssueHistory.js")).default;
    await IssueHistory.create({
      issue: issue._id,
      status: "pending",
      changedBy: req.user._id,
      changeType: "created",
      notes: "Issue reported",
    });

    // Award 10 points for reporting a new issue
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { points: 10 },
    });

    // AI-Based Budget Allocation
    // Automatically allocate budget based on photo, department, and category
    let budgetAllocation = null;
    try {
      // Map category to department
      const categoryToDepartment = {
        "Road Management": "Road Department",
        "Waste": "Waste Management Department",
        "Electricity": "Electricity Department",
        "Water": "Water Supply Department",
        "Other": "General Administration"
      };
      const department = categoryToDepartment[category] || "General Administration";

      console.log(`🤖 AI Budget Allocation: Analyzing issue ${issue._id} for ${department}...`);
      
      // Calculate budget allocation using AI
      budgetAllocation = await allocateBudgetAI(
        uploadedImage,
        description,
        category,
        locationName
      );

      // Create budget entry
      const budgetYear = new Date().getFullYear().toString();
      const budget = await Budget.create({
        issue: issue._id,
        department: department,
        municipality: req.body.municipality || "",
        category: category,
        allocatedAmount: budgetAllocation.allocatedAmount,
        estimatedCost: budgetAllocation.estimatedCost,
        budgetYear: budgetYear,
        status: "allocated",
        notes: `AI-generated budget: ${budgetAllocation.reasoning} (${budgetAllocation.confidence}% confidence, Probability: ${(budgetAllocation.probabilityFactor * 100).toFixed(0)}%)`,
      });

      console.log(`💰 Budget allocated: रु ${budgetAllocation.allocatedAmount.toLocaleString()} (Probability: ${(budgetAllocation.probabilityFactor * 100).toFixed(0)}%)`);

      // Attach budget info to response
      issue.budget = budget;
      issue.budgetAllocation = budgetAllocation;
    } catch (budgetError) {
      console.error("Error allocating budget:", budgetError);
      // Don't fail issue creation if budget allocation fails
    }

    return res.json({
      message: "Issue created successfully",
      issue,
      budget: budgetAllocation ? {
        allocatedAmount: budgetAllocation.allocatedAmount,
        estimatedCost: budgetAllocation.estimatedCost,
        probabilityFactor: budgetAllocation.probabilityFactor,
        confidence: budgetAllocation.confidence,
        reasoning: budgetAllocation.reasoning,
        aiGenerated: budgetAllocation.aiGenerated,
      } : null,
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
    const pdfBuffer = await generateIssuePDF(issue, baseUrl);

    // Send PDF buffer directly (serverless compatible)
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="issue_${id}.pdf"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Error generating PDF", error: error.message });
  }
};


/* ============================================================
   GET ALL ISSUE TEMPLATES
============================================================ */
export const getAllIssueTemplates = async (req, res) => {
  try {
    const { issueTemplates } = await import("../data/issueTemplates.js");
    res.json(issueTemplates);
  } catch (error) {
    console.error("Error getting templates:", error);
    res.status(500).json({ message: "Error getting templates", error: error.message });
  }
};

/* ============================================================
   GET TEMPLATES BY CATEGORY
============================================================ */
export const getIssueTemplate = async (req, res) => {
  try {
    const { category } = req.params;
    const { getTemplatesByCategory } = await import("../data/issueTemplates.js");
    const templates = getTemplatesByCategory(category);
    res.json(templates);
  } catch (error) {
    console.error("Error getting template:", error);
    res.status(500).json({ message: "Error getting template", error: error.message });
  }
};
