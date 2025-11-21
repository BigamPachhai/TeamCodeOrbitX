import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, PieChart } from "lucide-react";
import { useState } from "react";

export default function BudgetDashboard() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const { data, isLoading, error } = useQuery({
    queryKey: ["budget", selectedYear],
    queryFn: async () => {
      try {
        const response = await api.get(`/budget/summary?year=${selectedYear}`);
        console.log("Budget API Response:", response.data);
        return response.data;
      } catch (err) {
        console.error("Error fetching budget summary:", err);
        throw err;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="h-32 bg-gray-100 rounded"></div>
              <div className="h-32 bg-gray-100 rounded"></div>
              <div className="h-32 bg-gray-100 rounded"></div>
              <div className="h-32 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Budget Data</h2>
            <p className="text-red-600">{error.response?.data?.message || error.message || "Failed to load budget summary"}</p>
          </div>
        </div>
      </div>
    );
  }

  const budgetSummary = data?.summary || {
    totalAllocated: 0,
    totalSpent: 0,
    totalRemaining: 0,
    spentPercentage: 0,
  };

  const departments = data?.departments || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white border-l-4 border-[#003865] shadow-md mb-8 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#003865] rounded flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#003865] uppercase tracking-wide">
                  Budget Tracking & Allocation
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Transparent budget management for issue resolution
                </p>
              </div>
            </div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:border-[#003865] focus:ring-1 focus:ring-[#003865] focus:outline-none bg-white text-sm"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
        </div>

        {/* Info Banner when no data */}
        {budgetSummary.totalAllocated === 0 && budgetSummary.totalSpent === 0 && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-blue-800 mb-1">No Budget Data Yet</h3>
                <p className="text-sm text-blue-700">
                  Budgets are automatically allocated using AI when issues are moved to "in-progress" status. 
                  Make sure your GEMINI_API_KEY is configured in the server environment variables for AI-powered budget allocation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border-2 border-blue-200 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-blue-600" />
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Total Allocated</p>
            <p className="text-2xl font-bold text-blue-600">
              रु {budgetSummary.totalAllocated.toLocaleString()}
            </p>
          </div>

          <div className="bg-white border-2 border-orange-200 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="w-8 h-8 text-orange-600" />
              <PieChart className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-orange-600">
              रु {budgetSummary.totalSpent.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">{budgetSummary.spentPercentage.toFixed(1)}% of budget</p>
          </div>

          <div className="bg-white border-2 border-green-200 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-green-600" />
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Remaining</p>
            <p className="text-2xl font-bold text-green-600">
              रु {budgetSummary.totalRemaining.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {budgetSummary.totalAllocated > 0
                ? ((budgetSummary.totalRemaining / budgetSummary.totalAllocated) * 100).toFixed(1)
                : 0}% available
            </p>
          </div>

          <div className="bg-white border-2 border-purple-200 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <PieChart className="w-8 h-8 text-purple-600" />
              <AlertCircle className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Avg per Issue</p>
            <p className="text-2xl font-bold text-purple-600">
              रु {budgetSummary.totalSpent > 0 && departments.length > 0
                ? Math.round(budgetSummary.totalSpent / departments.reduce((sum, d) => sum + (d.issues || 0), 0)).toLocaleString()
                : 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">Cost efficiency</p>
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-bold text-[#003865] uppercase tracking-wide">
              Department Budget Breakdown
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Allocation and spending by department for {selectedYear}
            </p>
          </div>

          <div className="p-6">
            {departments.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Budget Data Available</h3>
                <p className="text-gray-500 mb-4">
                  No budget allocations found for {selectedYear}. Budgets will appear here once issues are allocated budgets.
                </p>
                <p className="text-sm text-gray-400">
                  Budgets are automatically allocated when issues move to "in-progress" status using AI analysis.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {departments.map((dept, index) => {
                const deptSpentPercentage = dept.allocated > 0
                  ? (dept.spent / dept.allocated) * 100
                  : 0;
                const isOverBudget = deptSpentPercentage > 100;
                const isNearBudget = deptSpentPercentage > 80;

                return (
                  <div
                    key={index}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-base font-bold text-[#003865]">{dept.name}</h3>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {dept.issues} issues resolved
                        </p>
                      </div>
                      {isOverBudget && (
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold border border-red-300">
                          Over Budget
                        </span>
                      )}
                      {isNearBudget && !isOverBudget && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold border border-yellow-300">
                          Near Limit
                        </span>
                      )}
                    </div>

                    {/* Budget Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-700">
                        <span>Allocated: रु {dept.allocated.toLocaleString()}</span>
                        <span>Spent: रु {dept.spent.toLocaleString()}</span>
                      </div>
                      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            isOverBudget
                              ? "bg-red-500"
                              : isNearBudget
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${Math.min(100, deptSpentPercentage)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{deptSpentPercentage.toFixed(1)}% spent</span>
                        <span>
                          Remaining: रु {(dept.allocated - dept.spent).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

