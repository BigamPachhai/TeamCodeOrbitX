import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import IssueCard from "../components/IssueCard";
import { Link } from "react-router-dom";

export default function Feed() {
  const { data: issues, isLoading } = useQuery({
    queryKey: ["issues"],
    queryFn: async () => {
      const { data } = await api.get("/issues/all");
      return data;
    },
  });

  if (isLoading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border-2 border-purple-200">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
          <p className="mt-6 text-gray-700 text-xl font-semibold">
            ✨ Loading public issues...
          </p>
        </div>
      </div>
    );

  // Calculate statistics for the header
  const totalIssues = issues?.length || 0;
  const resolvedIssues =
    issues?.filter((issue) => issue.status === "resolved").length || 0;
  const pendingIssues =
    issues?.filter((issue) => issue.status === "pending").length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6 flex-wrap gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform">
              <span className="text-white font-bold text-2xl">📢</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
              Public Issues Feed
            </h1>
          </div>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">
            🌟 Community-reported issues and their current resolution status
          </p>
          <div className="w-32 h-1.5 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 mx-auto mt-6 rounded-full shadow-lg"></div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-blue-200 p-8 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {totalIssues}
            </div>
            <div className="text-gray-700 font-semibold text-lg">
              📊 Total Issues
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-green-200 p-8 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              {resolvedIssues}
            </div>
            <div className="text-gray-700 font-semibold text-lg">
              ✅ Resolved
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-orange-200 p-8 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
              {pendingIssues}
            </div>
            <div className="text-gray-700 font-semibold text-lg">
              ⏳ Pending Review
            </div>
          </div>
        </div>

        {/* Issues Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {issues?.map((issue) => (
            <IssueCard key={issue._id} issue={issue} />
          ))}
        </div>

        {/* Empty State */}
        {issues?.length === 0 && (
          <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-purple-200 p-12">
            <div className="w-28 h-28 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-5xl">📝</span>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              No Issues Reported Yet
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              Be the first to report a community issue and make a difference
            </p>
            <Link
              to="/report"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              🚀 Report Your First Issue
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
