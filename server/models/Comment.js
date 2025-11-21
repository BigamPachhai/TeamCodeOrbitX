import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    issue: { type: mongoose.Schema.Types.ObjectId, ref: "Issue" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comment: String,
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
