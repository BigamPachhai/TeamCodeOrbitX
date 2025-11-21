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
