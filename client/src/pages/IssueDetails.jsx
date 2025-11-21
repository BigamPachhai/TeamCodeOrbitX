import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { useState, useEffect } from "react";
import { getSessionId } from "../utils/sessionUtils";
import { getImageUrl } from "../utils/imageUtils";
import SuccessStoryShare from "../components/SuccessStoryShare";
import useAuth from "../hooks/useAuth";
import { useToast } from "../components/Toast";
import IssueTimeline from "../components/IssueTimeline";
import IssueEvidence from "../components/IssueEvidence";
import PriorityDisplay from "../components/PriorityDisplay";
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
      if (err.response?.status === 401) {
        error("Your session has expired. Please login again.");
      } else {
        error(err.response?.data?.message || "Failed to add comment. Please try again.");
      }
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white border border-gray-200 p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#003865] mx-auto"></div>
          <p className="mt-6 text-gray-700 text-base font-semibold">
            Loading issue details...
          </p>
        </div>
      </div>
    );

  if (!issue)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white border border-gray-200 p-12 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-[#DC143C] mb-2">
            Issue Not Found
          </h2>
          <p className="text-gray-600 text-sm">
            The requested issue could not be found.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Official Government Header */}
        <div className="bg-white border-l-4 border-[#003865] shadow-md mb-8 p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-[#003865] rounded flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#003865] mb-1 capitalize">
                {issue.category}
              </h1>
              <p className="text-gray-600 text-sm">
                रुपन्देही जिल्ला | Rupandehi District Administration Office
              </p>
              <div className="mt-2">
                <span
                  className={`px-3 py-1.5 rounded text-xs font-semibold border flex items-center gap-1.5 ${status.color}`}
                >
                  {status.icon}
                  {status.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white border border-gray-200 shadow-sm overflow-hidden mb-6">
          {/* Issue Image */}
          <div className="relative">
            <img
              src={issue.image}
              className="w-full h-96 object-cover"
              alt={issue.category}
            />
          </div>

          {/* Issue Details */}
          <div className="p-6 md:p-8">
            {/* Description Section */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h2 className="text-sm font-semibold text-[#003865] uppercase tracking-wide mb-3 border-b border-gray-200 pb-2">
                Description
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                {issue.description}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded p-4">
                  <label className="text-xs font-semibold text-[#003865] uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    Location
                  </label>
                  <p className="text-gray-900 font-semibold text-sm flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#003865]" />
                    {issue.locationName}
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded p-4">
                  <label className="text-xs font-semibold text-[#003865] uppercase tracking-wide mb-2">
                    Reported By
                  </label>
                  <p className="text-gray-900 font-semibold text-sm mt-1">
                    {issue.isAnonymous ? (
                      <span className="flex items-center gap-1.5 text-gray-600">
                        Anonymous Reporter
                      </span>
                    ) : (
                      issue.user?.fullName || "Unknown"
                    )}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded p-4">
                  <label className="text-xs font-semibold text-[#003865] uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Reported Date
                  </label>
                  <p className="text-gray-900 font-semibold text-sm mt-1">
                    {new Date(issue.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded p-4">
                  <label className="text-xs font-semibold text-[#003865] uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5" />
                    Community Support
                  </label>
                  <p className="text-gray-900 font-semibold text-sm mt-1 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-red-600" />
                    {upvoteCount} {upvoteCount === 1 ? "person" : "people"}{" "}
                    support this issue
                  </p>
                </div>
              </div>
            </div>

            {/* Support Button */}
            <div className="flex justify-center mb-6">
              <button
                onClick={handleToggleUpvote}
                disabled={loadingUpvote}
                className={`flex items-center gap-2 px-6 py-2.5 rounded border font-semibold transition-colors text-sm ${
                  upvoted
                    ? "bg-red-50 text-red-700 border-red-300 hover:bg-red-100"
                    : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                } ${
                  loadingUpvote
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <Heart className={`w-4 h-4 ${upvoted ? "text-red-600 fill-red-600" : "text-gray-400"}`} />
                <span className="font-semibold">{upvoteCount}</span>
                <span>{upvoted ? "Supported" : "Support This Issue"}</span>
              </button>
            </div>

            {/* Success Story Section */}
            {issue.status === "resolved" &&
              beforeAfter &&
              beforeAfter.length > 0 && (
                <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded">
                  <div className="text-center mb-5">
                    <div className="w-12 h-12 bg-green-600 rounded flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-[#003865] mb-1">
                      Issue Resolved Successfully
                    </h2>
                    <p className="text-green-700 text-sm">
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
                            <p className="text-xs font-medium text-green-700">
                              Work completed on{" "}
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
              <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded">
                <h2 className="text-lg font-bold text-[#003865] mb-3 flex items-center gap-2 border-b border-blue-200 pb-2 uppercase tracking-wide text-sm">
                  <Star className="w-4 h-4" />
                  Share Your Feedback
                </h2>
                <p className="text-gray-700 text-xs mb-4">
                  Your review helps us improve our services for the community.
                </p>

                {/* Rating Stars */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Rate the resolution quality
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className={`text-2xl transition-colors ${
                          reviewRating >= star
                            ? "text-yellow-500"
                            : "text-gray-300 hover:text-yellow-400"
                        }`}
                      >
                        <Star className={reviewRating >= star ? "fill-yellow-500 text-yellow-500" : "text-gray-300"} />
                      </button>
                    ))}
                  </div>
                  {reviewRating > 0 && (
                    <p className="text-xs text-gray-600 mt-2">
                      {reviewRating === 5 && "Excellent service"}
                      {reviewRating === 4 && "Very good service"}
                      {reviewRating === 3 && "Good service"}
                      {reviewRating === 2 && "Average service"}
                      {reviewRating === 1 && "Needs improvement"}
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
                  className="px-5 py-2.5 bg-[#003865] text-white rounded border border-[#003865] hover:bg-[#002D4F] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-sm flex items-center gap-2"
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
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h2 className="text-lg font-bold text-[#003865] mb-4 flex items-center gap-2 uppercase tracking-wide text-sm border-b border-gray-200 pb-2">
                  Community Feedback ({reviews.length})
                </h2>
                <div className="space-y-3">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="bg-white p-4 rounded border border-gray-200 hover:border-[#003865] transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {review.user?.fullName || "Community Member"}
                          </p>
                          <div className="flex items-center gap-0.5 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  review.rating >= star
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 whitespace-nowrap">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700 text-xs leading-relaxed">
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

        {/* Priority Analysis Section */}
        <div className="mt-6">
          <PriorityDisplay issueId={id} />
        </div>

        {/* Timeline Section */}
        <div className="mt-6">
          <IssueTimeline issueId={id} />
        </div>

        {/* Community Evidence Section */}
        <div className="mt-6">
          <IssueEvidence issueId={id} />
        </div>

        {/* Comments Section */}
        <div className="bg-white border border-gray-200 shadow-sm mt-6 p-6">
          <h2 className="text-lg font-bold text-[#003865] mb-4 flex items-center gap-2 uppercase tracking-wide text-sm border-b border-gray-200 pb-2">
            <MessageCircle className="w-4 h-4" />
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
                className="bg-[#003865] text-white px-5 py-2.5 rounded border border-[#003865] hover:bg-[#002D4F] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold h-fit self-end text-sm flex items-center gap-2"
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
              <div className="text-center py-8 bg-gray-50 rounded border border-gray-200">
                <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-gray-600 font-semibold text-sm">No comments yet</p>
                <p className="text-gray-500 text-xs mt-1">
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
