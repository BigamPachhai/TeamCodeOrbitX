import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import { createIssue } from "../controllers/issueController.js";
import { getAllIssues, getIssueById } from "../controllers/issueController.js";
const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/create", protect, upload.single("image"), createIssue);

router.get("/all", getAllIssues);
router.get("/:id", getIssueById);

export default router;
