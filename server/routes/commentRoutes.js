import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addComment, getComments } from "../controllers/commentController.js";

const router = express.Router();

router.post("/add", protect, addComment);
router.get("/:issueId", getComments);

export default router;
