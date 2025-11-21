import mongoose from "mongoose";

const issueHistorySchema = new mongoose.Schema(
  {
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved"],
      required: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    changeType: {
      type: String,
      enum: ["status_change", "created", "photo_uploaded", "resolved"],
      default: "status_change",
    },
    notes: String, // Optional admin notes
  },
  { timestamps: true }
);

// Index for efficient queries
issueHistorySchema.index({ issue: 1, createdAt: -1 });

export default mongoose.model("IssueHistory", issueHistorySchema);

