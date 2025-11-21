import Issue from "../models/Issue.js";
import BeforeAfter from "../models/BeforeAfter.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import Review from "../models/Review.js";
import IssueHistory from "../models/IssueHistory.js";
import cloudinary from "../config/cloudinary.js";

export const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate("user", "fullName email avatar")
      .populate("upvoteCount")
      .populate("comments")
      .sort({ createdAt: -1 });

    console.log(`Found ${issues.length} issues for admin`);

    // Log each issue with photo info for debugging
    issues.forEach((issue, index) => {
      console.log(
        `Issue ${index + 1}: User: ${
          issue.user?.fullName || "Unknown"
        }, Anonymous: ${issue.isAnonymous || false}, Image: ${issue.image ? "Yes" : "No"}, Status: ${issue.status}`
      );
    });

    // For admin, always show the real user info (even for anonymous posts)
    res.json(issues);
  } catch (error) {
    console.error("Error fetching admin issues:", error);
    res.status(500).json({ message: "Error getting issues", error });
  }
};

export const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!["pending", "in-progress", "resolved"].includes(status)) {
      return res.status(400).json({
        message:
          "Invalid status. Must be 'pending', 'in-progress', or 'resolved'",
      });
    }

    const issue = await Issue.findById(id).populate("user", "fullName email");
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const oldStatus = issue.status;
    issue.status = status;
    await issue.save();

    // Record status change in history
    await IssueHistory.create({
      issue: id,
      status: status,
      changedBy: req.user._id,
      changeType: "status_change",
      notes: notes || undefined,
    });

    const updatedIssue = await Issue.findById(id)
      .populate("user", "fullName email avatar")
      .populate("upvoteCount")
      .populate("comments");

    // Award bonus points when issue is resolved
    if (status === "resolved" && oldStatus !== "resolved" && issue.user) {
      await User.findByIdAndUpdate(issue.user._id, {
        $inc: { points: 5 },
      });
    }

    // Send notification to reporter when status changes
    if (issue.user && oldStatus !== status) {
      let notificationType, title, message;

      if (status === "resolved") {
        notificationType = "issue_resolved";
        title = "🎉 Issue Resolved!";
        message = `Great news! Your reported issue "${issue.category}" at ${issue.locationName} has been resolved. You can now view the before/after photos and leave a review.`;
      } else if (status === "in-progress") {
        notificationType = "issue_in_progress";
        title = "🔄 Issue In Progress";
        message = `Your reported issue "${issue.category}" at ${issue.locationName} is now being worked on by the department.`;
      }

      if (notificationType) {
        await Notification.create({
          user: issue.user._id,
          issue: issue._id,
          type: notificationType,
          title,
          message,
        });
      }
    }

    console.log(`Issue ${id} status updated to ${status}`);
    res.json(updatedIssue);
  } catch (error) {
    console.error("Error updating issue status:", error);
    res
      .status(500)
      .json({ message: "Error updating status", error: error.message });
  }
};

export const uploadAfterPhoto = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if issue exists
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Upload image to Cloudinary
    let afterImageUrl = null;
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "before-after",
      });
      afterImageUrl = upload.secure_url;
    } else {
      return res.status(400).json({ message: "No image provided" });
    }

    // Find or create BeforeAfter record
    let beforeAfter = await BeforeAfter.findOne({ issue: id });

    if (beforeAfter) {
      // Update existing record
      beforeAfter.afterImage = afterImageUrl;
      await beforeAfter.save();
    } else {
      // Create new record
      beforeAfter = await BeforeAfter.create({
        issue: id,
        beforeImage: issue.image, // Use the original issue image as before
        afterImage: afterImageUrl,
      });
    }

    // Update issue status to resolved if not already
    if (issue.status !== "resolved") {
      await Issue.findByIdAndUpdate(id, { status: "resolved" });
    }

    res.json({
      message: "After photo uploaded successfully",
      beforeAfter,
    });
  } catch (error) {
    console.error("Error uploading after photo:", error);
    res.status(500).json({ message: "Error uploading photo", error });
  }
};

export const getIssueById = async (req, res) => {
  try {
    const { id } = req.params;
    const mongoose = await import("mongoose");
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid issue ID format" });
    }

    const issue = await Issue.findById(id)
      .populate("user", "fullName email avatar")
      .populate("upvoteCount")
      .populate({
        path: "comments",
        populate: { path: "user", select: "fullName email" },
      });

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Admin always sees real user info, even for anonymous posts
    res.json(issue);
  } catch (error) {
    console.error("Error fetching issue:", error);
    res.status(500).json({ message: "Error fetching issue", error });
  }
};

export const getBeforeAfter = async (req, res) => {
  try {
    const { id } = req.params;
    const beforeAfter = await BeforeAfter.find({ issue: id })
      .populate("issue")
      .sort({ createdAt: -1 });

    res.json(beforeAfter);
  } catch (error) {
    console.error("Error fetching before/after:", error);
    res.status(500).json({ message: "Error fetching before/after", error });
  }
};

/**
 * Get all reviews for admin panel
 */
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "fullName email")
      .populate("issue", "category locationName status")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};

// New function to upload both before and after photos
// Import IssueHistory for status tracking
import IssueHistory from "../models/IssueHistory.js";

export const uploadCompletionPhotos = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if issue exists
    const issue = await Issue.findById(id).populate("user", "fullName email");
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Check if after image is provided
    if (!req.files || !req.files.afterImage) {
      return res
        .status(400)
        .json({ message: "After image is required" });
    }

    // Always use the original issue image as the before image
    const beforeImageUrl = issue.image;
    
    if (!beforeImageUrl) {
      return res.status(400).json({ 
        message: "Cannot create before/after comparison: Original issue image not found" 
      });
    }

    // Upload after image to Cloudinary
    const afterUpload = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "before-after" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(req.files.afterImage[0].buffer);
    });

    // Create BeforeAfter record
    const beforeAfter = await BeforeAfter.create({
      issue: id,
      beforeImage: beforeImageUrl,
      afterImage: afterUpload.secure_url,
    });

    // Update issue status to resolved if not already
    const wasResolved = issue.status === "resolved";
    if (!wasResolved) {
      issue.status = "resolved";
      await issue.save();

      // Award 5 bonus points when issue is resolved
      if (issue.user) {
        await User.findByIdAndUpdate(issue.user._id, {
          $inc: { points: 5 },
        });
      }
    }

    // Send notification to reporter
    if (issue.user) {
      await Notification.create({
        user: issue.user._id,
        issue: issue._id,
        type: "before_after_uploaded",
        title: "📸 Completion Photos Uploaded!",
        message: `Before/after photos have been uploaded for your issue "${issue.category}" at ${issue.locationName}. Check out the results and share the success story!`,
      });
    }

    console.log(`Completion photos uploaded for issue ${id}`);
    res.json({
      message: "Completion photos uploaded successfully",
      beforeAfter,
    });
  } catch (error) {
    console.error("Error uploading completion photos:", error);
    res
      .status(500)
      .json({ message: "Error uploading photos", error: error.message });
  }
};
