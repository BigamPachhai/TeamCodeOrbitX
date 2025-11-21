import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { useState, useEffect } from "react";
import { getSessionId } from "../utils/sessionUtils";
import { getImageUrl } from "../utils/imageUtils";
import SuccessStoryShare from "../components/SuccessStoryShare";
import useAuth from "../hooks/useAuth";
import { useToast } from "../components/Toast";
import { MapPin, Heart, Clock, CheckCircle2, AlertCircle, Star, MessageCircle, X } from "lucide-react";

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
  const { success, error, warning } = useToast();

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
      warning("Please login to submit a review");
      return;
    }

    if (reviewRating < 1 || reviewRating > 5) {
      warning("Please select a rating");
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
      success("Review submitted successfully!");
    } catch (err) {
      console.error("Error submitting review:", err);
      error("Failed to submit review. Please try again.");
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
    } catch (err) {
      console.error("Error toggling upvote:", err);
      error("Failed to upvote. Please try again.");
    } finally {
      setLoadingUpvote(false);
    }
  };

  const addComment = async () => {
    if (!comment.trim()) return;

    if (!isAuthenticated) {
      warning("Please login to comment");
      return;
    }

    try {
      await api.post("/comments/add", { issueId: id, comment });
      setComment("");
      refetch();
      success("Comment added successfully!");
    } catch (err) {
      console.error("Error adding comment:", err);
      error("Failed to add comment. Please try again.");
    }
  };

  // Status configuration
  const statusConfig = {
    pending: {
      color: "bg-orange-100 text-orange-800 border-orange-300",
      label: "Under Review",
      icon: <Clock className="w-4 h-4" />,
    },
    "in-progress": {
      color: "bg-blue-100 text-blue-800 border-blue-300",
      label: "In Progress",
      icon: <AlertCircle className="w-4 h-4" />,
    },
    resolved: {
      color: "bg-green-100 text-green-800 border-green-300",
      label: "Resolved",
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
  };

  const status = statusConfig[issue?.status] || statusConfig.pending;

  if (isLoading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border-2 border-purple-200">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
          <p className="mt-6 text-gray-700 text-xl font-semibold">
            ✨ Loading issue details...
          </p>
        </div>
      </div>
    );

  if (!issue)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center bg-white/90 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border-2 border-red-200 max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Issue Not Found
          </h2>
          <p className="text-gray-600 text-lg">
            The requested issue could not be found.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-purple-200 overflow-hidden">
          {/* Issue Image */}
          <div className="relative group">
            <img
              src={issue.image}
              className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105"
              alt={issue.category}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-6 right-6">
              <span
                className={`px-5 py-3 rounded-xl text-sm font-bold border-2 shadow-xl backdrop-blur-sm flex items-center gap-2 ${status.color}`}
              >
                {status.icon}
                {status.label}
              </span>
            </div>
          </div>

          {/* Issue Details */}
          <div className="p-8 md:p-10">
            {/* Header Section */}
            <div className="border-b-2 border-purple-200 pb-8 mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent capitalize mb-4">
                📋 {issue.category}
              </h1>
              <p className="text-gray-700 text-xl leading-relaxed font-medium">
                {issue.description}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
                  <label className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </label>
                  <p className="text-gray-900 font-bold text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    {issue.locationName}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6 shadow-lg">
                  <label className="text-sm font-bold text-purple-600 uppercase tracking-wide mb-3">
                    👤 Reported By
                  </label>
                  <p className="text-gray-900 font-bold text-lg mt-1">
                    {issue.isAnonymous ? (
                      <span className="flex items-center gap-2 text-gray-600">
                        <span>🔒</span>
                        Anonymous Reporter
                      </span>
                    ) : (
                      issue.user?.fullName || "Unknown"
                    )}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg">
                  <label className="text-sm font-bold text-green-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Reported Date
                  </label>
                  <p className="text-gray-900 font-bold text-lg mt-1">
                    {new Date(issue.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-6 shadow-lg">
                  <label className="text-sm font-bold text-orange-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Community Support
                  </label>
                  <p className="text-gray-900 font-bold text-lg mt-1 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    {upvoteCount} {upvoteCount === 1 ? "person" : "people"}{" "}
                    support this issue
                  </p>
                </div>
              </div>
            </div>

            {/* Support Button */}
            <div className="flex justify-center mb-8">
              <button
                onClick={handleToggleUpvote}
                disabled={loadingUpvote}
                className={`flex items-center gap-3 px-8 py-3 rounded-lg font-semibold transition-all border shadow-sm ${
                  upvoted
                    ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                } ${
                  loadingUpvote
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <Heart className={`w-5 h-5 ${upvoted ? "text-red-600 fill-red-600" : "text-gray-400"}`} />
                <span className="font-bold">{upvoteCount}</span>
                <span>{upvoted ? "Supported" : "Support This Issue"}</span>
              </button>
            </div>

            {/* Success Story Section */}
            {issue.status === "resolved" &&
              beforeAfter &&
              beforeAfter.length > 0 && (
                <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">✅</span>
                    </div>
                    <h2 className="text-2xl font-bold text-green-900 mb-2">
                      Issue Resolved Successfully
                    </h2>
                    <p className="text-green-700">
                      This community issue has been successfully addressed.
                    </p>
                  </div>

                  {/* Before/After Comparison - Side by Side */}
                  <div className="space-y-6">
                    {beforeAfter.map((photo, index) => (
                      <div
                        key={photo._id || index}
                        className="bg-white rounded-lg border border-gray-200 p-6"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Before Photo */}
                          <div className="text-center">
                            <p className="font-semibold text-gray-700 mb-4 text-lg uppercase tracking-wide border-b border-gray-200 pb-2">
                              Initial Condition
                            </p>
                            <img
                              src={getImageUrl(photo.beforeImage)}
                              alt="Before resolution"
                              className="w-full h-64 object-cover rounded-lg shadow-sm"
                            />
                            {photo.createdAt && (
                              <p className="text-xs text-gray-500 mt-2">
                                Reported on{" "}
                                {new Date(photo.createdAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>

                          {/* After Photo */}
                          <div className="text-center">
                            <p className="font-semibold text-gray-700 mb-4 text-lg uppercase tracking-wide border-b border-gray-200 pb-2">
                              After Resolution
                            </p>
                            <img
                              src={getImageUrl(photo.afterImage)}
                              alt="After resolution"
                              className="w-full h-64 object-cover rounded-lg shadow-sm"
                            />
                            {photo.updatedAt && (
                              <p className="text-xs text-gray-500 mt-2">
                                Resolved on{" "}
                                {new Date(photo.updatedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Completion Date */}
                        {photo.completedAt && (
                          <div className="text-center mt-4 pt-4 border-t border-gray-200">
                            <p className="text-sm font-medium text-green-700">
                              ✅ Work completed on{" "}
                              {new Date(photo.completedAt).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Share Success Story */}
                  <div className="text-center mt-6">
                    <SuccessStoryShare
                      issue={issue}
                      beforeAfter={beforeAfter}
                    />
                  </div>
                </div>
              )}

            {/* Review Section */}
            {issue.status === "resolved" && isAuthenticated && (
              <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <span>⭐</span>
                  Share Your Feedback
                </h2>
                <p className="text-blue-700 text-sm mb-4">
                  Your review helps us improve our services for the community.
                </p>

                {/* Rating Stars */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Rate the resolution quality
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className={`text-3xl transition-transform hover:scale-110 ${
                          reviewRating >= star
                            ? "text-yellow-500"
                            : "text-gray-300 hover:text-yellow-400"
                        }`}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                  {reviewRating > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      {reviewRating === 5 && "Excellent service 🌟"}
                      {reviewRating === 4 && "Very good service 👍"}
                      {reviewRating === 3 && "Good service 😊"}
                      {reviewRating === 2 && "Average service ⚠️"}
                      {reviewRating === 1 && "Needs improvement 📝"}
                    </p>
                  )}
                </div>

                {/* Review Comment */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional comments (optional)
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with how this issue was resolved..."
                    className="w-full border border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none resize-none"
                    rows="3"
                  />
                </div>

                <button
                  onClick={submitReview}
                  disabled={submittingReview || reviewRating < 1}
                  className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold text-sm border border-blue-600 shadow-sm flex items-center gap-2"
                >
                  {submittingReview ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Star className="w-4 h-4" />
                      {userReview ? "Update Review" : "Submit Review"}
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Display Reviews */}
            {issue.status === "resolved" && reviews && reviews.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📊</span>
                  Community Feedback ({reviews.length})
                </h2>
                <div className="grid gap-3">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {review.user?.fullName || "Community Member"}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-sm ${
                                  review.rating >= star
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                                }`}
                              >
                                ⭐
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 whitespace-nowrap">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>💬</span>
            Community Discussion ({issue.comments?.length || 0})
          </h2>

          {/* Add Comment */}
          <div className="mb-6">
            <div className="flex gap-3">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    addComment();
                  }
                }}
                placeholder="Share your thoughts or additional information about this issue..."
                className="flex-1 border border-gray-300 p-4 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none resize-none"
                rows="3"
              />
              <button
                onClick={addComment}
                disabled={!comment.trim()}
                className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold h-fit self-end border border-blue-600 shadow-sm flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Post
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {issue.comments?.length > 0 ? (
              issue.comments.map((c) => (
                <div
                  key={c._id}
                  className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">
                      {c.user?.fullName || "Anonymous"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {c.comment}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg">💬</span>
                </div>
                <p className="text-gray-600 font-medium">No comments yet</p>
                <p className="text-gray-500 text-sm mt-1">
                  Be the first to start the discussion
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
