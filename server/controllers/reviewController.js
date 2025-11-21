import Review from "../models/Review.js";
import Issue from "../models/Issue.js";
import { protect } from "../middleware/authMiddleware.js";

/**
 * Submit a review for a resolved issue
 */
export const submitReview = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { rating, comment } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    // Check if issue exists and is resolved
    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (issue.status !== "resolved") {
      return res.status(400).json({
        message: "You can only review resolved issues",
      });
    }

    // Check if user already reviewed this issue
    const existingReview = await Review.findOne({
      issue: issueId,
      user: req.user._id,
    });

    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.comment = comment || "";
      await existingReview.save();
      return res.json({
        message: "Review updated successfully",
        review: existingReview,
      });
    }

    // Create new review
    const review = await Review.create({
      issue: issueId,
      user: req.user._id,
      rating,
      comment: comment || "",
    });

    res.json({
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ message: "Error submitting review", error });
  }
};

/**
 * Get reviews for an issue
 */
export const getIssueReviews = async (req, res) => {
  try {
    const { issueId } = req.params;

    const reviews = await Review.find({ issue: issueId })
      .populate("user", "fullName email avatar")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};

/**
 * Get user's review for an issue
 */
export const getUserReview = async (req, res) => {
  try {
    const { issueId } = req.params;

    const review = await Review.findOne({
      issue: issueId,
      user: req.user._id,
    }).populate("user", "fullName email avatar");

    res.json(review || null);
  } catch (error) {
    console.error("Error fetching user review:", error);
    res.status(500).json({ message: "Error fetching review", error });
  }
};

