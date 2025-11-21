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
  Bar
} from "recharts";

export default function Statistics() {
  const { data: issues } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const { data } = await api.get("/issues/all");
      return data;
    },
  });

  if (!issues) return <p className="text-center mt-10">Loading...</p>;

  const statusCounts = [
    { name: "Pending", value: issues.filter((i) => i.status === "pending").length },
    { name: "In Progress", value: issues.filter((i) => i.status === "in-progress").length },
    { name: "Resolved", value: issues.filter((i) => i.status === "resolved").length },
  ];

  const categoryCounts = issues.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.keys(categoryCounts).map((key) => ({
    category: key,
    count: categoryCounts[key],
  }));

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 shadow rounded-lg">
      <h1 className="text-3xl font-bold text-red-700 mb-6">Statistics Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-10">

        <div>
          <h2 className="text-xl font-semibold mb-3 text-blue-900">
            Issues by Status
          </h2>
          <PieChart width={350} height={350}>
            <Pie
              data={statusCounts}
              innerRadius={60}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label
            >
              <Cell fill="#d90429" />
              <Cell fill="#003049" />
              <Cell fill="#e9c46a" />
            </Pie>
          </PieChart>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3 text-blue-900">
            Issues by Category
          </h2>
          <BarChart width={350} height={300} data={categoryData}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#003049" />
          </BarChart>
        </div>

      </div>
    </div>
  );
}
