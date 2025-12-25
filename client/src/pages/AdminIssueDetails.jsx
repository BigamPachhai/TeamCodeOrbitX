import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "../api/axios";
import { getImageUrl, getPlaceholderImage } from "../utils/imageUtils";
import { useToast } from "../components/Toast";
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Calendar,
  Heart,
  MessageCircle,
  FileDown,
  Upload,
  Camera,
} from "lucide-react";

export default function AdminIssueDetails() {
  const { id } = useParams();
  const [afterImage, setAfterImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();
  const { success, error, warning } = useToast();

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
      success("Status updated successfully!");
    } catch (err) {
      error(
        "Error updating status: " + (err.response?.data?.message || err.message)
      );
    }
  };

  const uploadCompletionPhotos = async (e) => {
    e.preventDefault();
    if (!afterImage) {
      warning("Please select an after image");
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
      success("Completion photo uploaded successfully!");
      setAfterImage(null);
      refetchPhotos();
      refetch();
    } catch (err) {
      error(
        "Error uploading photo: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setUploading(false);
    }
  };

  const downloadPDF = () => {
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL?.replace("/api", "") ||
      "http://localhost:9000";
    window.location.href = `${backendUrl}/api/admin/pdf/${id}`;
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

  if (!issue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white border border-gray-200 p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#003865] mx-auto"></div>
          <p className="mt-6 text-gray-700 text-base font-semibold">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Official Government Header */}
        <div className="bg-white border-l-4 border-[#003865] shadow-md mb-8 p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-[#003865] rounded flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#003865] mb-1">
                {issue.category}
              </h1>
              <p className="text-gray-600 text-sm">
                रुपन्देही जिल्ला | Rupandehi District Administration Office
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`px-3 py-1 rounded text-xs font-semibold border ${getStatusColor(
                    issue.status
                  )}`}
                >
                  {issue.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Reporter Information */}
        {issue.user && (
          <div className="bg-white border border-gray-200 shadow-sm p-5 mb-6">
            <h3 className="font-semibold text-[#003865] mb-3 text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
              Reported By
            </h3>
            <div className="flex items-center gap-4">
              {issue.user.avatar && (
                <img
                  src={getImageUrl(issue.user.avatar)}
                  alt={issue.user.fullName}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  onError={(e) => {
                    e.target.src = getPlaceholderImage();
                  }}
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-gray-800 text-sm">
                    {issue.user.fullName || "User"}
                  </p>
                  {issue.isAnonymous && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-semibold border border-orange-200">
                      Anonymous Post
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1">{issue.user.email}</p>
                {issue.isAnonymous && (
                  <p className="text-xs text-[#003865] mt-2 bg-blue-50 p-2 rounded border border-blue-200">
                    This post is anonymous to the public, but you can see the
                    reporter's details as an admin.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Issue Image */}
        <div className="bg-white border border-gray-200 shadow-sm p-5 mb-6">
          <img
            src={getImageUrl(issue.image)}
            alt={issue.category}
            className="w-full h-96 object-cover rounded border border-gray-200"
            onError={(e) => {
              e.target.src = getPlaceholderImage();
            }}
          />
        </div>

        {/* Description */}
        <div className="bg-white border border-gray-200 shadow-sm p-5 mb-6">
          <h3 className="font-semibold text-[#003865] mb-3 text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
            Description
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            {issue.description}
          </p>
        </div>

        {/* Issue Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-gray-200 shadow-sm p-4">
            <p className="text-xs text-[#003865] font-semibold uppercase tracking-wide mb-1">
              Location
            </p>
            <p className="text-gray-800 text-sm">{issue.locationName}</p>
          </div>
          <div className="bg-white border border-gray-200 shadow-sm p-4">
            <p className="text-xs text-[#003865] font-semibold uppercase tracking-wide mb-1">
              Reported Date
            </p>
            <p className="text-gray-800 text-sm">
              {new Date(issue.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="bg-white border border-gray-200 shadow-sm p-4">
            <p className="text-xs text-[#003865] font-semibold uppercase tracking-wide mb-1">
              Upvotes
            </p>
            <p className="text-gray-800 text-sm">
              {issue.upvoteCount || 0} people care
            </p>
          </div>
          <div className="bg-white border border-gray-200 shadow-sm p-4">
            <p className="text-xs text-[#003865] font-semibold uppercase tracking-wide mb-1">
              Comments
            </p>
            <p className="text-gray-800 text-sm">
              {issue.comments?.length || 0} comments
            </p>
          </div>
        </div>

        {/* Status Update Section */}
        <div className="bg-white border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-5 border-b border-gray-200 pb-3">
            <h3 className="font-bold text-[#003865] text-sm uppercase tracking-wide flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Update Issue Status
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">
                Current:
              </span>
              <span
                className={`px-3 py-1 rounded text-xs font-semibold border capitalize ${getStatusColor(
                  issue.status
                )}`}
              >
                {issue.status}
              </span>
            </div>
          </div>

          {/* Status Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Pending Status Card */}
            <button
              onClick={() => updateStatus("pending")}
              disabled={issue.status === "pending"}
              className={`p-4 rounded border-2 transition-all text-left ${
                issue.status === "pending"
                  ? "bg-gray-100 border-gray-300 cursor-not-allowed opacity-60"
                  : "bg-white border-yellow-300 hover:border-yellow-500 hover:bg-yellow-50 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded flex items-center justify-center flex-shrink-0 ${
                    issue.status === "pending" ? "bg-gray-300" : "bg-yellow-500"
                  }`}
                >
                  <Clock
                    className={`w-5 h-5 ${
                      issue.status === "pending"
                        ? "text-gray-500"
                        : "text-white"
                    }`}
                  />
                </div>
                {issue.status === "pending" && (
                  <div className="bg-[#003865] text-white text-xs font-bold px-2 py-0.5 rounded">
                    Current
                  </div>
                )}
              </div>
              <h4 className="font-bold text-gray-900 mb-1 text-sm">
                Set to Pending
              </h4>
              <p className="text-xs text-gray-600">
                Mark issue as under review by authorities
              </p>
            </button>

            {/* In Progress Status Card */}
            <button
              onClick={() => updateStatus("in-progress")}
              disabled={issue.status === "in-progress"}
              className={`p-4 rounded border-2 transition-all text-left ${
                issue.status === "in-progress"
                  ? "bg-gray-100 border-gray-300 cursor-not-allowed opacity-60"
                  : "bg-white border-blue-300 hover:border-blue-500 hover:bg-blue-50 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded flex items-center justify-center flex-shrink-0 ${
                    issue.status === "in-progress"
                      ? "bg-gray-300"
                      : "bg-blue-600"
                  }`}
                >
                  <AlertCircle
                    className={`w-5 h-5 ${
                      issue.status === "in-progress"
                        ? "text-gray-500"
                        : "text-white"
                    }`}
                  />
                </div>
                {issue.status === "in-progress" && (
                  <div className="bg-[#003865] text-white text-xs font-bold px-2 py-0.5 rounded">
                    Current
                  </div>
                )}
              </div>
              <h4 className="font-bold text-gray-900 mb-1 text-sm">
                Set to In Progress
              </h4>
              <p className="text-xs text-gray-600">
                Indicate that work has started on this issue
              </p>
            </button>

            {/* Resolved Status Card */}
            <button
              onClick={() => updateStatus("resolved")}
              disabled={issue.status === "resolved"}
              className={`p-4 rounded border-2 transition-all text-left ${
                issue.status === "resolved"
                  ? "bg-gray-100 border-gray-300 cursor-not-allowed opacity-60"
                  : "bg-white border-green-300 hover:border-green-500 hover:bg-green-50 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded flex items-center justify-center flex-shrink-0 ${
                    issue.status === "resolved" ? "bg-gray-300" : "bg-green-600"
                  }`}
                >
                  <CheckCircle2
                    className={`w-5 h-5 ${
                      issue.status === "resolved"
                        ? "text-gray-500"
                        : "text-white"
                    }`}
                  />
                </div>
                {issue.status === "resolved" && (
                  <div className="bg-[#003865] text-white text-xs font-bold px-2 py-0.5 rounded">
                    Current
                  </div>
                )}
              </div>
              <h4 className="font-bold text-gray-900 mb-1 text-sm">
                Mark as Resolved
              </h4>
              <p className="text-xs text-gray-600">
                Confirm that the issue has been fully resolved
              </p>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <button
                onClick={downloadPDF}
                className="px-5 py-2.5 bg-[#003865] text-white rounded border border-[#003865] font-semibold hover:bg-[#002D4F] transition-colors text-sm flex items-center gap-2"
              >
                <FileDown className="w-4 h-4" />
                Download PDF Report
              </button>
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Click on a status card above to update</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Completion Photos Section */}
        <div className="bg-white border border-gray-200 shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-[#003865] mb-4 text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
            Upload Completion Photo (After)
          </h3>

          {/* Show Original Image as Before */}
          {issue?.image && (
            <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
              <p className="text-sm font-semibold text-[#003865] mb-2">
                Before Image (Original Issue Photo):
              </p>
              <img
                src={getImageUrl(issue.image)}
                alt="Original issue image - will be used as before photo"
                className="w-full h-64 object-cover rounded border border-gray-200"
              />
              <p className="text-xs text-gray-600 mt-2">
                This is the original image submitted by the reporter. It will
                automatically be used as the "before" photo.
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
              className={`w-full py-3 rounded border font-semibold transition text-sm flex items-center justify-center gap-2 ${
                uploading || !afterImage
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400"
                  : "bg-[#003865] text-white hover:bg-[#002D4F] border-[#003865]"
              }`}
            >
              {uploading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Completion Photo
                </>
              )}
            </button>
          </form>
        </div>

        {/* Display Completion Photos */}
        {completionPhotos && completionPhotos.length > 0 && (
          <div className="bg-white border border-gray-200 shadow-sm p-6">
            <h3 className="font-semibold text-[#003865] mb-4 text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
              Completion Photos
            </h3>
            <div className="space-y-5">
              {completionPhotos.map((photo) => (
                <div
                  key={photo._id}
                  className="bg-gray-50 border border-gray-200 p-5 rounded"
                >
                  <p className="text-xs text-gray-600 mb-4">
                    Uploaded on {new Date(photo.uploadedAt).toLocaleString()}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-gray-700 mb-2 text-sm">
                        Before
                      </p>
                      <img
                        src={getImageUrl(photo.beforeImage)}
                        alt="Before"
                        className="w-full h-64 object-cover rounded border border-gray-200"
                        onError={(e) => {
                          e.target.src = getPlaceholderImage();
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 mb-2 text-sm">
                        After
                      </p>
                      <img
                        src={getImageUrl(photo.afterImage)}
                        alt="After"
                        className="w-full h-64 object-cover rounded border border-gray-200"
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
    </div>
  );
}
