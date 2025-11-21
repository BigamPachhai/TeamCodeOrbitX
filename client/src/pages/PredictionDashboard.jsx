import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { TrendingUp, AlertTriangle, CheckCircle, Clock, BarChart3 } from "lucide-react";

export default function PredictionDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["predictions"],
    queryFn: async () => {
      const { data } = await api.get("/predictions/predictions/bulk");
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-32 bg-gray-100 rounded"></div>
              <div className="h-32 bg-gray-100 rounded"></div>
              <div className="h-32 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const predictions = data?.predictions || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white border-l-4 border-[#003865] shadow-md mb-8 p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#003865] rounded flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#003865] uppercase tracking-wide">
                Smart Issue Prediction Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                AI-Powered Predictive Analytics for Preventive Maintenance
              </p>
            </div>
          </div>
        </div>

        {predictions.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-semibold">No predictions available yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Predictions will appear as more issues are reported
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border-2 border-red-200 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                  <span className="text-2xl font-bold text-red-600">
                    {predictions.filter((p) => p.likelihood >= 70).length}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-700">High Risk Areas</p>
                <p className="text-xs text-gray-500 mt-1">Immediate attention needed</p>
              </div>

              <div className="bg-white border-2 border-yellow-200 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-8 h-8 text-yellow-600" />
                  <span className="text-2xl font-bold text-yellow-600">
                    {predictions.filter((p) => p.likelihood >= 40 && p.likelihood < 70).length}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-700">Moderate Risk</p>
                <p className="text-xs text-gray-500 mt-1">Regular monitoring advised</p>
              </div>

              <div className="bg-white border-2 border-green-200 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">
                    {predictions.filter((p) => p.likelihood < 40).length}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-700">Low Risk</p>
                <p className="text-xs text-gray-500 mt-1">Standard procedures</p>
              </div>
            </div>

            {/* Predictions List */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-bold text-[#003865] uppercase tracking-wide">
                  Risk Predictions
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Sorted by likelihood score
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {predictions.map((prediction, index) => (
                  <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-base font-bold text-gray-900">
                            {prediction.predictedIssues?.[0]?.location || "Location"}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded text-xs font-semibold border ${
                              prediction.likelihood >= 70
                                ? "bg-red-100 text-red-800 border-red-300"
                                : prediction.likelihood >= 40
                                ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                : "bg-green-100 text-green-800 border-green-300"
                            }`}
                          >
                            {prediction.likelihood}% Risk
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                          {prediction.recommendation}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Confidence: {prediction.confidence || "medium"}</span>
                          <span>•</span>
                          <span>
                            Based on {prediction.predictedIssues?.length || 0} similar issues
                          </span>
                        </div>
                      </div>

                      {/* Likelihood Bar */}
                      <div className="w-32">
                        <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              prediction.likelihood >= 70
                                ? "bg-red-500"
                                : prediction.likelihood >= 40
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${prediction.likelihood}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1 text-center font-semibold">
                          {prediction.likelihood}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

