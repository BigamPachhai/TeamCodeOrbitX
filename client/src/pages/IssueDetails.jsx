import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { useState, useEffect } from "react";
import { getSessionId } from "../utils/sessionUtils";
import { getImageUrl } from "../utils/imageUtils";
import SuccessStoryShare from "../components/SuccessStoryShare";
import useAuth from "../hooks/useAuth";

export default function IssueDetails() {
  const { id } = useParams();
  const [comment, setComment] = useState("");
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [upvoted, setUpvoted] = useState(false);
  const [loadingUpvote, setLoadingUpvote] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();

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

  // Fetch before/after photos
  const { data: beforeAfter } = useQuery({
    queryKey: ["before-after", id],
    queryFn: async () => {
      try {
        const { data } = await api.get(`/issues/${id}/before-after`);
        return data;
      } catch (error) {
        return [];
      }
    },
    enabled: !!issue && issue.status === "resolved",
  });

  // Fetch user's review
  const { data: userReview } = useQuery({
    queryKey: ["user-review", id],
    queryFn: async () => {
      try {
        const { data } = await api.get(`/reviews/${id}/user`);
        if (data) {
          setReviewRating(data.rating);
          setReviewComment(data.comment || "");
        }
        return data;
      } catch (error) {
        return null;
      }
    },
    enabled: !!issue && issue.status === "resolved" && isAuthenticated,
  });

  // Fetch all reviews
  const { data: reviews } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      try {
        const { data } = await api.get(`/reviews/issue/${id}`);
        return data;
      } catch (error) {
        return [];
      }
    },
    enabled: !!issue && issue.status === "resolved",
  });

  const submitReview = async () => {
    if (!isAuthenticated) {
      alert("Please login to submit a review");
      return;
    }

    if (reviewRating < 1 || reviewRating > 5) {
      alert("Please select a rating");
      return;
    }

    setSubmittingReview(true);
    try {
      await api.post(`/reviews/${id}`, {
        rating: reviewRating,
        comment: reviewComment,
      });
      queryClient.invalidateQueries({ queryKey: ["user-review", id] });
      queryClient.invalidateQueries({ queryKey: ["reviews", id] });
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

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
          <strong>Reported By:</strong>{" "}
          {issue.isAnonymous ? (
            <span className="text-gray-600 italic">🔒 Anonymous</span>
          ) : (
            issue.user?.fullName || "Unknown"
          )}
        </p>
        <p>
          <strong>Reported At:</strong>{" "}
          {new Date(issue.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Success Story Section - Show if resolved with before/after photos */}
      {issue.status === "resolved" && beforeAfter && beforeAfter.length > 0 && (
        <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-300 shadow-lg">
          <div className="text-center mb-4">
            <div className="text-5xl mb-2">🎉</div>
            <h2 className="text-2xl font-bold text-green-800 mb-1">
              Success Story!
            </h2>
            <p className="text-green-700">
              This issue has been resolved! See the before and after comparison below.
            </p>
          </div>

          {/* Before/After Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {beforeAfter.map((photo, index) => (
              <div key={photo._id || index} className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <p className="font-semibold text-gray-700 mb-2 text-center">
                    📷 Before
                  </p>
                  <img
                    src={getImageUrl(photo.beforeImage)}
                    alt="Before"
                    className="w-full h-64 object-cover rounded-lg shadow"
                  />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <p className="font-semibold text-gray-700 mb-2 text-center">
                    ✨ After
                  </p>
                  <img
                    src={getImageUrl(photo.afterImage)}
                    alt="After"
                    className="w-full h-64 object-cover rounded-lg shadow"
                  />
                </div>
                {photo.createdAt && (
                  <p className="text-xs text-gray-500 text-center">
                    Completed on {new Date(photo.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Share Success Story Button */}
          <div className="text-center">
            <SuccessStoryShare issue={issue} beforeAfter={beforeAfter} />
          </div>
        </div>
      )}

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

      {/* Review Section - Only for resolved issues */}
      {issue.status === "resolved" && isAuthenticated && (
        <div className="mt-6 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
          <h2 className="text-xl font-bold text-yellow-800 mb-4">
            ⭐ Leave a Review
          </h2>
          <p className="text-sm text-yellow-700 mb-4">
            Help us improve by rating how well this issue was resolved.
          </p>

          {/* Rating Stars */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Rating *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className={`text-4xl transition ${
                    reviewRating >= star
                      ? "text-yellow-400"
                      : "text-gray-300 hover:text-yellow-300"
                  }`}
                >
                  ⭐
                </button>
              ))}
            </div>
            {reviewRating > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {reviewRating === 5 && "Excellent! 🌟"}
                {reviewRating === 4 && "Very Good! 👍"}
                {reviewRating === 3 && "Good! 😊"}
                {reviewRating === 2 && "Fair ⚠️"}
                {reviewRating === 1 && "Poor 😞"}
              </p>
            )}
          </div>

          {/* Review Comment */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Comment (Optional)
            </label>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Share your thoughts about how the issue was resolved..."
              className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-yellow-500 focus:outline-none resize-none"
              rows="3"
            />
          </div>

          <button
            onClick={submitReview}
            disabled={submittingReview || reviewRating < 1}
            className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold"
          >
            {submittingReview ? "Submitting..." : userReview ? "Update Review" : "Submit Review"}
          </button>
        </div>
      )}

      {/* Display Reviews */}
      {issue.status === "resolved" && reviews && reviews.length > 0 && (
        <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            ⭐ Reviews ({reviews.length})
          </h2>
          <div className="space-y-3">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white p-4 rounded-lg border-l-4 border-yellow-500"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800">
                      {review.user?.fullName || "Anonymous"}
                    </p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={review.rating >= star ? "text-yellow-400" : "text-gray-300"}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {review.comment && (
                  <p className="text-gray-700 text-sm">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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
