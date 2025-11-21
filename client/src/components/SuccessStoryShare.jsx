import { useState } from "react";
import { getImageUrl } from "../utils/imageUtils";
import { useToast } from "./Toast";
import { Share2, X, Facebook, Twitter, MessageCircle, Linkedin, Copy, Download, CheckCircle, MapPin } from "lucide-react";

export default function SuccessStoryShare({ issue, beforeAfter }) {
  const [showShareModal, setShowShareModal] = useState(false);
  const { success, error } = useToast();

  const successText = `Community Issue Resolved Successfully

The "${issue.category}" issue at ${issue.locationName} has been successfully addressed by our local authorities.

Location: ${issue.locationName}
Category: ${issue.category}
Status: Resolved ✅

This successful resolution demonstrates the effectiveness of community-government collaboration in addressing local concerns.

View the complete details and progress photos at: ${window.location.origin}/issue/${issue._id}

#CommunitySuccess #LocalGovernment #PublicService`;

  const shareUrl = `${window.location.origin}/issue/${issue._id}`;

  // Social media share functions
  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `Community issue resolved: "${issue.category}" at ${issue.locationName}. See the progress: ${shareUrl}`
    )}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareOnWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(successText)}`;
    window.open(url, "_blank");
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(successText);
      success("Success story copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      error("Failed to copy. Please try again.");
    }
  };

  const downloadAsImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");

    // Professional background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1200, 800);

    // Header with government-style gradient
    const headerGradient = ctx.createLinearGradient(0, 0, 1200, 0);
    headerGradient.addColorStop(0, "#1e40af");
    headerGradient.addColorStop(1, "#dc2626");
    ctx.fillStyle = headerGradient;
    ctx.fillRect(0, 0, 1200, 120);

    // Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 48px 'Arial', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Community Issue Resolved", 600, 70);

    // Success badge
    ctx.fillStyle = "#059669";
    ctx.beginPath();
    ctx.arc(600, 200, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px 'Arial', sans-serif";
    ctx.fillText("✓", 600, 210);

    // Issue details
    ctx.fillStyle = "#1f2937";
    ctx.font = "bold 36px 'Arial', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(issue.category, 600, 300);

    ctx.fillStyle = "#4b5563";
    ctx.font = "28px 'Arial', sans-serif";
    ctx.fillText(`📍 ${issue.locationName}`, 600, 340);

    // Before/After section
    if (beforeAfter && beforeAfter.length > 0) {
      ctx.fillStyle = "#374151";
      ctx.font = "bold 32px 'Arial', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("Before", 150, 400);
      ctx.fillText("After", 650, 400);

      // Placeholder boxes for images
      ctx.strokeStyle = "#d1d5db";
      ctx.lineWidth = 2;
      ctx.strokeRect(100, 420, 400, 250);
      ctx.strokeRect(700, 420, 400, 250);

      // Placeholder text
      ctx.fillStyle = "#9ca3af";
      ctx.font = "24px 'Arial', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Progress Photos Available", 300, 550);
      ctx.fillText("Progress Photos Available", 900, 550);
    }

    // Footer message
    ctx.fillStyle = "#1f2937";
    ctx.font = "bold 28px 'Arial', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Successfully Addressed by Local Authorities", 600, 650);

    ctx.fillStyle = "#6b7280";
    ctx.font = "20px 'Arial', sans-serif";
    ctx.fillText("Community - Government Collaboration", 600, 690);

    ctx.fillStyle = "#dc2626";
    ctx.font = "16px 'Arial', sans-serif";
    ctx.fillText("Public Service Portal", 600, 720);

    // Convert to image and download
    canvas.toBlob(
      (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `community-success-${issue.category.replace(
          /\s+/g,
          "-"
        )}-${Date.now()}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      },
      "image/png",
      1.0
    );
  };

  return (
    <>
      <button
        onClick={() => setShowShareModal(true)}
        className="px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-lg hover:from-blue-800 hover:to-blue-900 transition-all duration-300 font-semibold flex items-center gap-3 shadow-md border border-blue-600 whitespace-nowrap"
      >
        <Share2 className="w-5 h-5 flex-shrink-0" />
        <span>Share Success Story</span>
      </button>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-red-600 px-8 py-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Share2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold whitespace-nowrap">Share Success Story</h2>
                    <p className="text-blue-100 text-sm">
                      Spread the word about this community achievement
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-white/80 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
              {/* Success Preview Card */}
              <div className="bg-gradient-to-br from-blue-50 to-red-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl text-white">✓</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Issue Resolved
                  </h3>
                  <p className="text-lg text-gray-700 capitalize">
                    {issue.category}
                  </p>
                  <p className="text-gray-600 flex items-center justify-center gap-2 mt-2">
                    <MapPin className="w-4 h-4" />
                    {issue.locationName}
                  </p>
                </div>

                {/* Before/After Comparison */}
                {beforeAfter && beforeAfter.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                      <p className="text-sm font-semibold text-gray-700 mb-3 text-center uppercase tracking-wide">
                        Initial Condition
                      </p>
                      <img
                        src={getImageUrl(beforeAfter[0].beforeImage)}
                        alt="Initial condition"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                      <p className="text-sm font-semibold text-gray-700 mb-3 text-center uppercase tracking-wide">
                        After Resolution
                      </p>
                      <img
                        src={getImageUrl(beforeAfter[0].afterImage)}
                        alt="After resolution"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                )}

                <div className="bg-white/80 rounded-lg p-4 border border-green-200 text-center">
                  <p className="text-green-800 font-semibold text-sm">
                    ✅ Successfully addressed by local authorities
                  </p>
                </div>
              </div>

              {/* Share Options */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                    Share This Achievement
                  </h4>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                      onClick={shareOnFacebook}
                      className="flex flex-col items-center justify-center p-4 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition-all duration-300 shadow-sm border border-[#166FE5]"
                    >
                      <Facebook className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">Facebook</span>
                    </button>

                    <button
                      onClick={shareOnTwitter}
                      className="flex flex-col items-center justify-center p-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-sm border border-gray-700"
                    >
                      <Twitter className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">Twitter</span>
                    </button>

                    <button
                      onClick={shareOnWhatsApp}
                      className="flex flex-col items-center justify-center p-4 bg-[#25D366] text-white rounded-lg hover:bg-[#20BD5C] transition-all duration-300 shadow-sm border border-[#20BD5C]"
                    >
                      <MessageCircle className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">WhatsApp</span>
                    </button>

                    <button
                      onClick={shareOnLinkedIn}
                      className="flex flex-col items-center justify-center p-4 bg-[#0A66C2] text-white rounded-lg hover:bg-[#0959AC] transition-all duration-300 shadow-sm border border-[#0959AC]"
                    >
                      <Linkedin className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">LinkedIn</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center justify-center gap-3 p-4 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-sm border border-gray-600 whitespace-nowrap"
                  >
                    <Copy className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">Copy Text</span>
                  </button>

                  <button
                    onClick={downloadAsImage}
                    className="flex items-center justify-center gap-3 p-4 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-all duration-300 shadow-sm border border-blue-600 whitespace-nowrap"
                  >
                    <Download className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">Download Image</span>
                  </button>
                </div>
              </div>

              {/* Preview Text */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Message Preview:
                </p>
                <div className="bg-white p-4 rounded border border-gray-300">
                  <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                    {successText}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-8 py-4 bg-gray-50">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium border border-gray-600 shadow-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
