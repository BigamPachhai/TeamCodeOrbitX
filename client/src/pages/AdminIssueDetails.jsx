import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export default function AdminIssueDetails() {
  const { id } = useParams();

  const { data: issue, refetch } = useQuery({
    queryKey: ["admin-issue", id],
    queryFn: async () => {
      const { data } = await api.get(`/issues/${id}`);
      return data;
    },
  });

  const updateStatus = async (status) => {
    await api.put(`/admin/update-status/${id}`, { status });
    refetch();
    alert("Status updated!");
  };

  const downloadPDF = () => {
    window.location.href = `http://localhost:9000/api/admin/pdf/${id}`;
  };

  if (!issue) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-lg shadow">

      <img src={issue.image} className="w-full h-80 object-cover rounded-lg mb-4" />

      <h1 className="text-3xl font-bold text-blue-800">{issue.category}</h1>
      <p className="text-gray-700 mt-3">{issue.description}</p>

      <div className="mt-4 space-y-1 text-red-700">
        <p><strong>Status:</strong> {issue.status}</p>
        <p><strong>Location:</strong> {issue.locationName}</p>
        <p><strong>Reported:</strong> {new Date(issue.createdAt).toLocaleString()}</p>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => updateStatus("in-progress")}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          In Progress
        </button>

        <button
          onClick={() => updateStatus("resolved")}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Resolved
        </button>

        <button
          onClick={downloadPDF}
          className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
