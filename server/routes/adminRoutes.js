import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import {
  getAllIssues,
  updateIssueStatus,
} from "../controllers/adminController.js";
import { generatePDF } from "../controllers/pdfController.js";

const router = express.Router();

router.get("/issues", protect, adminOnly, getAllIssues);
router.put("/update-status/:id", protect, adminOnly, updateIssueStatus);
router.get("/pdf/:id", protect, adminOnly, generatePDF);

export default router;
