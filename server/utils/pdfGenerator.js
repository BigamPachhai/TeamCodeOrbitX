import PDFDocument from "pdfkit";
import fs from "fs";

export const generateIssuePDF = async (issue) => {
  const doc = new PDFDocument();
  const path = `./uploads/issue_${issue._id}.pdf`;

  doc.pipe(fs.createWriteStream(path));

  doc
    .fontSize(22)
    .text("Government of Nepal - Issue Report", { underline: true });
  doc.moveDown();
  doc.fontSize(14).text(`Category: ${issue.category}`);
  doc.text(`Location: ${issue.locationName}`);
  doc.text(`Description: ${issue.description}`);
  doc.text(`Status: ${issue.status}`);
  doc.text(`Date: ${issue.createdAt}`);
  doc.end();

  return path;
};
