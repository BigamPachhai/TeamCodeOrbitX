import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { Camera, Image as ImageIcon, Upload, X, AlertCircle } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { useToast } from "./Toast";

export default function IssueEvidence({ issueId }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const { isAuthenticated } = useAuth();
  const { success, error: errorToast, warning } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["issue-evidence", issueId],
    queryFn: async () => {
      const { data } = await api.get(`/evidence/${issueId}`);
      return data;
    },
    enabled: !!issueId,
  });

  const addEvidenceMutation = useMutation({
    mutationFn: async (formData) => {
      const { data } = await api.post(`/evidence/${issueId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["issue-evidence", issueId]);
      setImage(null);
      setDescription("");
      setShowAddForm(false);
      success("Evidence added successfully! Thank you for contributing.");
    },
    onError: (err) => {
      errorToast(err.response?.data?.message || "Failed to add evidence. Please try again.");
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        warning("Image size must be less than 5MB");
        return;
      }
      setImage(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      warning("Please login to add evidence");
      return;
    }

    if (!image) {
      warning("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    if (description.trim()) {
      formData.append("description", description.trim());
    }

    addEvidenceMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 bg-gray-100 rounded"></div>
            <div className="h-32 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const evidence = data?.evidence || [];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#003865] flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Community Evidence
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Additional photos and updates from the community ({evidence.length})
            </p>
          </div>
          {isAuthenticated && !showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-[#003865] text-white rounded hover:bg-[#004d8c] transition-colors text-sm font-semibold flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Add Evidence
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {showAddForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start justify-between mb-4">
              <h4 className="font-semibold text-[#003865]">Add Evidence</h4>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setImage(null);
                  setDescription("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="evidence-image"
                    required
                  />
                  <label
                    htmlFor="evidence-image"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#003865] transition-colors bg-white"
                  >
                    {image ? (
                      <div className="text-center">
                        <ImageIcon className="w-8 h-8 mx-auto text-[#003865] mb-2" />
                        <p className="text-sm text-gray-700">{image.name}</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Camera className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Click to upload image</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#003865] resize-vertical"
                  placeholder="Describe what this photo shows..."
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={addEvidenceMutation.isLoading}
                  className="flex-1 px-4 py-2 bg-[#003865] text-white rounded hover:bg-[#004d8c] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addEvidenceMutation.isLoading ? "Uploading..." : "Submit Evidence"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setImage(null);
                    setDescription("");
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {evidence.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p>No community evidence yet. Be the first to add a photo!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evidence.map((item) => (
              <div
                key={item._id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <img
                  src={item.image}
                  alt={item.description || "Evidence photo"}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  {item.description && (
                    <p className="text-sm text-gray-700 mb-2">{item.description}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      By: <span className="font-semibold">{item.user?.fullName || "Anonymous"}</span>
                    </span>
                    <time>
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

