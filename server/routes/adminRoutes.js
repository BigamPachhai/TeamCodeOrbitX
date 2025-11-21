import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import {
  getAllIssues,
  getIssueById,
  updateIssueStatus,
  uploadAfterPhoto,
  getBeforeAfter,
  uploadCompletionPhotos,
  getAllReviews,
} from "../controllers/adminController.js";
import { generatePDF } from "../controllers/pdfController.js";

const router = express.Router();

// Multer configuration - use memory storage for direct Cloudinary upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/issues", protect, adminOnly, getAllIssues);
router.get("/issue/:id", protect, adminOnly, getIssueById);
router.put("/update-status/:id", protect, adminOnly, updateIssueStatus);

// Legacy route - single after photo
router.post(
  "/upload-after/:id",
  protect,
  adminOnly,
  upload.single("image"),
  uploadAfterPhoto
);

// New route - upload both before and after photos
router.post(
  "/completion-photos/:id",
  protect,
  adminOnly,
  upload.fields([
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
  ]),
  uploadCompletionPhotos
);

router.get("/before-after/:id", protect, adminOnly, getBeforeAfter);
router.get("/reviews", protect, adminOnly, getAllReviews);
router.get("/pdf/:id", protect, adminOnly, generatePDF);

export default router;
