import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getIssueTimeline } from "../controllers/timelineController.js";

const router = express.Router();

router.get("/:id", getIssueTimeline);

export default router;

