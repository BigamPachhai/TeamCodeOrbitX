import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  googleId: String,
  avatar: String,
  points: { type: Number, default: 0 },
  role: { type: String, default: "user" },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
