import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    municipality: String,
    category: String,
    allocatedAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    spentAmount: {
      type: Number,
      default: 0,
    },
    estimatedCost: {
      type: Number,
      default: 0,
    },
    budgetYear: {
      type: String,
      default: new Date().getFullYear().toString(),
    },
    status: {
      type: String,
      enum: ["allocated", "approved", "in-progress", "completed", "over-budget"],
      default: "allocated",
    },
    notes: String,
  },
  { timestamps: true }
);

budgetSchema.index({ issue: 1 });
budgetSchema.index({ department: 1 });
budgetSchema.index({ municipality: 1 });
budgetSchema.index({ budgetYear: 1 });

export default mongoose.model("Budget", budgetSchema);

