import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import { getSessionId } from "../utils/sessionUtils";
import { useToast } from "./Toast";
import { Heart, MapPin } from "lucide-react";

export default function IssueCard({ issue }) {
  const [upvoteCount, setUpvoteCount] = useState(issue.upvoteCount || 0);
  const [upvoted, setUpvoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { error } = useToast();

  // Status configuration
  const statusConfig = {
    pending: {
      color: "bg-orange-100 text-orange-800 border-orange-200",
      label: "Under Review",
      icon: "🕒",
    },
    "in-progress": {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      label: "In Progress",
      icon: "🚧",
    },
    resolved: {
      color: "bg-green-100 text-green-800 border-green-200",
      label: "Resolved",
      icon: "✅",
    },
  };

  const status = statusConfig[issue.status] || statusConfig.pending;

  // Fetch upvote status when component mounts
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
    e.preventDefault();
    setLoading(true);
    try {
      const sessionId = getSessionId();
      const { data } = await api.post("/upvotes/toggle", {
        issueId: issue._id,
        sessionId: sessionId,
      });
      setUpvoted(data.upvoted);
      setUpvoteCount(data.upvoteCount);
    } catch (err) {
      console.error("Error toggling upvote:", err);
      error("Failed to upvote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-purple-100 hover:shadow-2xl hover:border-purple-300 transition-all duration-300 overflow-hidden h-full flex flex-col transform hover:-translate-y-2 hover:scale-[1.02]">
      {/* Image Section */}
      <Link to={`/issue/${issue._id}`} className="block flex-shrink-0">
        <div className="relative group">
          <img
            src={issue.image}
            className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
            alt={issue.category}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-4 right-4">
            <span
              className={`px-4 py-2 rounded-xl text-sm font-bold border-2 shadow-lg backdrop-blur-sm ${status.color}`}
            >
              {status.icon} {status.label}
            </span>
          </div>
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-6 flex-grow flex flex-col">
        <Link to={`/issue/${issue._id}`} className="flex-grow block">
          {/* Category and Date */}
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-900 capitalize leading-tight flex-1 pr-2">
              {issue.category}
            </h2>
            <span className="text-sm text-gray-500 whitespace-nowrap flex-shrink-0">
              {formatDate(issue.createdAt)}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-700 line-clamp-3 leading-relaxed mb-4">
            {issue.description}
          </p>

          {/* Location */}
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{issue.locationName}</span>
          </div>
        </Link>

        {/* Action Section */}
        <div className="mt-auto pt-5 border-t-2 border-purple-100">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handleToggleUpvote}
              disabled={loading}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all shrink-0 border-2 shadow-lg transform hover:scale-105 ${
                upvoted
                  ? "bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border-red-300 hover:from-red-100 hover:to-pink-100"
                  : "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-300 hover:from-gray-100 hover:to-gray-200"
              } ${
                loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${
                  upvoted ? "text-red-600 fill-red-600" : "text-gray-400"
                }`}
              />
              <span className="font-bold min-w-5 text-center text-lg">
                {upvoteCount}
              </span>
              <span className="text-sm whitespace-nowrap hidden sm:inline">
                {upvoted ? "💖 Supported" : "🤝 Support"}
              </span>
            </button>

            <Link
              to={`/issue/${issue._id}`}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all text-sm whitespace-nowrap shrink-0 text-center border-2 border-purple-400 shadow-xl transform hover:scale-105"
            >
              👁️ View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
