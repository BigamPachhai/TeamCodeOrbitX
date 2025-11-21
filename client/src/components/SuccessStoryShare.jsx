import { useState } from "react";
import { getImageUrl } from "../utils/imageUtils";

export default function SuccessStoryShare({ issue, beforeAfter }) {
  const [showShareModal, setShowShareModal] = useState(false);

  const successText = `🎉 Success Story! 🎉

The issue "${issue.category}" at ${issue.locationName} has been resolved!

Before: The problem was reported and needed attention.
After: The department has completed the work and uploaded completion photos.

This is what community engagement looks like! Together we're making our city better. 💪

#CommunitySuccess #CivicEngagement #CityImprovements`;

  const shareUrl = `${window.location.origin}/issue/${issue._id}`;

  // Social media share functions
  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(successText)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(successText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareOnWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(successText + " " + shareUrl)}`;
    window.open(url, "_blank");
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(successText + "\n\n" + shareUrl);
      alert("Success story copied to clipboard! 📋");
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Failed to copy. Please try again.");
    }
  };

  const downloadAsImage = () => {
    // Create a canvas element to generate the image
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1200, 800);
    gradient.addColorStop(0, "#10b981");
    gradient.addColorStop(0.5, "#3b82f6");
    gradient.addColorStop(1, "#8b5cf6");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 800);

    // Add decorative elements
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.beginPath();
    ctx.arc(100, 100, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(1100, 700, 100, 0, Math.PI * 2);
    ctx.fill();

    // Title
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 64px 'Arial', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🎉 Success Story! 🎉", 600, 100);

    // Issue category
    ctx.font = "bold 48px 'Arial', sans-serif";
    ctx.fillText(issue.category, 600, 180);

    // Location
    ctx.font = "36px 'Arial', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillText(`📍 ${issue.locationName}`, 600, 230);

    // Before/After labels
    ctx.font = "bold 32px 'Arial', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Before", 300, 320);
    ctx.fillText("After", 900, 320);

    // Draw placeholder boxes for images
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 4;
    ctx.strokeRect(100, 350, 400, 300);
    ctx.strokeRect(700, 350, 400, 300);

    // Success message
    ctx.font = "bold 40px 'Arial', sans-serif";
    ctx.fillText("✅ Issue Resolved!", 600, 700);

    // Footer
    ctx.font = "28px 'Arial', sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillText("Making Our Community Better Together", 600, 760);

    // Convert to image and download
    canvas.toBlob(
      (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `success-story-${issue.category.replace(/\s+/g, "-")}-${Date.now()}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        setShowShareModal(false);
      },
      "image/png",
      1.0
    );
  };

  return (
    <>
      <button
        onClick={() => setShowShareModal(true)}
        className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition font-semibold flex items-center gap-2 shadow-lg"
      >
        <span>🎉</span>
        Share Success Story
      </button>

      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>

            {/* Success Story Card Design */}
            <div className="bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 rounded-xl p-8 text-white mb-6 shadow-xl">
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-4xl font-bold mb-2">Success Story!</h2>
                <h3 className="text-3xl font-bold mb-4">{issue.category}</h3>
                <p className="text-xl mb-6">📍 {issue.locationName}</p>

                {/* Before/After Comparison */}
                {beforeAfter && beforeAfter.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                      <p className="text-lg font-semibold mb-2">📷 Before</p>
                      <img
                        src={getImageUrl(beforeAfter[0].beforeImage)}
                        alt="Before"
                        className="w-full h-48 object-cover rounded-lg shadow-lg"
                      />
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                      <p className="text-lg font-semibold mb-2">✨ After</p>
                      <img
                        src={getImageUrl(beforeAfter[0].afterImage)}
                        alt="After"
                        className="w-full h-48 object-cover rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                )}

                <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                  <p className="text-2xl font-bold">✅ Issue Resolved!</p>
                  <p className="text-lg mt-2 opacity-90">
                    The department has completed the work
                  </p>
                </div>
              </div>
            </div>

            {/* Share Options */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Share This Success Story
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={shareOnFacebook}
                  className="flex flex-col items-center justify-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                >
                  <span className="text-3xl mb-2">📘</span>
                  <span className="text-sm font-semibold">Facebook</span>
                </button>

                <button
                  onClick={shareOnTwitter}
                  className="flex flex-col items-center justify-center p-4 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition shadow-md"
                >
                  <span className="text-3xl mb-2">🐦</span>
                  <span className="text-sm font-semibold">Twitter</span>
                </button>

                <button
                  onClick={shareOnWhatsApp}
                  className="flex flex-col items-center justify-center p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow-md"
                >
                  <span className="text-3xl mb-2">💬</span>
                  <span className="text-sm font-semibold">WhatsApp</span>
                </button>

                <button
                  onClick={shareOnLinkedIn}
                  className="flex flex-col items-center justify-center p-4 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition shadow-md"
                >
                  <span className="text-3xl mb-2">💼</span>
                  <span className="text-sm font-semibold">LinkedIn</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center justify-center gap-2 p-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition shadow-md"
                >
                  <span className="text-2xl">📋</span>
                  <span className="font-semibold">Copy Text</span>
                </button>

                <button
                  onClick={downloadAsImage}
                  className="flex items-center justify-center gap-2 p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-md"
                >
                  <span className="text-2xl">🖼️</span>
                  <span className="font-semibold">Download Image</span>
                </button>
              </div>
            </div>

            {/* Preview Text */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-2">Preview:</p>
              <p className="text-sm text-gray-600 italic whitespace-pre-line">{successText}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

