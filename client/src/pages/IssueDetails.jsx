import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { useState } from "react";

export default function IssueDetails() {
  const { id } = useParams();
  const [comment, setComment] = useState("");

  const { data: issue, refetch } = useQuery({
    queryKey: ["issue", id],
    queryFn: async () => {
      const { data } = await api.get(`/issues/${id}`);
      return data;
    },
  });

  const addComment = async () => {
    if (!comment.trim()) return;

    await api.post("/comments/add", { issueId: id, comment });
    setComment("");
    refetch();
  };

  if (!issue) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 shadow rounded-lg">

      <img
        src={issue.image}
        className="w-full h-80 object-cover rounded-lg mb-4"
      />

      <h1 className="text-3xl font-bold text-red-700">{issue.category}</h1>
      <p className="text-gray-800 mt-3">{issue.description}</p>

      <div className="mt-4 text-blue-800">
        <p><strong>Status:</strong> {issue.status}</p>
        <p><strong>Location:</strong> {issue.locationName}</p>
        <p><strong>Reported At:</strong> {new Date(issue.createdAt).toLocaleString()}</p>
      </div>

      <hr className="my-6" />

      <h2 className="text-xl font-bold text-red-700 mb-3">Comments</h2>

      <div className="flex gap-2 mb-4">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border p-3 rounded-lg"
        />
        <button
          onClick={addComment}
          className="bg-red-700 text-white px-5 py-2 rounded-lg hover:bg-red-800"
        >
          Post
        </button>
      </div>

      {issue.comments?.length > 0 ? (
        issue.comments.map((c) => (
          <div
            key={c._id}
            className="bg-gray-100 p-3 rounded-lg mb-2 border-l-4 border-red-700"
          >
            <p className="font-semibold text-blue-800">{c.user.fullName}</p>
            <p className="text-gray-700">{c.comment}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No comments yet.</p>
      )}
    </div>
  );
}
