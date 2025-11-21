import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { sendMultiChannelNotification } from "../utils/notificationUtils.js";
import { protect } from "../middleware/authMiddleware.js";

/**
 * Get all notifications for logged-in user
 */
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .populate("issue", "category locationName status")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.error("Error getting notifications:", error);
    res.status(500).json({ message: "Error getting notifications", error });
  }
};

/**
 * Get unread count
 */
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user._id,
      read: false,
    });

    res.json({ count });
  } catch (error) {
    console.error("Error getting unread count:", error);
    res.status(500).json({ message: "Error getting unread count", error });
  }
};

/**
 * Mark notification as read
 */
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.read = true;
    await notification.save();

    res.json({ message: "Notification marked as read", notification });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Error marking notification as read", error });
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ message: "Error marking all notifications as read", error });
  }
};

/**
 * Send test notification (for testing multi-channel)
 */
export const sendTestNotification = async (req, res) => {
  try {
    const { channels } = req.body; // ['email', 'sms', 'whatsapp', 'push']

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const testNotification = {
      title: "Test Notification",
      message: "This is a test notification from Sanket - Public Grievance Management System",
    };

    const results = await sendMultiChannelNotification(user, testNotification);

    res.json({
      message: "Test notification sent",
      results,
      note: "Configure SMS/WhatsApp/Email in environment variables to enable",
    });
  } catch (error) {
    console.error("Error sending test notification:", error);
    res.status(500).json({ message: "Error sending test notification", error: error.message });
  }
};
