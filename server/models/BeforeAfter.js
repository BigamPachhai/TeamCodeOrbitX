import mongoose from "mongoose";

const beforeAfterSchema = new mongoose.Schema(
  {
    issue: { type: mongoose.Schema.Types.ObjectId, ref: "Issue" },
    beforeImage: String,
    afterImage: String,
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("BeforeAfter", beforeAfterSchema);
