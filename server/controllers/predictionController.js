import { predictLikelyIssues, getBulkPredictions } from "../utils/predictionUtils.js";

/**
 * Get predictions for a specific location/category
 */
export const getIssuePrediction = async (req, res) => {
  try {
    const { location, category } = req.query;

    if (!location || !category) {
      return res.status(400).json({
        message: "Location and category are required",
      });
    }

    const prediction = await predictLikelyIssues(location, category);

    res.json({
      success: true,
      prediction,
    });
  } catch (error) {
    console.error("Error getting prediction:", error);
    res.status(500).json({
      message: "Error getting prediction",
      error: error.message,
    });
  }
};

/**
 * Get bulk predictions for dashboard
 */
export const getBulkIssuePredictions = async (req, res) => {
  try {
    const filters = req.query;
    const predictions = await getBulkPredictions(filters);

    res.json({
      success: true,
      predictions,
      count: predictions.length,
    });
  } catch (error) {
    console.error("Error getting bulk predictions:", error);
    res.status(500).json({
      message: "Error getting bulk predictions",
      error: error.message,
    });
  }
};

