import PDFDocument from "pdfkit";
import { Writable } from "stream";

export const generateIssuePDF = async (issue, baseUrl = "http://localhost:3000") => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    // Use memory buffer instead of filesystem for serverless compatibility
    const chunks = [];
    
    const stream = new Writable({
      write(chunk, encoding, callback) {
        chunks.push(chunk);
        callback();
      },
    });

    stream.on("finish", () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer);
    });

    stream.on("error", reject);
    doc.on("error", reject);

    doc.pipe(stream);

    // Header
    doc
      .fontSize(24)
      .fillColor("#1e40af")
      .text("🏛️ Government of Nepal", 50, 50)
      .fontSize(18)
      .fillColor("#000000")
      .text("Public Issue Report", 50, 85)
      .moveDown();

    // Horizontal line
    doc
      .strokeColor("#1e40af")
      .lineWidth(2)
      .moveTo(50, 120)
      .lineTo(550, 120)
      .stroke();

    // Issue Details Section
    let yPos = 150;

    doc
      .fontSize(16)
      .fillColor("#1e40af")
      .text("Issue Details", 50, yPos)
      .fontSize(12)
      .fillColor("#000000");

    yPos += 30;

    // Category
    doc
      .fontSize(12)
      .fillColor("#666666")
      .text("Category:", 70, yPos)
      .fillColor("#000000")
      .fontSize(12)
      .text(issue.category || "Not specified", 150, yPos);
    yPos += 25;

    // Status
    const statusColor = issue.status === "resolved" ? "#059669" : 
                       issue.status === "in-progress" ? "#d97706" : "#dc2626";
    doc
      .fillColor("#666666")
      .text("Status:", 70, yPos)
      .fillColor(statusColor)
      .text((issue.status || "pending").toUpperCase(), 150, yPos);
    yPos += 25;

    // Location
    doc
      .fillColor("#666666")
      .text("Location:", 70, yPos)
      .fillColor("#000000")
      .text(issue.locationName || "Not specified", 150, yPos);
    yPos += 25;

    // Coordinates
    if (issue.lat && issue.lng) {
      doc
        .fillColor("#666666")
        .text("Coordinates:", 70, yPos)
        .fillColor("#000000")
        .text(`${issue.lat}, ${issue.lng}`, 150, yPos);
      yPos += 25;
    }

    // Date
    const reportDate = new Date(issue.createdAt || Date.now()).toLocaleDateString();
    doc
      .fillColor("#666666")
      .text("Reported Date:", 70, yPos)
      .fillColor("#000000")
      .text(reportDate, 150, yPos);
    yPos += 40;

    // Description Section
    doc
      .fontSize(16)
      .fillColor("#1e40af")
      .text("Description", 50, yPos);
    yPos += 30;

    doc
      .fontSize(11)
      .fillColor("#000000")
      .text(issue.description || issue.aiDescription || "No description provided", {
        width: 500,
        align: "left",
      });

    yPos = doc.y + 40;

    // Footer
    doc
      .fontSize(10)
      .fillColor("#666666")
      .text(`Issue ID: ${issue._id}`, 50, yPos)
      .text(`Generated on: ${new Date().toLocaleString()}`, 50, yPos + 15)
      .text(`Report this issue at: ${baseUrl}/issue/${issue._id}`, 50, yPos + 30);

    doc.end();
  });
};
