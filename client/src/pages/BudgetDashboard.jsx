import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, PieChart } from "lucide-react";
import { useState } from "react";

export default function BudgetDashboard() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const { data, isLoading } = useQuery({
    queryKey: ["budget", selectedYear],
    queryFn: async () => {
      // Mock data for demo - replace with actual API
      return {
        totalAllocated: 5000000,
        totalSpent: 3200000,
        totalRemaining: 1800000,
        departments: [
          { name: "Road Department", allocated: 2000000, spent: 1300000, issues: 45 },
          { name: "Waste Management", allocated: 1500000, spent: 900000, issues: 32 },
          { name: "Electricity Department", allocated: 1000000, spent: 650000, issues: 28 },
          { name: "Water Supply", allocated: 500000, spent: 350000, issues: 15 },
        ],
      };
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
          </div>
        </div>
      </div>
    </div>
  );
}

