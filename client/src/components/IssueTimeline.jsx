import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { Clock, CheckCircle2, AlertCircle, FileText, Camera } from "lucide-react";

export default function IssueTimeline({ issueId }) {
  const { data, isLoading } = useQuery({
    queryKey: ["issue-timeline", issueId],
    queryFn: async () => {
      const { data } = await api.get(`/timeline/${issueId}`);
      return data;
    },
    enabled: !!issueId,
  });

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-100 rounded"></div>
            <div className="h-16 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.timeline || data.timeline.length === 0) {
    return null;
  }

  const getStatusIcon = (status, changeType) => {
    if (changeType === "created") {
      return <FileText className="w-5 h-5 text-[#003865]" />;
    }
    if (changeType === "photo_uploaded") {
      return <Camera className="w-5 h-5 text-green-600" />;
    }
    switch (status) {
      case "resolved":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800 border-green-300";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "resolved":
        return "Resolved";
      case "in-progress":
        return "In Progress";
      default:
        return "Pending";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-bold text-[#003865] flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Issue Timeline
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Track the complete journey of this issue from report to resolution
        </p>
      </div>

      <div className="p-6">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          <div className="space-y-6">
            {data.timeline.map((entry, index) => (
              <div key={entry.id || index} className="relative flex items-start gap-4">
                {/* Icon circle */}
                <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
                  {getStatusIcon(entry.status, entry.changeType)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-6">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded text-xs font-semibold border ${getStatusColor(
                          entry.status
                        )}`}
                      >
                        {getStatusLabel(entry.status)}
                      </span>
                      {entry.changeType === "photo_uploaded" && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Camera className="w-3 h-3" />
                          Photo Uploaded
                        </span>
                      )}
                    </div>
                    <time className="text-xs text-gray-500 whitespace-nowrap">
                      {new Date(entry.timestamp).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>

                  {entry.notes && (
                    <p className="text-sm text-gray-700 mb-1">{entry.notes}</p>
                  )}

                  {entry.changedBy && (
                    <p className="text-xs text-gray-500">
                      Updated by: <span className="font-semibold">{entry.changedBy.name}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

