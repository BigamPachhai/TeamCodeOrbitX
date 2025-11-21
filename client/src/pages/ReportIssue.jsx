import { useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../api/axios";
import MapPicker from "../components/MapPicker";
import { categories } from "../data/categories";
import { getAllWards, getLocationsByWard } from "../data/rupandehiWards";

export default function ReportIssue() {
  const { t } = useTranslation();
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const generateAI = async () => {
    if (!image) return alert("Upload an image first");

    setLoading(true);

    const fd = new FormData();
    fd.append("image", image);

    const { data } = await api.post("/issues/ai-generate", fd);

    setDescription(data.aiDescription || "");
    setLoading(false);
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    // Reset ward when category changes
    setSelectedWard("");
  };

  // Handle ward change
  const handleWardChange = (e) => {
    setSelectedWard(e.target.value);
  };

  // Handle location selection from dropdown
  const handleLocationSelect = (e) => {
    const locationIndex = e.target.value;
    if (locationIndex && selectedWard) {
      const locations = getLocationsByWard(selectedWard);
      const location = locations[locationIndex];
      setLocationName(location.name);
      setLat(location.lat);
      setLng(location.lng);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("image", image);
    fd.append("description", description);
    fd.append("category", selectedCategory || "");
    fd.append("ward", selectedWard || "");
    fd.append("locationName", locationName);
    fd.append("lat", lat);
    fd.append("lng", lng);
    fd.append("isAnonymous", isAnonymous);

    await api.post("/issues/create", fd);
    alert(isAnonymous ? t("reportIssue.issueSubmittedAnonymously") : t("reportIssue.issueSubmitted"));
    
    // Reset form
    setImage(null);
    setDescription("");
    setSelectedCategory("");
    setSelectedWard("");
    setLocationName("");
    setLat("");
    setLng("");
    setIsAnonymous(false);
  };

  // Get current location (accessible from anywhere)
  const [gettingLocation, setGettingLocation] = useState(false);

  const getCurrentLocationDirect = () => {
    setGettingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLat(latitude);
          setLng(longitude);
          setGettingLocation(false);

          // Reverse geocode to get location name
          fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          )
            .then((res) => res.json())
            .then((data) => {
              if (data.display_name) {
                setLocationName(data.display_name);
              }
            })
            .catch((err) => console.error("Geocoding error:", err));

          // Switch to map view to show the location
          setShowMap(true);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Unable to get your location. Please enable location services in your browser."
          );
          setGettingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
      setGettingLocation(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 mb-10 bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-red-700 mb-6">{t("reportIssue.title")}</h1>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t("reportIssue.uploadImage")}
          </label>
          <input
            type="file"
            className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-red-500 focus:outline-none"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t("reportIssue.description")}
          </label>
          <textarea
            placeholder={t("reportIssue.description")}
            className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-red-500 focus:outline-none"
            rows="3"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
        </div>

        {/* AI Generate Button */}
        <button
          type="button"
          onClick={generateAI}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
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
              {t("common.loading")}
            </>
          ) : (
            <>{t("reportIssue.generateAI")}</>
          )}
        </button>

        <div className="border-t-2 border-gray-200 pt-5">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📍 {t("reportIssue.selectLocation")}
          </h2>

          {/* Quick Current Location Button */}
          <button
            type="button"
            onClick={getCurrentLocationDirect}
            disabled={gettingLocation}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition font-semibold mb-4 flex items-center justify-center gap-2 shadow-md"
          >
            {gettingLocation ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
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
                {t("common.loading")}
              </>
            ) : (
              <>{t("reportIssue.useCurrentLocation")}</>
            )}
          </button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Location Selection Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setShowMap(false)}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                !showMap
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {t("reportIssue.chooseFromList")}
            </button>
            <button
              type="button"
              onClick={() => setShowMap(true)}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                showMap
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {t("reportIssue.useMap")}
            </button>
          </div>

          {!showMap ? (
            /* Category, Ward and Location Dropdown */
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("reportIssue.selectCategory")}
                </label>
                <select
                  className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-red-500 focus:outline-none"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  required
                >
                  <option value="">-- {t("reportIssue.selectCategory")} --</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCategory && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t("reportIssue.selectWard")}
                    </label>
                    <select
                      className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-red-500 focus:outline-none"
                      value={selectedWard}
                      onChange={handleWardChange}
                      required
                    >
                      <option value="">-- {t("reportIssue.selectWard")} --</option>
                      {getAllWards().map((ward) => (
                        <option key={ward} value={ward}>
                          {ward}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedWard && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t("reportIssue.selectLocation")}
                      </label>
                      <select
                        className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-red-500 focus:outline-none"
                        onChange={handleLocationSelect}
                        required
                      >
                        <option value="">-- {t("reportIssue.selectLocation")} --</option>
                        {getLocationsByWard(selectedWard).map(
                          (location, index) => (
                            <option key={index} value={index}>
                              {location.name}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            /* Map Picker */
            <MapPicker
              lat={lat}
              lng={lng}
              setLat={setLat}
              setLng={setLng}
              setLocationName={setLocationName}
            />
          )}
        </div>

        {/* Location Details Display */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-3">
            {t("reportIssue.selectedLocation")}
          </h3>

          <div className="space-y-2">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                {t("reportIssue.locationName")}
              </label>
              <input
                placeholder={t("reportIssue.locationName")}
                className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-red-500 focus:outline-none bg-white"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  {t("reportIssue.latitude")}
                </label>
                <input
                  placeholder={t("reportIssue.latitude")}
                  className="w-full border-2 border-gray-300 p-3 rounded-lg bg-white focus:border-red-500 focus:outline-none"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  required
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  {t("reportIssue.longitude")}
                </label>
                <input
                  placeholder={t("reportIssue.longitude")}
                  className="w-full border-2 border-gray-300 p-3 rounded-lg bg-white focus:border-red-500 focus:outline-none"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Anonymous Posting Option */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <div>
              <span className="font-semibold text-blue-800">
                {t("reportIssue.postAnonymously")}
              </span>
              <p className="text-sm text-blue-600 mt-1">
                {t("reportIssue.anonymousNote")}
              </p>
            </div>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-red-700 text-white py-4 rounded-lg hover:bg-red-800 transition font-bold text-lg shadow-lg"
        >
          {isAnonymous ? t("reportIssue.submitIssueAnonymously") : t("reportIssue.submitIssue")}
        </button>
      </form>
    </div>
  );
}
