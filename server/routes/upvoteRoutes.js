import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  toggleUpvote,
  getUpvoteStatus,
  getBulkUpvotes,
} from "../controllers/upvoteController.js";

const router = express.Router();

// Optional authentication middleware - adds user info if token exists but doesn't require it
const optionalAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      // If token exists, try to authenticate
      protect(req, res, next);
    } else {
      // No token, continue as anonymous user
      next();
    }
  } catch (error) {
    // Token invalid, continue as anonymous user
    next();
  }
};

// Toggle upvote (like/unlike) - NOW WORKS FOR EVERYONE (authenticated & anonymous)
router.post("/toggle", optionalAuth, toggleUpvote);

// Get upvote status for a specific issue - public access
router.get("/status/:issueId", optionalAuth, getUpvoteStatus);

// Get upvotes for multiple issues (bulk) - public access
router.post("/bulk", optionalAuth, getBulkUpvotes);

export default router;
