import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { TrendingUp, AlertTriangle, CheckCircle, Clock, BarChart3 } from "lucide-react";

export default function PredictionDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["predictions"],
    queryFn: async () => {
      try {
        const response = await api.get("/predictions/bulk");
        console.log("Predictions API response:", response.data);
        // Handle response structure
        if (response.data && response.data.predictions) {
          return response.data;
        } else if (response.data && Array.isArray(response.data)) {
          return { predictions: response.data, count: response.data.length };
        } else {
          console.warn("Unexpected predictions response format:", response.data);
          return { predictions: [], count: 0 };
        }
      } catch (err) {
        console.error("Error fetching predictions:", err);
        throw err; // Let react-query handle the error
      }
    },
    retry: 2,
    refetchOnWindowFocus: true,
    refetchInterval: 30000, // Refetch every 30 seconds to get new predictions
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

  const predictions = data?.predictions || data || [];
  
  // Log for debugging
  if (error) {
    console.error("Prediction fetch error:", error);
  }
  
  if (data) {
    console.log("Predictions data received:", data);
    console.log("Predictions array:", predictions);
  }

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

        {error ? (
          <div className="bg-white border border-red-200 rounded-lg shadow-sm p-12 text-center">
            <AlertTriangle className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <p className="text-red-600 font-semibold">Error loading predictions</p>
            <p className="text-sm text-red-500 mt-2">
              {error.message || "Failed to fetch predictions. Please try again."}
            </p>
          </div>
        ) : predictions.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-semibold">No predictions available yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Predictions are generated based on reported issues. Report more issues to see predictions.
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
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-base font-bold text-gray-900">
                            {prediction.location || prediction.predictedIssues?.[0]?.location || "Location"}
                          </h3>
                          {prediction.category && (
                            <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                              {prediction.category}
                            </span>
                          )}
                          <span
                            className={`px-3 py-1 rounded text-xs font-semibold border ${
                              prediction.likelihood >= 70
                                ? "bg-red-100 text-red-800 border-red-300"
                                : prediction.likelihood >= 40
                                ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                : "bg-green-100 text-green-800 border-green-300"
                            }`}
                          >
                            {Math.round(prediction.likelihood || 0)}% Risk
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                          {prediction.recommendation || "Analysis based on historical patterns"}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                          <span className="capitalize">Confidence: {prediction.confidence || "medium"}</span>
                          {prediction.predictedIssues?.length > 0 && (
                            <>
                              <span>•</span>
                              <span>
                                Based on {prediction.predictedIssues?.length || 0} similar issue{prediction.predictedIssues?.length !== 1 ? 's' : ''}
                              </span>
                            </>
                          )}
                          {prediction.patterns?.frequency && (
                            <>
                              <span>•</span>
                              <span>Total issues: {prediction.patterns.frequency}</span>
                            </>
                          )}
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

