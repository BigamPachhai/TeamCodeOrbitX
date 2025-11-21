import mongoose from "mongoose";

const beforeAfterSchema = new mongoose.Schema(
  {
    issue: { type: mongoose.Schema.Types.ObjectId, ref: "Issue" },
    beforeImage: String,
    afterImage: String,
  },
  { timestamps: true }
);

export default mongoose.model("BeforeAfter", beforeAfterSchema);
