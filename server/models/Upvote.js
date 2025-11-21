import mongoose from "mongoose";

const upvoteSchema = new mongoose.Schema(
  {
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Optional for anonymous upvotes
    ipAddress: { type: String }, // Track anonymous users by IP
    sessionId: { type: String }, // Alternative tracking method
  },
  { timestamps: true }
);

// Compound index to prevent duplicate upvotes
upvoteSchema.index({ issue: 1, user: 1 }, { sparse: true });
upvoteSchema.index({ issue: 1, ipAddress: 1 }, { sparse: true });

export default mongoose.model("Upvote", upvoteSchema);
