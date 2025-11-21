import { useState } from "react";
import api from "../api/axios";

export default function ReportIssue() {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [loading, setLoading] = useState(false);

  const generateAI = async () => {
    if (!image) return alert("Upload an image first");

    setLoading(true);

    const fd = new FormData();
    fd.append("image", image);

    const { data } = await api.post("/issues/ai-generate", fd);

    setDescription(data.aiDescription || "");
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("image", image);
    fd.append("description", description);
    fd.append("locationName", locationName);
    fd.append("lat", lat);
    fd.append("lng", lng);

    await api.post("/issues/create", fd);
    alert("Issue submitted!");
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-lg shadow">
      <h1 className="text-3xl font-bold text-red-700 mb-6">Report an Issue</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="file"
          className="w-full border p-3 rounded-lg"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <textarea
          placeholder="Description"
          className="w-full border p-3 rounded-lg"
          rows="3"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />

        <button
          type="button"
          onClick={generateAI}
          className="w-full bg-blue-800 text-white py-3 rounded-lg hover:bg-blue-900"
        >
          {loading ? "Generating..." : "Generate with AI"}
        </button>

        <input
          placeholder="Location Name"
          className="w-full border p-3 rounded-lg"
          onChange={(e) => setLocationName(e.target.value)}
        />

        <div className="flex gap-3">
          <input
            placeholder="Latitude"
            className="w-1/2 border p-3 rounded-lg"
            onChange={(e) => setLat(e.target.value)}
          />

          <input
            placeholder="Longitude"
            className="w-1/2 border p-3 rounded-lg"
            onChange={(e) => setLng(e.target.value)}
          />
        </div>

        <button className="w-full bg-red-700 text-white py-3 rounded-lg hover:bg-red-800">
          Submit Issue
        </button>
      </form>
    </div>
  );
}
