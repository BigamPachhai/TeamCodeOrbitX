import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addEvidence, getIssueEvidence, upload } from "../controllers/evidenceController.js";

const router = express.Router();

router.post("/:issueId", protect, upload.single("image"), addEvidence);
router.get("/:issueId", getIssueEvidence);

export default router;

