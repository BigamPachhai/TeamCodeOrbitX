import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  phone: String, // For SMS/WhatsApp notifications
  googleId: String,
  avatar: String,
  points: { type: Number, default: 0 },
  role: { type: String, default: "user" },
  isVerified: { type: Boolean, default: false },
  pushSubscription: Object, // For push notifications
  notificationPreferences: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    whatsapp: { type: Boolean, default: false },
    push: { type: Boolean, default: true },
  },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
