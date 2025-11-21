import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import Issue from "../models/Issue.js";
import IssueEvidence from "../models/IssueEvidence.js";
import User from "../models/User.js";

// Configure multer for memory storage
const storage = multer.memoryStorage();
export const upload = multer({ storage });

/**
 * Add evidence (photo/update) to an existing issue
 */
export const addEvidence = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { description, evidenceType } = req.body;

    // Verify issue exists
    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Check if image is provided
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Upload image to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "issue-evidence",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(req.files.image[0].buffer);
    });

    // Create evidence record
    const evidence = await IssueEvidence.create({
      issue: issueId,
      user: req.user._id,
      image: uploadResult.secure_url,
      description: description || undefined,
      evidenceType: evidenceType || "additional_photo",
    });

    // Award 2 points for contributing evidence
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { points: 2 },
    });

    const populatedEvidence = await IssueEvidence.findById(evidence._id)
      .populate("user", "fullName email");

    res.json({
      message: "Evidence added successfully",
      evidence: populatedEvidence,
    });
  } catch (error) {
    console.error("Error adding evidence:", error);
    res.status(500).json({ message: "Error adding evidence", error: error.message });
  }
};

/**
 * Get all evidence for an issue
 */
export const getIssueEvidence = async (req, res) => {
  try {
    const { issueId } = req.params;

    const evidence = await IssueEvidence.find({ issue: issueId })
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });

    res.json({ evidence });
  } catch (error) {
    console.error("Error fetching evidence:", error);
    res.status(500).json({ message: "Error fetching evidence", error: error.message });
  }
};

