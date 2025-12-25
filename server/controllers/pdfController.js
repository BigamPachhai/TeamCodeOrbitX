import Issue from "../models/Issue.js";
import { generateIssuePDF } from "../utils/pdfGenerator.js";

export const generatePDF = async (req, res) => {
  const { id } = req.params;

  const issue = await Issue.findById(id);
  if (!issue) return res.status(404).json({ message: "Issue not found" });

  const pdfBuffer = await generateIssuePDF(issue);

  // Send PDF buffer directly (serverless compatible)
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="issue_${id}.pdf"`);
  res.setHeader("Content-Length", pdfBuffer.length);
  res.send(pdfBuffer);
};
