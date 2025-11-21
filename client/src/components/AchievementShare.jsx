import { useState } from "react";
import { getBadge } from "../utils/badges";

export default function AchievementShare({ user, rank, totalUsers }) {
  const [showShareModal, setShowShareModal] = useState(false);

  const achievementText = rank
    ? `I'm ranked #${rank} out of ${totalUsers} contributors with ${user.points} points! 🏆`
    : `I have ${user.points} points and earned the ${getBadge(user.points)} badge! 🎉`;

  const shareText = `${achievementText}\n\nJoin me in making our community better by reporting issues!\n\n#CommunityService #CivicEngagement`;

  const shareUrl = window.location.origin;

  // Social media share functions
  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareOnWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
    window.open(url, "_blank");
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText + "\n\n" + shareUrl);
      alert("Achievement copied to clipboard! 📋");
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Failed to copy. Please try again.");
    }
  };

  const downloadAsImage = () => {
    // Create a canvas element to generate the image
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext("2d");

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, "#1e40af");
    gradient.addColorStop(0.5, "#7c3aed");
    gradient.addColorStop(1, "#ec4899");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Add decorative circles
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.beginPath();
    ctx.arc(100, 100, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(1100, 530, 100, 0, Math.PI * 2);
    ctx.fill();

    // Title with shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 56px 'Arial', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🏆 Achievement Unlocked! 🏆", 600, 120);

    // User name
    ctx.font = "bold 72px 'Arial', sans-serif";
    ctx.fillText(user.fullName || "Contributor", 600, 240);

    // Badge with background
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.fillRect(400, 280, 400, 80);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 52px 'Arial', sans-serif";
    ctx.fillText(getBadge(user.points), 600, 340);

    // Points with large display
    ctx.font = "bold 96px 'Arial', sans-serif";
    ctx.fillText(`${user.points}`, 600, 450);
    ctx.font = "48px 'Arial', sans-serif";
    ctx.fillText("Points", 600, 500);

    // Rank (if available)
    if (rank) {
      ctx.font = "bold 40px 'Arial', sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fillText(`Ranked #${rank} out of ${totalUsers} contributors`, 600, 550);
    }

    // Footer
    ctx.font = "32px 'Arial', sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillText("Making Our Community Better Together", 600, 600);

    // Convert to image and download
    canvas.toBlob(
      (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `achievement-${(user.fullName || "user").replace(/\s+/g, "-")}-${Date.now()}.png`;
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
        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold flex items-center gap-2 shadow-lg"
      >
        <span>📤</span>
        Share Achievement
      </button>

      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative">
            {/* Close button */}
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>

            {/* Achievement Card Design */}
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl p-8 text-white mb-6 shadow-xl">
              <div className="text-center">
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-3xl font-bold mb-2">Achievement Unlocked!</h2>
                <h3 className="text-4xl font-bold mb-4">{user.fullName || "Contributor"}</h3>
                
                <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4 backdrop-blur-sm">
                  <p className="text-2xl font-semibold mb-2">{getBadge(user.points)}</p>
                  <p className="text-5xl font-bold">{user.points}</p>
                  <p className="text-lg opacity-90">Points</p>
                </div>

                {rank && (
                  <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
                    <p className="text-xl font-semibold">
                      Ranked #{rank} out of {totalUsers} contributors
                    </p>
                  </div>
                )}

                <p className="text-lg mt-4 opacity-90">
                  Making Our Community Better Together
                </p>
              </div>
            </div>

            {/* Share Options */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Share Your Achievement
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
              <p className="text-sm text-gray-600 italic">{shareText}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

