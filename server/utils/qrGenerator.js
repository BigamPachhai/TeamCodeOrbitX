/**
 * Generate QR code data URL for issue sharing
 * Note: This is a simple implementation. For production, use a QR code library like 'qrcode'
 */
import QRCode from "qrcode";

/**
 * Generate QR code for issue URL
 */
export const generateIssueQRCode = async (issueId, baseUrl = "http://localhost:3000") => {
  try {
    const issueUrl = `${baseUrl}/issue/${issueId}`;
    
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(issueUrl, {
      errorCorrectionLevel: "M",
      type: "image/png",
      quality: 0.92,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      width: 300,
    });

    return {
      qrCode: qrCodeDataUrl,
      url: issueUrl,
      issueId,
    };
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
};

/**
 * Generate QR code for sharing issue
 */
export const generateQRCodeForSharing = async (data) => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(data, {
      errorCorrectionLevel: "M",
      type: "image/png",
      quality: 0.92,
      margin: 1,
      color: {
        dark: "#1e40af",
        light: "#FFFFFF",
      },
      width: 300,
    });

    return qrCodeDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
};

