import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ResponsiveContainer,
  Legend
} from "recharts";
import { BarChart3, TrendingUp, CheckCircle, AlertCircle, Clock, Target } from "lucide-react";

export default function Statistics() {
  const { data: issues, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const { data } = await api.get("/issues/all");
      return data;
    },
  });

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center bg-white border border-gray-200 p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#003865] mx-auto"></div>
        <p className="mt-6 text-gray-700 text-base font-semibold">
          Loading statistics...
        </p>
      </div>
    </div>
  );

  // Status data with Nepali government-themed colors
  const statusCounts = [
    { name: "Pending", value: issues.filter((i) => i.status === "pending").length, color: "#dc2626" },
    { name: "In Progress", value: issues.filter((i) => i.status === "in-progress").length, color: "#d97706" },
    { name: "Resolved", value: issues.filter((i) => i.status === "resolved").length, color: "#059669" },
  ];

  // Priority data
  const priorityCounts = issues.reduce((acc, curr) => {
    acc[curr.priority] = (acc[curr.priority] || 0) + 1;
    return acc;
  }, {});

  const priorityData = Object.keys(priorityCounts).map((key) => ({
    priority: key.charAt(0).toUpperCase() + key.slice(1),
    count: priorityCounts[key],
  }));

  // Category data
  const categoryCounts = issues.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.keys(categoryCounts).map((key) => ({
    category: key,
    count: categoryCounts[key],
  }));

  // Summary cards data
  const totalIssues = issues.length;
  const resolvedIssues = statusCounts.find(s => s.name === "Resolved")?.value || 0;
  const resolutionRate = totalIssues > 0 ? ((resolvedIssues / totalIssues) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Official Government Header */}
        <div className="bg-white border-l-4 border-[#003865] shadow-md mb-8 p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-[#003865] rounded flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#003865] mb-1">
                Statistics Dashboard
              </h1>
              <p className="text-gray-600 text-sm">
                रुपन्देही जिल्ला | Rupandehi District Administration Office
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Public Grievance Analytics
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white border border-gray-200 shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-600 rounded flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-4xl font-bold text-[#003865] mb-2">{totalIssues}</div>
            <div className="text-gray-700 font-semibold text-sm mb-1">Total Issues Reported</div>
            <div className="text-xs text-gray-600">All citizen grievances</div>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-green-600 rounded flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-4xl font-bold text-[#003865] mb-2">{resolvedIssues}</div>
            <div className="text-gray-700 font-semibold text-sm mb-1">Issues Resolved</div>
            <div className="text-xs text-gray-600">Successfully addressed</div>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-[#003865] rounded flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-4xl font-bold text-[#003865] mb-2">{resolutionRate}%</div>
            <div className="text-gray-700 font-semibold text-sm mb-1">Resolution Rate</div>
            <div className="text-xs text-gray-600">Overall efficiency</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Status Distribution */}
          <div className="bg-white border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-[#003865] mb-4 pb-3 border-b border-gray-200 flex items-center gap-2 uppercase tracking-wide text-sm">
              <Target className="w-4 h-4" />
              Issue Status Distribution
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusCounts}
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value, percent }) => 
                      `${name}: ${value} (${(percent * 100).toFixed(1)}%)`
                    }
                    labelLine={false}
                  >
                    {statusCounts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} issues`, 'Count']}
                    contentStyle={{ 
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-[#003865] mb-4 pb-3 border-b border-gray-200 flex items-center gap-2 uppercase tracking-wide text-sm">
              <BarChart3 className="w-4 h-4" />
              Issues by Category
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <XAxis 
                    dataKey="category" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} issues`, 'Count']}
                    contentStyle={{ 
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#dc2626" 
                    radius={[4, 4, 0, 0]}
                    name="Number of Issues"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="bg-white border border-gray-200 shadow-sm p-6 lg:col-span-2">
            <h2 className="text-lg font-bold text-[#003865] mb-4 pb-3 border-b border-gray-200 flex items-center gap-2 uppercase tracking-wide text-sm">
              <Clock className="w-4 h-4" />
              Issues by Priority Level
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <XAxis 
                    dataKey="priority" 
                    tick={{ fontSize: 14 }}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} issues`, 'Count']}
                    contentStyle={{ 
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#1e40af" 
                    radius={[4, 4, 0, 0]}
                    name="Number of Issues"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center bg-white border border-gray-200 p-5">
          <p className="text-xs text-gray-600 font-medium">
            Data updated in real-time • Government of Nepal Public Grievance Management System
          </p>
          <p className="text-xs text-gray-500 mt-1">
            नेपाल सरकार | Government of Nepal
          </p>
        </div>
      </div>
    </div>
  );
}