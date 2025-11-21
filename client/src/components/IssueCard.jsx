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
      color: "bg-yellow-100 text-yellow-800 border-yellow-300",
      label: "Under Review",
    },
    "in-progress": {
      color: "bg-blue-100 text-blue-800 border-blue-300",
      label: "In Progress",
    },
    resolved: {
      color: "bg-green-100 text-green-800 border-green-300",
      label: "Resolved",
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
    <div className="bg-white border border-gray-200 shadow-sm hover:shadow transition-all duration-200 overflow-hidden h-full flex flex-col">
      {/* Image Section */}
      <Link to={`/issue/${issue._id}`} className="block flex-shrink-0">
        <div className="relative group">
          <img
            src={issue.image}
            className="w-full h-52 object-cover"
            alt={issue.category}
          />
          <div className="absolute top-3 right-3">
            <span
              className={`px-3 py-1.5 rounded text-xs font-semibold border shadow-sm ${status.color}`}
            >
              {status.label}
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
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handleToggleUpvote}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded border font-semibold transition-colors shrink-0 text-sm ${
                upvoted
                  ? "bg-red-50 text-red-700 border-red-300 hover:bg-red-100"
                  : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
              } ${
                loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${
                  upvoted ? "text-red-600 fill-red-600" : "text-gray-400"
                }`}
              />
              <span className="font-semibold min-w-5 text-center">
                {upvoteCount}
              </span>
              <span className="text-xs whitespace-nowrap hidden sm:inline">
                {upvoted ? "Supported" : "Support"}
              </span>
            </button>

            <Link
              to={`/issue/${issue._id}`}
              className="px-5 py-2 bg-[#003865] text-white rounded border border-[#003865] font-semibold hover:bg-[#002D4F] transition-colors text-sm whitespace-nowrap shrink-0 text-center"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
