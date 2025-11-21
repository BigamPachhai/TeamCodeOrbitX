import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { getSessionId } from "../utils/sessionUtils";

export default function IssueDetails() {
  const { id } = useParams();
  const [comment, setComment] = useState("");
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [upvoted, setUpvoted] = useState(false);
  const [loadingUpvote, setLoadingUpvote] = useState(false);
  const { isAuthenticated } = useAuth();

  const {
    data: issue,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["issue", id],
    queryFn: async () => {
      const { data } = await api.get(`/issues/${id}`);
      return data;
    },
  });

  // Fetch upvote status (works for both authenticated and anonymous users)
  useEffect(() => {
    const fetchUpvoteStatus = async () => {
      try {
        const sessionId = getSessionId();
        const { data } = await api.get(
          `/upvotes/status/${id}?sessionId=${sessionId}`
        );
        setUpvoted(data.upvoted);
        setUpvoteCount(data.upvoteCount);
      } catch (error) {
        console.error("Error fetching upvote status:", error);
      }
    };
    fetchUpvoteStatus();
  }, [id]);

  const handleToggleUpvote = async () => {
    setLoadingUpvote(true);
    try {
      const sessionId = getSessionId();
      const { data } = await api.post("/upvotes/toggle", {
        issueId: id,
        sessionId: sessionId,
      });
      setUpvoted(data.upvoted);
      setUpvoteCount(data.upvoteCount);
    } catch (error) {
      console.error("Error toggling upvote:", error);
      alert("Failed to upvote. Please try again.");
    } finally {
      setLoadingUpvote(false);
    }
  };

  const addComment = async () => {
    if (!comment.trim()) return;

    if (!isAuthenticated) {
      alert("Please login to comment");
      return;
    }

    try {
      await api.post("/comments/add", { issueId: id, comment });
      setComment("");
      refetch();
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (!issue) return <p className="text-center mt-10">Issue not found</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 mb-10 bg-white p-6 shadow-lg rounded-lg">
      <img
        src={issue.image}
        className="w-full h-80 object-cover rounded-lg mb-4"
        alt={issue.category}
      />

      <h1 className="text-3xl font-bold text-red-700">{issue.category}</h1>
      <p className="text-gray-800 mt-3">{issue.description}</p>

      <div className="mt-4 text-blue-800">
        <p>
          <strong>Status:</strong> {issue.status}
        </p>
        <p>
          <strong>Location:</strong> {issue.locationName}
        </p>
        <p>
          <strong>Reported By:</strong> {issue.user?.fullName || "Anonymous"}
        </p>
        <p>
          <strong>Reported At:</strong>{" "}
          {new Date(issue.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Upvote Button */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={handleToggleUpvote}
          disabled={loadingUpvote}
          className={`flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all text-lg ${
            upvoted
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          } ${
            loadingUpvote ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <span className="text-2xl">{upvoted ? "❤️" : "🤍"}</span>
          <span className="font-bold">{upvoteCount}</span>
          <span>{upvoted ? "You liked this" : "Like this issue"}</span>
        </button>
      </div>

      <hr className="my-6" />

      <h2 className="text-xl font-bold text-red-700 mb-3">
        💬 Comments ({issue.comments?.length || 0})
      </h2>

      <div className="flex gap-2 mb-4">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              addComment();
            }
          }}
          placeholder="Write a comment... (Press Enter to post)"
          className="flex-1 border-2 border-gray-300 p-3 rounded-lg focus:border-red-500 focus:outline-none resize-none"
          rows="2"
        />
        <button
          onClick={addComment}
          disabled={!comment.trim()}
          className="bg-red-700 text-white px-5 py-2 rounded-lg hover:bg-red-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition h-fit"
        >
          Post
        </button>
      </div>

      <div className="space-y-3">
        {issue.comments?.length > 0 ? (
          issue.comments.map((c) => (
            <div
              key={c._id}
              className="bg-gray-50 p-4 rounded-lg border-l-4 border-red-600 hover:bg-gray-100 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-blue-800">
                  {c.user?.fullName || "Anonymous"}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(c.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="text-gray-700">{c.comment}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">💬 No comments yet.</p>
            <p className="text-gray-400 text-sm mt-1">
              Be the first to comment!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
