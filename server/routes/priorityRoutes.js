import express from "express";
import { getIssuePriority, getIssuesByPriority } from "../controllers/priorityController.js";

const router = express.Router();

router.get("/:id", getIssuePriority);
router.get("/", getIssuesByPriority);

export default router;

