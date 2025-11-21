import mongoose from "mongoose";

const offlineIssueSchema = new mongoose.Schema(
  {
    userId: String, // Can be session ID or user ID
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    synced: {
      type: Boolean,
      default: false,
    },
    syncAttempts: {
      type: Number,
      default: 0,
    },
    lastSyncAttempt: Date,
    error: String,
  },
  { timestamps: true }
);

offlineIssueSchema.index({ userId: 1, synced: 1 });
offlineIssueSchema.index({ synced: 1, syncAttempts: 1 });

export default mongoose.model("OfflineIssue", offlineIssueSchema);

