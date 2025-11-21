import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    category: String,
    description: String,
    aiDescription: String,
    image: String,
    locationName: String,
    lat: Number,
    lng: Number,
    severity: String,
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Issue", issueSchema);
