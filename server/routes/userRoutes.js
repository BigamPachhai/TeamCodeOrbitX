import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getCurrentUser, getLeaderboard } from "../controllers/authController.js";

const router = express.Router();

// Get current user info (requires authentication)
router.get("/me", protect, getCurrentUser);

// Get leaderboard
router.get("/leaderboard", getLeaderboard);

export default router;
