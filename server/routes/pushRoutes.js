import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import PushSubscription from "../models/PushSubscription.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * Subscribe to push notifications
 */
router.post("/subscribe", protect, async (req, res) => {
  try {
    const { endpoint, keys } = req.body;

    // Save or update subscription
    let subscription = await PushSubscription.findOne({
      user: req.user._id,
      endpoint,
    });

    if (subscription) {
      subscription.keys = keys;
      await subscription.save();
    } else {
      subscription = await PushSubscription.create({
        user: req.user._id,
        endpoint,
        keys,
      });
    }

    // Update user notification preferences
    await User.findByIdAndUpdate(req.user._id, {
      pushSubscription: { endpoint, keys },
      "notificationPreferences.push": true,
    });

    res.json({ success: true, message: "Subscribed to push notifications" });
  } catch (error) {
    console.error("Error subscribing to push:", error);
    res.status(500).json({ message: "Error subscribing to push", error: error.message });
  }
});

/**
 * Unsubscribe from push notifications
 */
router.post("/unsubscribe", protect, async (req, res) => {
  try {
    const { endpoint } = req.body;

    await PushSubscription.deleteOne({
      user: req.user._id,
      endpoint,
    });

    // Update user notification preferences
    await User.findByIdAndUpdate(req.user._id, {
      pushSubscription: null,
      "notificationPreferences.push": false,
    });

    res.json({ success: true, message: "Unsubscribed from push notifications" });
  } catch (error) {
    console.error("Error unsubscribing from push:", error);
    res.status(500).json({ message: "Error unsubscribing from push", error: error.message });
  }
});

/**
 * Get VAPID public key (for demo - should be stored securely)
 */
router.get("/vapid-public-key", (req, res) => {
  // In production, generate and store VAPID keys securely
  // For demo, return a placeholder
  res.json({
    publicKey: process.env.VAPID_PUBLIC_KEY || "BHrFpK3vXZJ7xYz2...", // Replace with actual VAPID key
  });
});

export default router;

