import express from "express";
import { getLeaderboard } from "../controllers/authController.js";

const router = express.Router();

// Get leaderboard
router.get("/leaderboard", getLeaderboard);

export default router;
