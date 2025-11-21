import Issue from "../models/Issue.js";
import { generateIssuePDF } from "../utils/pdfGenerator.js";

export const generatePDF = async (req, res) => {
  const { id } = req.params;

  const issue = await Issue.findById(id);
  if (!issue) return res.status(404).json({ message: "Issue not found" });

  const path = await generateIssuePDF(issue);

  res.download(path);
};
