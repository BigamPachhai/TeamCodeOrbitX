import Issue from "../models/Issue.js";
import cloudinary from "../config/cloudinary.js";
import {
  analyzeImageCategory,
  generateDescriptionAI,
  detectDuplicateIssue,
} from "../utils/aiUtils.js";

export const createIssue = async (req, res) => {
  const { description, lat, lng, locationName } = req.body;
  const imageFile = req.file.path;

  const upload = await cloudinary.uploader.upload(imageFile);

  const category = await analyzeImageCategory(upload.secure_url);
  const aiDesc = await generateDescriptionAI(upload.secure_url);

  const duplicate = await detectDuplicateIssue(lat, lng, upload.secure_url);
  if (duplicate)
    return res.status(400).json({ message: "Duplicate issue detected" });

  const issue = await Issue.create({
    user: req.user._id,
    category,
    description,
    aiDescription: aiDesc,
    image: upload.secure_url,
    lat,
    lng,
    locationName,
  });

  res.json(issue);
};
export const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: "Error getting issues", error });
  }
};

export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate("user");
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: "Error fetching issue", error });
  }
};
