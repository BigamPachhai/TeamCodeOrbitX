import { Link } from "react-router-dom";

export default function IssueCard({ issue }) {
  return (
    <Link
      to={`/issue/${issue._id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-xl transition p-4"
    >
      <img
        src={issue.image}
        className="w-full h-56 object-cover rounded-lg mb-3"
      />

      <h2 className="text-xl font-bold text-red-700">{issue.category}</h2>
      <p className="text-gray-700">{issue.description}</p>

      <p className="text-sm mt-2 text-blue-800">
        Status: <b>{issue.status}</b>
      </p>
    </Link>
  );
}
