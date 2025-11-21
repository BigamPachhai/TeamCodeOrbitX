import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "../api/axios";
import { getImageUrl, getPlaceholderImage } from "../utils/imageUtils";

export default function AdminIssueDetails() {
  const { id } = useParams();
  const [afterImage, setAfterImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: issue, refetch } = useQuery({
    queryKey: ["admin-issue", id],
    queryFn: async () => {
      const { data } = await api.get(`/admin/issue/${id}`);
      return data;
    },
  });

  const { data: completionPhotos, refetch: refetchPhotos } = useQuery({
    queryKey: ["before-after", id],
    queryFn: async () => {
      try {
        const { data } = await api.get(`/admin/before-after/${id}`);
        return data;
      } catch (error) {
        return [];
      }
    },
  });

  const updateStatus = async (status) => {
    try {
      await api.put(`/admin/update-status/${id}`, { status });
      await refetch();
      queryClient.invalidateQueries({ queryKey: ["admin-issues"] });
      alert("Status updated successfully!");
    } catch (error) {
      alert(
        "Error updating status: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const uploadCompletionPhotos = async (e) => {
    e.preventDefault();
    if (!afterImage) {
      alert("Please select an after image");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("afterImage", afterImage);
    formData.append("useOriginalBefore", "true"); // Always use original issue image

    try {
      await api.post(`/admin/completion-photos/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Completion photo uploaded successfully!");
      setAfterImage(null);
      refetchPhotos();
      refetch();
    } catch (error) {
      alert(
        "Error uploading photo: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setUploading(false);
    }
  };

  const downloadPDF = () => {
    window.location.href = `http://localhost:9000/api/admin/pdf/${id}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (!issue) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 mb-10 bg-white p-8 rounded-lg shadow-lg">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-blue-800 mb-2">
          {issue.category}
        </h1>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getStatusColor(
              issue.status
            )}`}
          >
            {issue.status}
          </span>
        </div>
      </div>

      {/* Reporter Information */}
      {issue.user && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">👤 Reported By</h3>
          <div className="flex items-center gap-4">
            {issue.user.avatar && (
              <img
                src={getImageUrl(issue.user.avatar)}
                alt={issue.user.fullName}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = getPlaceholderImage();
                }}
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-bold text-gray-800">
                  {issue.user.fullName || "User"}
                </p>
                {issue.isAnonymous && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">
                    🔒 Anonymous Post
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">{issue.user.email}</p>
              {issue.isAnonymous && (
                <p className="text-xs text-blue-600 mt-1">
                  ⓘ This post is anonymous to the public, but you can see the reporter's details as an admin.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Issue Image */}
      <img
        src={getImageUrl(issue.image)}
        alt={issue.category}
        className="w-full h-96 object-cover rounded-lg mb-6 shadow-md"
        onError={(e) => {
          e.target.src = getPlaceholderImage();
        }}
      />

      {/* Description */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-2">📝 Description</h3>
        <p className="text-gray-700 text-lg">{issue.description}</p>
      </div>

      {/* Issue Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600 font-semibold">📍 Location</p>
          <p className="text-gray-800">{issue.locationName}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-purple-600 font-semibold">
            📅 Reported Date
          </p>
          <p className="text-gray-800">
            {new Date(issue.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-red-600 font-semibold">❤️ Upvotes</p>
          <p className="text-gray-800">{issue.upvoteCount || 0} people care</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600 font-semibold">💬 Comments</p>
          <p className="text-gray-800">
            {issue.comments?.length || 0} comments
          </p>
        </div>
      </div>

      {/* Status Update Buttons */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-700 mb-3">🛠️ Update Status</h3>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => updateStatus("pending")}
            disabled={issue.status === "pending"}
            className={`px-5 py-2 rounded-lg font-semibold transition ${
              issue.status === "pending"
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-yellow-500 text-white hover:bg-yellow-600"
            }`}
          >
            ⏳ Set to Pending
          </button>

          <button
            onClick={() => updateStatus("in-progress")}
            disabled={issue.status === "in-progress"}
            className={`px-5 py-2 rounded-lg font-semibold transition ${
              issue.status === "in-progress"
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            🔄 Set to In Progress
          </button>

          <button
            onClick={() => updateStatus("resolved")}
            disabled={issue.status === "resolved"}
            className={`px-5 py-2 rounded-lg font-semibold transition ${
              issue.status === "resolved"
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            ✅ Mark as Resolved
          </button>

          <button
            onClick={downloadPDF}
            className="px-5 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            📄 Download PDF Report
          </button>
        </div>
      </div>

      {/* Upload Completion Photos Section */}
      <div className="border-t-2 border-gray-200 pt-8">
        <h3 className="font-semibold text-gray-700 mb-4 text-xl">
          📸 Upload Completion Photo (After)
        </h3>

        {/* Show Original Image as Before */}
        {issue?.image && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold text-blue-800 mb-2">
              📷 Before Image (Original Issue Photo):
            </p>
            <img
              src={getImageUrl(issue.image)}
              alt="Original issue image - will be used as before photo"
              className="w-full h-64 object-cover rounded-lg shadow"
            />
            <p className="text-xs text-blue-600 mt-2">
              This is the original image submitted by the reporter. It will automatically be used as the "before" photo.
            </p>
          </div>
        )}

        <form onSubmit={uploadCompletionPhotos} className="space-y-4">
          {/* After Image */}
          <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              After Image * (Upload the completed work photo)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAfterImage(e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              required
            />
            {afterImage && (
              <p className="text-xs text-green-600 mt-2">
                ✓ {afterImage.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={uploading || !afterImage}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              uploading || !afterImage
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {uploading ? "Uploading..." : "📤 Upload Completion Photo"}
          </button>
        </form>
      </div>

      {/* Display Completion Photos */}
      {completionPhotos && completionPhotos.length > 0 && (
        <div className="border-t-2 border-gray-200 pt-8 mt-8">
          <h3 className="font-semibold text-gray-700 mb-4 text-xl">
            🎉 Completion Photos
          </h3>
          <div className="space-y-6">
            {completionPhotos.map((photo) => (
              <div
                key={photo._id}
                className="bg-gray-50 p-6 rounded-lg shadow-md"
              >
                <p className="text-sm text-gray-600 mb-4">
                  Uploaded on {new Date(photo.uploadedAt).toLocaleString()}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-gray-700 mb-2">
                      📷 Before
                    </p>
                    <img
                      src={getImageUrl(photo.beforeImage)}
                      alt="Before"
                      className="w-full h-64 object-cover rounded-lg shadow"
                      onError={(e) => {
                        e.target.src = getPlaceholderImage();
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 mb-2">✨ After</p>
                    <img
                      src={getImageUrl(photo.afterImage)}
                      alt="After"
                      className="w-full h-64 object-cover rounded-lg shadow"
                      onError={(e) => {
                        e.target.src = getPlaceholderImage();
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
