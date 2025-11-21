import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";

import {
  createIssue,
  getAllIssues,
  getIssueById,
  getBeforeAfterPhotos,
} from "../controllers/issueController.js";

import { generateAIContent } from "../controllers/aiController.js";

const router = express.Router();

// Multer upload (temporary local storage before Cloudinary)
const upload = multer({ dest: "uploads/" });

/* ==========================================================
   AI DESCRIPTION + CATEGORY (must come BEFORE /:id)
   NOTE: This is a POST route, so it won't conflict with GET /:id
========================================================== */
router.post("/ai-generate", upload.single("image"), generateAIContent);

/* ==========================================================
   CREATE ISSUE (requires login)
========================================================== */
router.post("/create", protect, upload.single("image"), createIssue);

/* ==========================================================
   GET ALL ISSUES (public) - MUST come BEFORE /:id
========================================================== */
router.get("/all", getAllIssues);

/* ==========================================================
   GET BEFORE/AFTER PHOTOS (must come BEFORE /:id)
========================================================== */
router.get("/:id/before-after", getBeforeAfterPhotos);

/* ==========================================================
   GET ISSUE BY ID (must ALWAYS be last among GET routes)
========================================================== */
router.get("/:id", getIssueById);

export default router;
