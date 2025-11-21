import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getBudgetSummary,
  createOrUpdateBudget,
  updateSpentAmount,
} from "../controllers/budgetController.js";

const router = express.Router();

router.get("/summary", getBudgetSummary);
router.post("/", protect, createOrUpdateBudget);
router.put("/spent", protect, updateSpentAmount);

export default router;

