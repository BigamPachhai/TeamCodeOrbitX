import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";

export default function UpvoteButton({
  issueId,
  initialCount = 0,
  initialUpvoted = false,
  onUpdate,
}) {
  const [upvoteCount, setUpvoteCount] = useState(initialCount);
  const [upvoted, setUpvoted] = useState(initialUpvoted);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleToggleUpvote = async () => {
    if (!isAuthenticated) {
      alert("Please login to upvote issues");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/upvotes/toggle", { issueId });

      setUpvoted(data.upvoted);
      setUpvoteCount(data.upvoteCount);

      // Callback to parent component if needed
      if (onUpdate) {
        onUpdate(data.upvoteCount, data.upvoted);
      }
    } catch (error) {
      console.error("Error toggling upvote:", error);
      alert("Failed to upvote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleUpvote}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
        upvoted
          ? "bg-red-600 text-white hover:bg-red-700"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span className="text-xl">{upvoted ? "❤️" : "🤍"}</span>
      <span>{upvoteCount}</span>
      <span className="hidden sm:inline">{upvoted ? "Liked" : "Like"}</span>
    </button>
  );
}
