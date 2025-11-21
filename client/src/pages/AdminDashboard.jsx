import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { data: issues } = useQuery({
    queryKey: ["admin-issues"],
    queryFn: async () => {
      const { data } = await api.get("/admin/issues");
      return data;
    },
  });

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-lg shadow">
      <h1 className="text-3xl font-bold text-red-700 mb-6">Admin Panel</h1>

      <div className="space-y-4">
        {issues?.map((i) => (
          <Link
            key={i._id}
            to={`/admin/issue/${i._id}`}
            className="block bg-gray-100 p-4 rounded-lg shadow hover:bg-gray-200"
          >
            <h2 className="font-bold text-blue-800">{i.category}</h2>
            <p className="text-gray-700">{i.description}</p>
            <p className="text-sm text-red-700">Status: {i.status}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
