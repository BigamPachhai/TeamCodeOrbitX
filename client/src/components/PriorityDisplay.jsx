import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { AlertTriangle, Clock, TrendingUp } from "lucide-react";

export default function PriorityDisplay({ issueId }) {
  const { data, isLoading } = useQuery({
    queryKey: ["issue-priority", issueId],
    queryFn: async () => {
      const { data } = await api.get(`/priority/${issueId}`);
      return data;
    },
    enabled: !!issueId,
  });

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 bg-gray-100 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { priorityScore, priorityLevel, resolutionPrediction } = data;

  const getPriorityColor = (level) => {
    switch (level) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  const getPriorityIcon = (level) => {
    switch (level) {
      case "high":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "medium":
        return <TrendingUp className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-bold text-[#003865] flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Priority Analysis
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Dynamic priority score based on community engagement and issue severity
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {/* Priority Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Priority Score</span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold border ${getPriorityColor(
                  priorityLevel
                )}`}
              >
                {getPriorityIcon(priorityLevel)}
                {priorityLevel.toUpperCase()}
              </span>
            </div>
            <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  priorityLevel === "high"
                    ? "bg-red-500"
                    : priorityLevel === "medium"
                    ? "bg-yellow-500"
                    : "bg-blue-500"
                }`}
                style={{ width: `${priorityScore}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>0</span>
              <span className="font-semibold">{priorityScore}/100</span>
              <span>100</span>
            </div>
          </div>

          {/* Resolution Prediction */}
          {resolutionPrediction && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">
                    Estimated Resolution Time
                  </h4>
                  <p className="text-sm text-blue-800 mb-2">
                    Based on similar resolved issues, this issue is estimated to be resolved in{" "}
                    <strong className="font-bold">{resolutionPrediction.estimatedDays} days</strong>.
                  </p>
                  <p className="text-xs text-blue-700">
                    Confidence: {resolutionPrediction.confidence || "medium"} | Based on:{" "}
                    {resolutionPrediction.basedOn || "AI analysis"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

