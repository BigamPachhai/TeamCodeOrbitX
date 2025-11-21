import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  submitReview,
  getIssueReviews,
  getUserReview,
} from "../controllers/reviewController.js";

const router = express.Router();

// Submit or update review (requires authentication)
router.post("/:issueId", protect, submitReview);

// Get all reviews for an issue (public)
router.get("/issue/:issueId", getIssueReviews);

// Get user's review for an issue (requires authentication)
router.get("/:issueId/user", protect, getUserReview);

export default router;

