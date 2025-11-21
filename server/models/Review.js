import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    issue: { type: mongoose.Schema.Types.ObjectId, ref: "Issue", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

// Ensure one review per user per issue
reviewSchema.index({ issue: 1, user: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);

