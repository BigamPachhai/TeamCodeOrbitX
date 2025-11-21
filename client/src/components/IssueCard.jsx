import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import { getSessionId } from "../utils/sessionUtils";

export default function IssueCard({ issue }) {
  const [upvoteCount, setUpvoteCount] = useState(issue.upvoteCount || 0);
  const [upvoted, setUpvoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch upvote status when component mounts (works for both authenticated and anonymous users)
  useEffect(() => {
    const fetchUpvoteStatus = async () => {
      try {
        const sessionId = getSessionId();
        const { data } = await api.get(
          `/upvotes/status/${issue._id}?sessionId=${sessionId}`
        );
        setUpvoted(data.upvoted);
        setUpvoteCount(data.upvoteCount);
      } catch (error) {
        console.error("Error fetching upvote status:", error);
      }
    };
    fetchUpvoteStatus();
  }, [issue._id]);

  const handleToggleUpvote = async (e) => {
    e.preventDefault(); // Prevent navigation to details page

    setLoading(true);
    try {
      const sessionId = getSessionId();
      const { data } = await api.post("/upvotes/toggle", {
        issueId: issue._id,
        sessionId: sessionId,
      });
      setUpvoted(data.upvoted);
      setUpvoteCount(data.upvoteCount);
    } catch (error) {
      console.error("Error toggling upvote:", error);
      alert("Failed to upvote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-4">
      <Link to={`/issue/${issue._id}`}>
        <img
          src={issue.image}
          className="w-full h-56 object-cover rounded-lg mb-3"
          alt={issue.category}
        />

        <h2 className="text-xl font-bold text-red-700">{issue.category}</h2>
        <p className="text-gray-700 line-clamp-2">{issue.description}</p>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <p className="text-sm text-blue-800">
              Status: <b className="capitalize">{issue.status}</b>
            </p>
            {issue.status === "resolved" && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                ✅ Resolved
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">{issue.locationName}</p>
        </div>
      </Link>

      {/* Upvote Button */}
      <div className="mt-3 pt-3 border-t border-gray-200">
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
          <span>{upvoted ? "Liked" : "Like"}</span>
        </button>
      </div>
    </div>
  );
}
