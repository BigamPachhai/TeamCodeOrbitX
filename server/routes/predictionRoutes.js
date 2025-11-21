import express from "express";
import { getIssuePrediction, getBulkIssuePredictions } from "../controllers/predictionController.js";

const router = express.Router();

router.get("/predict", getIssuePrediction);
router.get("/predictions/bulk", getBulkIssuePredictions);

export default router;

