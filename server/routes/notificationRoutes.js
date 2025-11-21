import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  sendTestNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

// All routes require authentication
router.get("/", protect, getNotifications);
router.get("/unread-count", protect, getUnreadCount);
router.put("/:id/read", protect, markAsRead);
router.put("/all/read", protect, markAllAsRead);
router.post("/test", protect, sendTestNotification);

export default router;

