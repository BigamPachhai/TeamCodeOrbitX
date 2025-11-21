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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-center bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border-2 border-purple-200">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
        <p className="mt-6 text-gray-700 text-xl font-semibold">
          ✨ Loading statistics...
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6 flex-wrap gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent whitespace-nowrap">
                📊 Statistics Dashboard
              </h1>
              <p className="text-gray-700 mt-2 text-xl font-semibold whitespace-nowrap">
                Public Grievance Analytics
              </p>
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4">
            Comprehensive overview of citizen issues and resolution metrics for transparent governance
          </p>
          <div className="w-40 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto mt-6 rounded-full shadow-lg"></div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-red-200 p-8 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <div className="text-5xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-3">{totalIssues}</div>
            <div className="text-gray-700 font-bold text-lg mb-1">Total Issues Reported</div>
            <div className="text-sm text-gray-600 font-medium">All citizen grievances</div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-green-200 p-8 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">{resolvedIssues}</div>
            <div className="text-gray-700 font-bold text-lg mb-1">Issues Resolved</div>
            <div className="text-sm text-gray-600 font-medium">Successfully addressed</div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-blue-200 p-8 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">{resolutionRate}%</div>
            <div className="text-gray-700 font-bold text-lg mb-1">Resolution Rate</div>
            <div className="text-sm text-gray-600 font-medium">Overall efficiency</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Status Distribution */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-purple-200 p-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 pb-4 border-b-2 border-purple-200 flex items-center gap-3">
              <Target className="w-6 h-6 text-purple-600" />
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
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-blue-200 p-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6 pb-4 border-b-2 border-blue-200 flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-blue-600" />
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
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-green-200 p-8 lg:col-span-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6 pb-4 border-b-2 border-green-200 flex items-center gap-3">
              <Clock className="w-6 h-6 text-green-600" />
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
        <div className="mt-10 text-center bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-purple-200 p-6">
          <p className="text-sm text-gray-700 font-semibold">
            ⚡ Data updated in real-time • 🏛️ Government of Nepal Public Grievance Management System
          </p>
        </div>
      </div>
    </div>
  );
}