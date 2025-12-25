import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";

import {
  createIssue,
  getAllIssues,
  getIssueById,
  getBeforeAfterPhotos,
  getIssueQRCode,
  exportIssuePDF,
  getIssueTemplate,
  getAllIssueTemplates,
} from "../controllers/issueController.js";

import {
  generateAIContent,
  analyzeIssueComprehensive,
  enhanceDescription,
  findSimilar,
  suggestDepartmentRoute,
  analyzeTextSentiment,
  predictIssueImpact,
  checkDuplicate,
} from "../controllers/aiController.js";

const router = express.Router();

// Multer upload - use memory storage for serverless compatibility
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* ==========================================================
   AI ROUTES (must come BEFORE /:id)
========================================================== */
// AI description + category generation (with image upload)
router.post("/ai-generate", upload.single("image"), generateAIContent);

// Comprehensive AI analysis (with image URL or description)
router.post("/ai-analyze", analyzeIssueComprehensive);

// Description enhancement
router.post("/ai-enhance", enhanceDescription);

// Find similar issues
router.post("/ai-find-similar", findSimilar);

// Suggest department routing
router.post("/ai-suggest-department", suggestDepartmentRoute);

// Analyze sentiment
router.post("/ai-sentiment", analyzeTextSentiment);

// Predict impact
router.post("/ai-predict-impact", predictIssueImpact);

// Check for duplicates
router.post("/ai-check-duplicate", checkDuplicate);

/* ==========================================================
   CREATE ISSUE (requires login)
========================================================== */
router.post("/create", protect, upload.single("image"), createIssue);

/* ==========================================================
   GET ALL ISSUES (public) - MUST come BEFORE /:id
========================================================== */
router.get("/all", getAllIssues);

/* ==========================================================
   ISSUE TEMPLATES
========================================================== */
router.get("/templates", getAllIssueTemplates);
router.get("/templates/:category", getIssueTemplate);

/* ==========================================================
   GET BEFORE/AFTER PHOTOS (must come BEFORE /:id)
========================================================== */
router.get("/:id/before-after", getBeforeAfterPhotos);

/* ==========================================================
   QR CODE AND PDF EXPORT (must come BEFORE /:id)
========================================================== */
router.get("/:id/qrcode", getIssueQRCode);
router.get("/:id/pdf", exportIssuePDF);

/* ==========================================================
   GET ISSUE BY ID (must ALWAYS be last among GET routes)
========================================================== */
router.get("/:id", getIssueById);

export default router;
