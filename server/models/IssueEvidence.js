import mongoose from "mongoose";

const issueEvidenceSchema = new mongoose.Schema(
  {
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: String,
    evidenceType: {
      type: String,
      enum: ["additional_photo", "duplicate_marker", "update", "support"],
      default: "additional_photo",
    },
  },
  { timestamps: true }
);

// Index for efficient queries
issueEvidenceSchema.index({ issue: 1, createdAt: -1 });
issueEvidenceSchema.index({ user: 1 });

export default mongoose.model("IssueEvidence", issueEvidenceSchema);

