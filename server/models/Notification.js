import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    issue: { type: mongoose.Schema.Types.ObjectId, ref: "Issue" },
    type: {
      type: String,
      enum: ["issue_resolved", "issue_in_progress", "before_after_uploaded"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);

