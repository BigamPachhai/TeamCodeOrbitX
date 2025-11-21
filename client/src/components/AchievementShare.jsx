import { useState } from "react";
import { getBadge } from "../utils/badges";
import { 
  Share2, 
  X, 
  Facebook, 
  Twitter, 
  MessageCircle, 
  Linkedin, 
  Copy, 
  Download,
  CheckCircle,
  Award
} from "lucide-react";


export default function AchievementShare({ user, rank, totalUsers }) {
  const [showShareModal, setShowShareModal] = useState(false);

  const achievementText = rank
    ? `Community Contribution: Ranked #${rank} out of ${totalUsers} contributors with ${user.points} service points.`
    : `Community Service: ${user.points} points earned with ${getBadge(user.points)} recognition.`;

  const shareText = `${achievementText}\n\nParticipate in community improvement through our public service portal.\n\n#PublicService #CommunityEngagement`;

  const shareUrl = window.location.origin;

  // Social media share functions
  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Community contribution achievement: ${achievementText}`)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareOnWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const downloadAsImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext("2d");

    // Professional background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1200, 630);

    // Header with government blue
    ctx.fillStyle = "#003865";
    ctx.fillRect(0, 0, 1200, 120);
    
    // Red accent border at bottom of header
    ctx.fillStyle = "#DC143C";
    ctx.fillRect(0, 116, 1200, 4);

    // Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 44px 'Arial', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("COMMUNITY SERVICE RECOGNITION", 600, 65);
    ctx.font = "20px 'Arial', sans-serif";
    ctx.fillText("रुपन्देही जिल्ला | Rupandehi District Administration Office", 600, 95);

    // Achievement content
    ctx.fillStyle = "#003865";
    ctx.font = "bold 38px 'Arial', sans-serif";
    ctx.fillText(user.fullName || "Community Member", 600, 200);

    // Badge
    ctx.fillStyle = "#003865";
    ctx.font = "bold 32px 'Arial', sans-serif";
    ctx.fillText(getBadge(user.points).toUpperCase(), 600, 250);

    // Points display
    ctx.fillStyle = "#003865";
    ctx.font = "bold 72px 'Arial', sans-serif";
    ctx.fillText(`${user.points}`, 600, 340);
    ctx.fillStyle = "#6b7280";
    ctx.font = "28px 'Arial', sans-serif";
    ctx.fillText("Service Points", 600, 375);

    // Rank information
    if (rank) {
      ctx.fillStyle = "#059669";
      ctx.font = "26px 'Arial', sans-serif";
      ctx.fillText(`Position ${rank} of ${totalUsers} Contributors`, 600, 430);
    }

    // Official footer
    ctx.fillStyle = "#6b7280";
    ctx.font = "22px 'Arial', sans-serif";
    ctx.fillText("नेपाल सरकार | Government of Nepal", 600, 500);
    ctx.font = "20px 'Arial', sans-serif";
    ctx.fillText("Rupandehi District Administration Office", 600, 530);
    ctx.font = "18px 'Arial', sans-serif";
    ctx.fillText("Public Grievance Management System", 600, 560);

    // Convert to image and download
    canvas.toBlob(
      (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `service-recognition-${(user.fullName || "user").replace(/\s+/g, "-")}-${Date.now()}.png`;
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
        className="px-4 py-2 bg-[#003865] text-white rounded hover:bg-[#004d8c] transition-colors font-semibold flex items-center gap-2 border border-[#003865] shadow-sm whitespace-nowrap text-sm"
      >
        <Share2 className="w-4 h-4 flex-shrink-0" />
        <span>Share Recognition</span>
      </button>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-200">
            {/* Official Government Header */}
            <div className="bg-[#003865] border-b-4 border-[#DC143C] px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center flex-shrink-0 border border-white/20">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-bold whitespace-nowrap uppercase tracking-wide">Share Service Recognition</h2>
                    <p className="text-blue-100 text-xs mt-0.5">रुपन्देही जिल्ला | Rupandehi District Administration Office</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-white/80 hover:text-white w-8 h-8 flex items-center justify-center rounded hover:bg-white/10 transition-colors border border-white/20"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {/* Recognition Card */}
              <div className="bg-white border-2 border-gray-200 rounded shadow-sm p-6 mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#003865] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#DC143C]">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#003865] mb-2 uppercase tracking-wide">Service Recognition</h3>
                  <p className="text-base text-gray-900 font-semibold mb-4">{user.fullName || "Community Member"}</p>
                  
                  <div className="bg-gray-50 border-2 border-gray-300 rounded p-4 my-4">
                    <p className="text-[#003865] font-bold text-base mb-1 uppercase tracking-wide">
                      {getBadge(user.points)}
                    </p>
                    <p className="text-3xl font-bold text-[#003865]">{user.points}</p>
                    <p className="text-gray-600 text-sm mt-1">Service Points</p>
                  </div>

                  {rank && (
                    <div className="bg-green-50 border-2 border-green-300 rounded p-3">
                      <p className="text-green-800 font-semibold flex items-center justify-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        <span>Position {rank} of {totalUsers} Contributors</span>
                      </p>
                    </div>
                  )}

                  <p className="text-gray-600 mt-4 text-xs border-t border-gray-200 pt-4">
                    नेपाल सरकार | Government of Nepal<br />
                    Rupandehi District Administration Office
                  </p>
                </div>
              </div>

              {/* Share Options */}
              <div className="space-y-4">
                <h4 className="text-base font-bold text-[#003865] mb-3 uppercase tracking-wide border-b border-gray-200 pb-2">Distribution Channels</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={shareOnFacebook}
                    className="flex items-center justify-center gap-2 p-3 bg-[#1877F2] text-white rounded hover:bg-[#166FE5] transition-colors text-sm font-semibold border border-[#166FE5] shadow-sm whitespace-nowrap"
                  >
                    <Facebook className="w-4 h-4 flex-shrink-0" />
                    <span>Facebook</span>
                  </button>

                  <button
                    onClick={shareOnTwitter}
                    className="flex items-center justify-center gap-2 p-3 bg-black text-white rounded hover:bg-gray-800 transition-colors text-sm font-semibold border border-gray-700 shadow-sm whitespace-nowrap"
                  >
                    <Twitter className="w-4 h-4 flex-shrink-0" />
                    <span>Twitter</span>
                  </button>

                  <button
                    onClick={shareOnWhatsApp}
                    className="flex items-center justify-center gap-2 p-3 bg-[#25D366] text-white rounded hover:bg-[#20BD5C] transition-colors text-sm font-semibold border border-[#20BD5C] shadow-sm whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4 flex-shrink-0" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={shareOnLinkedIn}
                    className="flex items-center justify-center gap-2 p-3 bg-[#0A66C2] text-white rounded hover:bg-[#0959AC] transition-colors text-sm font-semibold border border-[#0959AC] shadow-sm whitespace-nowrap"
                  >
                    <Linkedin className="w-4 h-4 flex-shrink-0" />
                    <span>LinkedIn</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center justify-center gap-2 p-3 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors text-sm font-semibold border border-gray-600 shadow-sm whitespace-nowrap"
                  >
                    <Copy className="w-4 h-4 flex-shrink-0" />
                    <span>Copy Text</span>
                  </button>

                  <button
                    onClick={downloadAsImage}
                    className="flex items-center justify-center gap-2 p-3 bg-[#003865] text-white rounded hover:bg-[#004d8c] transition-colors text-sm font-semibold border border-[#003865] shadow-sm whitespace-nowrap"
                  >
                    <Download className="w-4 h-4 flex-shrink-0" />
                    <span>Download Certificate</span>
                  </button>
                </div>
              </div>

              {/* Message Preview */}
              <div className="mt-6 p-4 bg-white border-2 border-gray-200 rounded shadow-sm">
                <p className="text-sm font-bold text-[#003865] mb-2 uppercase tracking-wide">Message Preview</p>
                <div className="bg-gray-50 p-3 rounded border border-gray-300 max-h-24 overflow-y-auto">
                  <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                    {shareText}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t-2 border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-600">
                  Official Public Service Communication | नेपाल सरकार
                </p>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors text-sm font-semibold border border-gray-600 shadow-sm"
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