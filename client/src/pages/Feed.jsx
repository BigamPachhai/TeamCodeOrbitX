import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import IssueCard from "../components/IssueCard";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white border border-gray-200 p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#003865] mx-auto"></div>
          <p className="mt-6 text-gray-700 text-base font-semibold">
            Loading public issues...
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Official Government Header */}
        <div className="bg-white border-l-4 border-[#003865] shadow-md mb-8 p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-[#003865] rounded flex items-center justify-center flex-shrink-0">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#003865] mb-1">
                Public Issues Feed
              </h1>
              <p className="text-gray-600 text-sm">
                रुपन्देही जिल्ला | Rupandehi District Administration Office
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Community-reported issues and their current resolution status
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white border border-gray-200 shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-[#003865] mb-2">
              {totalIssues}
            </div>
            <div className="text-gray-700 font-semibold text-sm">
              Total Issues
            </div>
          </div>
          <div className="bg-white border border-gray-200 shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-[#003865] mb-2">
              {resolvedIssues}
            </div>
            <div className="text-gray-700 font-semibold text-sm">
              Resolved
            </div>
          </div>
          <div className="bg-white border border-gray-200 shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-[#003865] mb-2">
              {pendingIssues}
            </div>
            <div className="text-gray-700 font-semibold text-sm">
              Pending Review
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
          <div className="text-center py-12 bg-white border border-gray-200 p-10">
            <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-[#003865] mb-2">
              No Issues Reported Yet
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Be the first to report a community issue and make a difference
            </p>
            <Link
              to="/report"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#003865] text-white rounded font-semibold hover:bg-[#002D4F] transition-colors text-sm border border-[#003865]"
            >
              Report Your First Issue
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
