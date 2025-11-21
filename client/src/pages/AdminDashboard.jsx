import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { getImageUrl, getPlaceholderImage } from "../utils/imageUtils";
import { categories, getDepartmentForCategory } from "../data/categories";
import { getAllWards } from "../data/rupandehiWards";

export default function AdminDashboard() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterWard, setFilterWard] = useState("all");
  const { user } = useAuth();

  const { data: issues, isLoading, error } = useQuery({
    queryKey: ["admin-issues"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/admin/issues");
        console.log("Admin Dashboard - Received issues:", data.length);
        console.log("Admin Dashboard - Issues data:", data);
        data.forEach((issue, index) => {
          console.log(
            `Issue ${index + 1}: ${issue.category}, User: ${
              issue.user?.fullName || "Unknown"
            }, Has Image: ${!!issue.image}`
          );
        });
        return data;
      } catch (error) {
        // Re-throw to be handled by React Query
        throw error;
      }
    },
    retry: false, // Don't retry on 403 errors
  });

  // Check if user is not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check if user is not admin
  if (user.role !== "admin") {
    return (
      <div className="max-w-2xl mx-auto mt-10 mb-10 bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-3xl font-bold text-red-700 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-700 mb-2">
            You don't have permission to access the Admin Panel.
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Your current role: <strong className="text-red-600">{user.role || "user"}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Only users with <strong>admin</strong> role can access this page.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-yellow-800 mb-2">
              🔧 To set yourself as admin:
            </p>
            <p className="text-xs text-yellow-700 mb-1">
              1. Run this command in your server directory:
            </p>
            <code className="block bg-yellow-100 p-2 rounded text-xs mb-2">
              node server/scripts/setAdmin.js {user.email}
            </code>
            <p className="text-xs text-yellow-700">
              2. Or manually update your user document in MongoDB:
            </p>
            <code className="block bg-yellow-100 p-2 rounded text-xs">
              db.users.updateOne(&#123;"email": "{user.email}"&#125;, &#123;$set: &#123;"role": "admin"&#125;&#125;)
            </code>
          </div>
          <Link
            to="/feed"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Feed
          </Link>
        </div>
      </div>
    );
  }

  // Handle API errors (403, etc.)
  if (error) {
    const is403 = error.response?.status === 403;
    return (
      <div className="max-w-2xl mx-auto mt-10 mb-10 bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold text-red-700 mb-4">
            {is403 ? "Access Denied" : "Error Loading Admin Panel"}
          </h1>
          <p className="text-gray-700 mb-2">
            {is403
              ? "You don't have permission to access the Admin Panel."
              : "An error occurred while loading the admin dashboard."}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            {error.response?.data?.message || error.message}
          </p>
          {error.response?.data?.userRole && (
            <p className="text-sm text-gray-500 mb-4">
              Your role: <strong>{error.response.data.userRole}</strong>
            </p>
          )}
          <div className="flex gap-4 justify-center">
            <Link
              to="/feed"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Go to Feed
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center mt-10">
        <p className="text-lg text-gray-600">Loading issues...</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "in-progress":
        return "🔄";
      case "resolved":
        return "✅";
      default:
        return "📋";
    }
  };

  // Filter issues based on selected filters
  const filteredIssues = issues?.filter((issue) => {
    // Status filter
    if (filterStatus !== "all" && issue.status !== filterStatus) {
      return false;
    }
    
    // Category filter
    if (filterCategory !== "all" && issue.category !== filterCategory) {
      return false;
    }
    
    // Ward filter
    if (filterWard !== "all" && issue.ward !== filterWard) {
      return false;
    }
    
    return true;
  });

  // Count issues by status
  const statusCounts = {
    all: issues?.length || 0,
    pending: issues?.filter((i) => i.status === "pending").length || 0,
    "in-progress":
      issues?.filter((i) => i.status === "in-progress").length || 0,
    resolved: issues?.filter((i) => i.status === "resolved").length || 0,
  };

  // Count issues by category
  const categoryCounts = {
    all: issues?.length || 0,
    ...categories.reduce((acc, cat) => {
      acc[cat] = issues?.filter((i) => i.category === cat).length || 0;
      return acc;
    }, {}),
  };

  // Count issues by ward
  const wardCounts = {
    all: issues?.length || 0,
    ...getAllWards().reduce((acc, ward) => {
      acc[ward] = issues?.filter((i) => i.ward === ward).length || 0;
      return acc;
    }, {}),
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 mb-10 bg-white p-8 rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-red-700 mb-2">🛠️ Admin Panel</h1>
        <p className="text-gray-600">
          Manage and track all reported issues from users
        </p>
      </div>

      {/* Debug Info */}
      {issues && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-semibold text-blue-800 mb-2">
            📊 Debug Information:
          </p>
          <p className="text-xs text-blue-700">
            Total issues fetched from database: {issues.length}
          </p>
          <p className="text-xs text-blue-700">
            Issues with photos: {issues.filter((i) => i.image).length}
          </p>
          <p className="text-xs text-blue-700">
            Issues without photos: {issues.filter((i) => !i.image).length}
          </p>
          <p className="text-xs text-blue-700 mt-2">
            Check browser console for detailed logs
          </p>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-purple-500 text-white p-6 rounded-lg shadow-md">
          <p className="text-sm opacity-80">Total Issues</p>
          <p className="text-3xl font-bold">{statusCounts.all}</p>
        </div>
        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md">
          <p className="text-sm opacity-80">⏳ Pending</p>
          <p className="text-3xl font-bold">{statusCounts.pending}</p>
        </div>
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
          <p className="text-sm opacity-80">🔄 In Progress</p>
          <p className="text-3xl font-bold">{statusCounts["in-progress"]}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
          <p className="text-sm opacity-80">✅ Resolved</p>
          <p className="text-3xl font-bold">{statusCounts.resolved}</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-6 space-y-4">
        {/* Status Filter */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Filter by Status</h3>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterStatus === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All ({statusCounts.all})
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterStatus === "pending"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              ⏳ Pending ({statusCounts.pending})
            </button>
            <button
              onClick={() => setFilterStatus("in-progress")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterStatus === "in-progress"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              🔄 In Progress ({statusCounts["in-progress"]})
            </button>
            <button
              onClick={() => setFilterStatus("resolved")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterStatus === "resolved"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              ✅ Resolved ({statusCounts.resolved})
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Filter by Category / Department
          </h3>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterCategory("all")}
              className={`px-4 py-2 rounded-lg font-semibold transition text-sm ${
                filterCategory === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Categories ({categoryCounts.all})
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-lg font-semibold transition text-sm ${
                  filterCategory === category
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                title={getDepartmentForCategory(category)}
              >
                {category} ({categoryCounts[category] || 0})
              </button>
            ))}
          </div>
          {filterCategory !== "all" && (
            <p className="text-xs text-gray-600 mt-2">
              📋 Department: <strong>{getDepartmentForCategory(filterCategory)}</strong>
            </p>
          )}
        </div>

        {/* Ward Filter */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Filter by Ward</h3>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterWard("all")}
              className={`px-4 py-2 rounded-lg font-semibold transition text-sm ${
                filterWard === "all"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Wards ({wardCounts.all})
            </button>
            {getAllWards().map((ward) => (
              <button
                key={ward}
                onClick={() => setFilterWard(ward)}
                className={`px-4 py-2 rounded-lg font-semibold transition text-sm ${
                  filterWard === ward
                    ? "bg-teal-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {ward} ({wardCounts[ward] || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters Summary */}
        {(filterStatus !== "all" || filterCategory !== "all" || filterWard !== "all") && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm font-semibold text-blue-800 mb-1">Active Filters:</p>
            <div className="flex gap-2 flex-wrap">
              {filterStatus !== "all" && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                  Status: {filterStatus}
                </span>
              )}
              {filterCategory !== "all" && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold">
                  Category: {filterCategory}
                </span>
              )}
              {filterWard !== "all" && (
                <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-semibold">
                  Ward: {filterWard}
                </span>
              )}
              <button
                onClick={() => {
                  setFilterStatus("all");
                  setFilterCategory("all");
                  setFilterWard("all");
                }}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold hover:bg-red-200 transition"
              >
                Clear All Filters
              </button>
            </div>
            <p className="text-xs text-blue-700 mt-2">
              Showing {filteredIssues?.length || 0} of {issues?.length || 0} issues
            </p>
          </div>
        )}
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues && filteredIssues.length > 0 ? (
          filteredIssues.map((issue) => (
            <Link
              key={issue._id}
              to={`/admin/issue/${issue._id}`}
              className="block bg-white border-2 border-gray-200 p-5 rounded-lg shadow hover:shadow-lg transition transform hover:scale-[1.01]"
            >
              <div className="flex items-start gap-4">
                {/* Issue Image */}
                {issue.image ? (
                  <img
                    src={getImageUrl(issue.image)}
                    alt={issue.category}
                    className="w-24 h-24 object-cover rounded-lg"
                    onError={(e) => {
                      console.error(
                        `Image failed to load for issue ${issue._id}:`,
                        issue.image
                      );
                      e.target.src = getPlaceholderImage();
                    }}
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                    No Photo
                  </div>
                )}

                {/* Issue Details */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="text-xl font-bold text-blue-800">
                        {issue.category || "Uncategorized"}
                      </h2>
                      {issue.category && (
                        <p className="text-xs text-indigo-600 mt-1">
                          📋 {getDepartmentForCategory(issue.category)}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getStatusColor(
                        issue.status
                      )}`}
                    >
                      {getStatusIcon(issue.status)} {issue.status}
                    </span>
                  </div>

                  <p className="text-gray-700 line-clamp-2 mb-3">
                    {issue.description}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-gray-600 flex-wrap">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">👤</span>
                      <span>
                        {issue.isAnonymous ? (
                          <span className="flex items-center gap-1">
                            <span className="text-gray-500 italic">🔒 Anonymous</span>
                            <span className="text-xs text-blue-600">
                              ({issue.user?.fullName || issue.user?.email || "User"})
                            </span>
                          </span>
                        ) : (
                          issue.user?.fullName ||
                          issue.user?.email ||
                          "Unknown"
                        )}
                      </span>
                    </div>
                    {issue.ward && (
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">🏛️</span>
                        <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-xs font-semibold">
                          {issue.ward}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">📍</span>
                      <span>{issue.locationName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">❤️</span>
                      <span>{issue.upvoteCount || 0} upvotes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">💬</span>
                      <span>{issue.comments?.length || 0} comments</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">📅</span>
                      <span>
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">
              No {filterStatus !== "all" ? filterStatus : ""} issues found
            </p>
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div className="mt-8 border-t-2 border-gray-200 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">⭐ Reviews & Feedback</h2>
          <Link
            to="/admin/reviews"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
          >
            View All Reviews
          </Link>
        </div>
        <ReviewsList />
      </div>
    </div>
  );
}

// Reviews List Component
function ReviewsList() {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data } = await api.get("/admin/reviews");
      return data;
    },
  });

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading reviews...</p>;
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.slice(0, 5).map((review) => (
        <div
          key={review._id}
          className="bg-white border-2 border-gray-200 p-4 rounded-lg shadow"
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-bold text-gray-800">
                {review.user?.fullName || "Anonymous"}
              </p>
              <p className="text-sm text-gray-600">
                Review for: {review.issue?.category || "Issue"}
              </p>
              <p className="text-xs text-gray-500">
                {review.issue?.locationName}
              </p>
            </div>
            <div className="text-right">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={
                      review.rating >= star ? "text-yellow-400" : "text-gray-300"
                    }
                  >
                    ⭐
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          {review.comment && (
            <p className="text-gray-700 text-sm mt-2">{review.comment}</p>
          )}
        </div>
      ))}
      {reviews.length > 5 && (
        <Link
          to="/admin/reviews"
          className="block text-center text-blue-600 hover:text-blue-800 font-semibold"
        >
          View all {reviews.length} reviews →
        </Link>
      )}
    </div>
  );
}
