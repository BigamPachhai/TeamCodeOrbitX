import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { getImageUrl, getPlaceholderImage } from "../utils/imageUtils";
import { categories, getDepartmentForCategory } from "../data/categories";
import { getAllWards } from "../data/rupandehiWards";
import { X, Filter, ChevronDown, Check } from "lucide-react";

export default function AdminDashboard() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterWard, setFilterWard] = useState("all");
  const { user } = useAuth();

  const {
    data: issues,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-issues"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/admin/issues");
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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-l-4 border-[#DC143C] shadow-md p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[#DC143C] mb-3">
                Access Denied
              </h1>
              <p className="text-gray-700 mb-2">
                You don't have permission to access the Admin Panel.
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Your current role:{" "}
                <strong className="text-[#DC143C]">
                  {user.role || "user"}
                </strong>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Only users with <strong>admin</strong> role can access this
                page.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6 text-left">
                <p className="text-sm font-semibold text-yellow-800 mb-2">
                  To set yourself as admin:
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
                  db.users.updateOne(&#123;"email": "{user.email}"&#125;,
                  &#123;$set: &#123;"role": "admin"&#125;&#125;)
                </code>
              </div>
              <Link
                to="/feed"
                className="inline-block px-6 py-2 bg-[#003865] text-white rounded border border-[#003865] hover:bg-[#002D4F] transition font-semibold text-sm"
              >
                Go to Feed
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle API errors (403, etc.)
  if (error) {
    const is403 = error.response?.status === 403;
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-l-4 border-[#DC143C] shadow-md p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[#DC143C] mb-3">
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
                  className="px-6 py-2 bg-[#003865] text-white rounded border border-[#003865] hover:bg-[#002D4F] transition font-semibold text-sm"
                >
                  Go to Feed
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-gray-600 text-white rounded border border-gray-600 hover:bg-gray-700 transition font-semibold text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white border border-gray-200 p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#003865] mx-auto"></div>
          <p className="mt-6 text-gray-700 text-base font-semibold">
            Loading issues...
          </p>
        </div>
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Official Government Header */}
        <div className="bg-white border-l-4 border-[#003865] shadow-md mb-8 p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-[#003865] rounded flex items-center justify-center flex-shrink-0">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#003865] mb-1">
                Admin Panel
              </h1>
              <p className="text-gray-600 text-sm">
                रुपन्देही जिल्ला | Rupandehi District Administration Office
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Manage and track all reported issues from users
              </p>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        {issues && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm font-semibold text-blue-800 mb-2">
              Debug Information:
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-[#003865] text-white p-5 border border-[#003865] shadow-sm">
            <p className="text-xs opacity-90 uppercase tracking-wide font-medium">
              Total Issues
            </p>
            <p className="text-3xl font-bold mt-1">{statusCounts.all}</p>
          </div>
          <div className="bg-yellow-600 text-white p-5 border border-yellow-600 shadow-sm">
            <p className="text-xs opacity-90 uppercase tracking-wide font-medium">
              Pending
            </p>
            <p className="text-3xl font-bold mt-1">{statusCounts.pending}</p>
          </div>
          <div className="bg-blue-600 text-white p-5 border border-blue-600 shadow-sm">
            <p className="text-xs opacity-90 uppercase tracking-wide font-medium">
              In Progress
            </p>
            <p className="text-3xl font-bold mt-1">
              {statusCounts["in-progress"]}
            </p>
          </div>
          <div className="bg-green-600 text-white p-5 border border-green-600 shadow-sm">
            <p className="text-xs opacity-90 uppercase tracking-wide font-medium">
              Resolved
            </p>
            <p className="text-3xl font-bold mt-1">{statusCounts.resolved}</p>
          </div>
        </div>

        {/* Unified Filter Panel */}
        <div className="bg-white border border-gray-200 shadow-sm rounded p-5 mb-6">
          <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-3">
            <h3 className="text-sm font-bold text-[#003865] uppercase tracking-wide flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </h3>
            {(filterStatus !== "all" ||
              filterCategory !== "all" ||
              filterWard !== "all") && (
              <button
                onClick={() => {
                  setFilterStatus("all");
                  setFilterCategory("all");
                  setFilterWard("all");
                }}
                className="text-xs text-[#003865] hover:text-[#002D4F] font-semibold underline transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter Dropdown */}
            <div className="relative">
              <label className="block text-xs font-semibold text-[#003865] uppercase tracking-wide mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded focus:border-[#003865] focus:ring-2 focus:ring-[#003865]/20 transition-all bg-white text-sm font-semibold appearance-none cursor-pointer hover:border-gray-400"
              >
                <option value="all">All Status ({statusCounts.all})</option>
                <option value="pending">
                  Pending ({statusCounts.pending})
                </option>
                <option value="in-progress">
                  In Progress ({statusCounts["in-progress"]})
                </option>
                <option value="resolved">
                  Resolved ({statusCounts.resolved})
                </option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-9 pointer-events-none" />
            </div>

            {/* Category Filter Dropdown */}
            <div className="relative">
              <label className="block text-xs font-semibold text-[#003865] uppercase tracking-wide mb-2">
                Category / Department
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded focus:border-[#003865] focus:ring-2 focus:ring-[#003865]/20 transition-all bg-white text-sm font-semibold appearance-none cursor-pointer hover:border-gray-400"
              >
                <option value="all">
                  All Categories ({categoryCounts.all})
                </option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category} ({categoryCounts[category] || 0}) -{" "}
                    {getDepartmentForCategory(category)}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-9 pointer-events-none" />
            </div>

            {/* Ward Filter Dropdown */}
            <div className="relative">
              <label className="block text-xs font-semibold text-[#003865] uppercase tracking-wide mb-2">
                Ward
              </label>
              <select
                value={filterWard}
                onChange={(e) => setFilterWard(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded focus:border-[#003865] focus:ring-2 focus:ring-[#003865]/20 transition-all bg-white text-sm font-semibold appearance-none cursor-pointer hover:border-gray-400"
              >
                <option value="all">All Wards ({wardCounts.all})</option>
                {getAllWards().map((ward) => (
                  <option key={ward} value={ward}>
                    {ward} ({wardCounts[ward] || 0})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-9 pointer-events-none" />
            </div>
          </div>

          {/* Active Filters Summary */}
          {(filterStatus !== "all" ||
            filterCategory !== "all" ||
            filterWard !== "all") && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs font-semibold text-[#003865] uppercase tracking-wide mb-2">
                Active Filters
              </p>
              <div className="flex flex-wrap gap-2">
                {filterStatus !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#003865] text-white rounded border border-[#003865] text-xs font-semibold">
                    Status: {filterStatus}
                    <button
                      onClick={() => setFilterStatus("all")}
                      className="hover:bg-white/20 rounded p-0.5 transition-colors"
                      title="Remove filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filterCategory !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#003865] text-white rounded border border-[#003865] text-xs font-semibold">
                    Category: {filterCategory}
                    <button
                      onClick={() => setFilterCategory("all")}
                      className="hover:bg-white/20 rounded p-0.5 transition-colors"
                      title="Remove filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filterWard !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#003865] text-white rounded border border-[#003865] text-xs font-semibold">
                    Ward: {filterWard}
                    <button
                      onClick={() => setFilterWard("all")}
                      className="hover:bg-white/20 rounded p-0.5 transition-colors"
                      title="Remove filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-3 font-medium">
                Showing{" "}
                <strong className="text-[#003865]">
                  {filteredIssues?.length || 0}
                </strong>{" "}
                of <strong>{issues?.length || 0}</strong> issues
              </p>
            </div>
          )}
        </div>

        {/* Issues List */}
        <div className="bg-white border border-gray-200 shadow-sm rounded overflow-hidden mb-6">
          {/* Table Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
            <div className="grid grid-cols-12 gap-4 text-xs font-bold text-[#003865] uppercase tracking-wide">
              <div className="col-span-4 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Issue Details
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Municipality & Ward
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                Reporter
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Status
              </div>
              <div className="col-span-2 flex items-center gap-2 justify-end">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                Engagement
              </div>
            </div>
          </div>

          {/* Issues Table Body */}
          {filteredIssues && filteredIssues.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredIssues.map((issue) => (
                <Link
                  key={issue._id}
                  to={`/admin/issue/${issue._id}`}
                  className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Desktop View - Grid Layout */}
                  <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                    {/* Issue Details Column - col-span-4 */}
                    <div className="col-span-4">
                      <div className="flex items-start gap-3">
                        {/* Issue Image */}
                        {issue.image ? (
                          <img
                            src={getImageUrl(issue.image)}
                            alt={issue.category}
                            className="w-16 h-16 object-cover rounded border border-gray-200 flex-shrink-0"
                            onError={(e) => {
                              console.error(
                                `Image failed to load for issue ${issue._id}:`,
                                issue.image
                              );
                              e.target.src = getPlaceholderImage();
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-400 text-xs flex-shrink-0">
                            No Photo
                          </div>
                        )}

                        {/* Issue Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-[#003865] mb-0.5 truncate">
                            {issue.category || "Uncategorized"}
                          </h3>
                          {issue.category && (
                            <p className="text-xs text-gray-500 mb-1 truncate">
                              {getDepartmentForCategory(issue.category)}
                            </p>
                          )}
                          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                            {issue.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Municipality & Ward Column - col-span-2 */}
                    <div className="col-span-2">
                      <div className="space-y-1">
                        {issue.municipality && (
                          <div className="flex items-center gap-1.5">
                            <svg
                              className="w-3.5 h-3.5 text-[#003865] flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                              />
                            </svg>
                            <span className="bg-[#003865] text-white px-2 py-0.5 rounded text-xs font-bold border border-[#003865]">
                              {issue.municipality}
                            </span>
                          </div>
                        )}
                        {issue.ward && (
                          <div className="flex items-center gap-1.5">
                            <svg
                              className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                              />
                            </svg>
                            <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-semibold border border-gray-200">
                              {issue.ward}
                            </span>
                          </div>
                        )}
                        {issue.locationName && (
                          <div className="flex items-center gap-1.5">
                            <svg
                              className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span className="text-xs text-gray-700 truncate">
                              {issue.locationName}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Reporter Column - col-span-2 */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-1.5 mb-1">
                        <svg
                          className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <div className="min-w-0 flex-1">
                          {issue.isAnonymous ? (
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs text-gray-500 italic truncate">
                                Anonymous
                              </span>
                              <span className="text-xs text-[#003865] truncate">
                                {issue.user?.fullName ||
                                  issue.user?.email ||
                                  "User"}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-700 truncate">
                              {issue.user?.fullName ||
                                issue.user?.email ||
                                "Unknown"}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 ml-5">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Status Column - col-span-2 */}
                    <div className="col-span-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold border ${getStatusColor(
                          issue.status
                        )}`}
                      >
                        {getStatusIcon(issue.status)}
                        <span className="capitalize">{issue.status}</span>
                      </span>
                    </div>

                    {/* Engagement Column - col-span-2 */}
                    <div className="col-span-2 flex items-center justify-end gap-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <span className="font-semibold">
                          {issue.upvoteCount || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                        <span className="font-semibold">
                          {issue.comments?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile View - Stacked Layout */}
                  <div className="md:hidden space-y-3">
                    <div className="flex items-start gap-3">
                      {/* Issue Image */}
                      {issue.image ? (
                        <img
                          src={getImageUrl(issue.image)}
                          alt={issue.category}
                          className="w-20 h-20 object-cover rounded border border-gray-200 flex-shrink-0"
                          onError={(e) => {
                            console.error(
                              `Image failed to load for issue ${issue._id}:`,
                              issue.image
                            );
                            e.target.src = getPlaceholderImage();
                          }}
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-400 text-xs flex-shrink-0">
                          No Photo
                        </div>
                      )}

                      {/* Issue Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-sm font-bold text-[#003865] truncate flex-1">
                            {issue.category || "Uncategorized"}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold border flex-shrink-0 ${getStatusColor(
                              issue.status
                            )}`}
                          >
                            {getStatusIcon(issue.status)}
                            <span className="capitalize hidden sm:inline">
                              {issue.status}
                            </span>
                          </span>
                        </div>
                        {issue.category && (
                          <p className="text-xs text-gray-500 mb-1 truncate">
                            {getDepartmentForCategory(issue.category)}
                          </p>
                        )}
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-2">
                          {issue.description}
                        </p>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                          {issue.municipality && (
                            <div className="flex items-center gap-1">
                              <svg
                                className="w-3 h-3 text-[#003865]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                              </svg>
                              <span className="bg-[#003865] text-white px-1.5 py-0.5 rounded text-xs font-bold border border-[#003865] truncate">
                                {issue.municipality}
                              </span>
                            </div>
                          )}
                          {issue.ward && (
                            <div className="flex items-center gap-1">
                              <svg
                                className="w-3 h-3 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                              </svg>
                              <span className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-semibold border border-gray-200 truncate">
                                {issue.ward}
                              </span>
                            </div>
                          )}
                          {issue.locationName && (
                            <div className="flex items-center gap-1 col-span-2">
                              <svg
                                className="w-3 h-3 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                              </svg>
                              <span className="truncate">
                                {issue.locationName}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <svg
                              className="w-3 h-3 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            <span className="truncate">
                              {issue.isAnonymous
                                ? "Anonymous"
                                : issue.user?.fullName || "Unknown"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg
                              className="w-3 h-3 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span>
                              {new Date(issue.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Engagement */}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <svg
                              className="w-3.5 h-3.5 text-red-500"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            <span className="font-semibold">
                              {issue.upvoteCount || 0}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg
                              className="w-3.5 h-3.5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                              />
                            </svg>
                            <span className="font-semibold">
                              {issue.comments?.length || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 font-semibold text-sm mb-1">
                No {filterStatus !== "all" ? filterStatus : ""} issues found
              </p>
              <p className="text-gray-500 text-xs">
                {filterStatus !== "all" ||
                filterCategory !== "all" ||
                filterWard !== "all"
                  ? "Try adjusting your filters to see more results"
                  : "No issues have been reported yet"}
              </p>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#003865]">
              Reviews & Feedback
            </h2>
            <Link
              to="/admin/reviews"
              className="px-4 py-2 bg-[#003865] text-white rounded border border-[#003865] hover:bg-[#002D4F] transition font-semibold text-sm"
            >
              View All Reviews
            </Link>
          </div>
          <ReviewsList />
        </div>
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
                      review.rating >= star
                        ? "text-yellow-400"
                        : "text-gray-300"
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
