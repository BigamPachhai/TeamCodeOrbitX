import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    municipality: String,
    category: String,
    ward: String,
    description: String,
    aiDescription: String,
    image: String,
    locationName: String,
    lat: Number,
    lng: Number,
    severity: String,
    status: { type: String, default: "pending" },
    isAnonymous: { type: Boolean, default: false },
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for upvote count
issueSchema.virtual("upvoteCount", {
  ref: "Upvote",
  localField: "_id",
  foreignField: "issue",
  count: true,
});

// Virtual field for comments
issueSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "issue",
});

export default mongoose.model("Issue", issueSchema);
