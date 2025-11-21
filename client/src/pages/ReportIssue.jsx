import { useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../api/axios";
import MapPicker from "../components/MapPicker";
import { categories } from "../data/categories";
import { getAllWards, getLocationsByWard } from "../data/rupandehiWards";
import { useToast } from "../components/Toast";
import {
  Upload,
  MapPin,
  CheckCircle,
  AlertCircle,
  Zap,
  X,
  Camera,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Navigation,
  Map as MapIcon,
  Trash2,
} from "lucide-react";

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
  const [gettingLocation, setGettingLocation] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { success, error, warning, info } = useToast();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const generateAI = async () => {
    if (!image) {
      warning("Please upload an image document first");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("image", image);
      const { data } = await api.post("/issues/ai-generate", fd);
      setDescription(data.aiDescription || "");
      success("AI description generated successfully!");
    } catch (err) {
      console.error("AI generation error:", err);
      error("Failed to generate description. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedWard("");
  };

  const handleWardChange = (e) => {
    setSelectedWard(e.target.value);
  };

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

  const getCurrentLocationDirect = () => {
    setGettingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLat(latitude);
          setLng(longitude);
          setGettingLocation(false);

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

          setShowMap(true);
        },
        (err) => {
          console.error("Error getting location:", err);
          error(
            "Unable to retrieve your location. Please ensure location services are enabled in your browser settings."
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
      error("Geolocation services are not supported by your browser");
      setGettingLocation(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!image) {
      warning("Please upload an image before submitting");
      return;
    }
    if (!description.trim()) {
      warning("Please provide a description of the issue");
      return;
    }
    if (!locationName.trim() || !lat || !lng) {
      warning("Please provide complete location information");
      return;
    }

    setLoading(true);
    try {
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
      success(
        isAnonymous
          ? "Issue report submitted successfully. Your submission has been recorded anonymously."
          : "Issue report submitted successfully. Thank you for your contribution to community improvement."
      );

      // Reset form
      setImage(null);
      setDescription("");
      setSelectedCategory("");
      setSelectedWard("");
      setLocationName("");
      setLat("");
      setLng("");
      setIsAnonymous(false);
      setCurrentStep(1);
    } catch (err) {
      console.error("Submission error:", err);
      error(
        "Failed to submit issue report. Please verify your information and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      if (!image) {
        warning("Please upload an image before proceeding");
        return;
      }
      if (!description.trim()) {
        warning("Please provide a description before proceeding");
        return;
      }
    }
    if (currentStep === 2) {
      if (!selectedCategory || !selectedWard || !locationName || !lat || !lng) {
        warning("Please complete all location information before proceeding");
        return;
      }
    }

    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Progress Steps
  const steps = [
    { number: 1, title: "Issue Details", completed: currentStep > 1 },
    { number: 2, title: "Location Information", completed: currentStep > 2 },
    { number: 3, title: "Verification", completed: currentStep > 3 },
    { number: 4, title: "Submission", completed: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4 flex-wrap gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transform hover:scale-105 transition-transform">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
                Public Issue Reporting System
              </h1>
              <p className="text-gray-600 mt-2 text-lg whitespace-nowrap">
                🏛️ Municipal Corporation - Citizen Service Portal
              </p>
            </div>
          </div>
          <div className="w-40 h-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mx-auto rounded-full shadow-lg"></div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-purple-100 p-8 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-xl border-2 ${
                    step.completed || currentStep === step.number
                      ? "bg-gradient-to-br from-blue-600 to-purple-600 border-purple-400 text-white shadow-lg"
                      : "border-gray-300 text-gray-500 bg-white"
                  } font-bold transition-all duration-300`}
                >
                  {step.completed ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={`ml-3 text-sm font-semibold ${
                    currentStep === step.number
                      ? "text-purple-700"
                      : "text-gray-600"
                  }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-4 rounded-full transition-all duration-300 ${
                      step.completed
                        ? "bg-gradient-to-r from-blue-600 to-purple-600"
                        : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-purple-100 overflow-hidden">
          {/* Form Content */}
          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Issue Details */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="border-b-2 border-purple-100 pb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                      📋 Issue Documentation
                    </h2>
                    <p className="text-gray-600 text-lg">
                      Please provide detailed information about the community
                      issue
                    </p>
                  </div>

                  {/* Evidence Upload - FIXED VERSION */}
                  <div>
                    <label className="block text-lg font-medium text-gray-900 mb-4">
                      Evidence Documentation{" "}
                      {image && (
                        <span className="text-green-600 text-sm">
                          ✓ Uploaded
                        </span>
                      )}
                    </label>

                    {!image ? (
                      <div className="border-3 border-dashed border-purple-300 rounded-2xl p-10 text-center hover:border-purple-500 transition-all duration-300 bg-gradient-to-br from-purple-50 to-blue-50 cursor-pointer hover:shadow-xl group">
                        <input
                          type="file"
                          className="absolute opacity-0 w-full h-full cursor-pointer"
                          onChange={handleImageUpload}
                          accept="image/*"
                        />
                        <div className="pointer-events-none">
                          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload className="w-10 h-10 text-white" />
                          </div>
                          <p className="text-gray-800 font-bold mb-2 text-xl">
                            📸 Upload Evidence Photo
                          </p>
                          <p className="text-gray-600 text-lg">
                            Click to upload clear photographic evidence of the
                            issue
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="border-3 border-green-300 border-dashed rounded-2xl p-6 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                              <CheckCircle className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {image.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {(image.size / 1024 / 1024).toFixed(2)} MB •
                                Ready for submission
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={removeImage}
                            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2 border border-red-200 hover:border-red-300"
                            title="Remove image"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="mt-4 flex gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              document
                                .querySelector('input[type="file"]')
                                .click()
                            }
                            className="px-4 py-2 text-blue-700 border-2 border-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
                          >
                            <Camera className="w-4 h-4" />
                            Change Photo
                          </button>
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleImageUpload}
                            accept="image/*"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-lg font-medium text-gray-900 mb-4">
                      Detailed Description
                    </label>
                    <textarea
                      placeholder="Provide a comprehensive description of the issue, including nature, impact, and any relevant observations..."
                      className="w-full border border-gray-300 p-4 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none resize-none bg-white"
                      rows="5"
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                      required
                    />

                    <button
                      type="button"
                      onClick={generateAI}
                      disabled={loading || !image}
                      className="w-full mt-4 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white py-4 rounded-xl hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3 border-2 border-purple-400 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02] disabled:transform-none disabled:shadow-none"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span>✨ Processing Documentation...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-6 h-6" />
                          <span>🤖 Generate AI Description</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Location Information */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="border-b-2 border-purple-100 pb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-3">
                      📍 Location Specification
                    </h2>
                    <p className="text-gray-600 text-lg">
                      Precise location information is required for efficient
                      issue resolution
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Category Selection */}
                    <div>
                      <label className="block text-lg font-medium text-gray-900 mb-4">
                        Issue Classification
                      </label>
                      <select
                        className="w-full border border-gray-300 p-4 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none bg-white"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        required
                      >
                        <option value="">Select issue category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Ward Selection */}
                    <div>
                      <label className="block text-lg font-medium text-gray-900 mb-4">
                        Municipal Ward
                      </label>
                      <select
                        className="w-full border border-gray-300 p-4 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none bg-white"
                        value={selectedWard}
                        onChange={handleWardChange}
                        required
                      >
                        <option value="">Select ward number</option>
                        {getAllWards().map((ward) => (
                          <option key={ward} value={ward}>
                            Ward {ward}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Location Method Selection */}
                  <div>
                    <label className="block text-lg font-medium text-gray-900 mb-4">
                      Location Identification Method
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={getCurrentLocationDirect}
                        disabled={gettingLocation}
                        className="p-7 border-3 border-green-300 rounded-2xl hover:border-green-500 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 transition-all duration-300 text-left shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-transparent group transform hover:scale-105"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center group-hover:from-green-600 group-hover:to-emerald-600 transition-colors shadow-md">
                            {gettingLocation ? (
                              <Loader2 className="w-8 h-8 text-white animate-spin" />
                            ) : (
                              <Navigation className="w-8 h-8 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg mb-1">
                              🎯 Current Location
                            </h3>
                            <p className="text-sm text-gray-600">
                              {gettingLocation
                                ? "Getting your location..."
                                : "Use device GPS for precise coordinates"}
                            </p>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowMap(!showMap)}
                        className={`p-7 border-3 rounded-2xl transition-all duration-300 text-left shadow-lg hover:shadow-2xl group transform hover:scale-105 ${
                          showMap
                            ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50"
                            : "border-blue-300 hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors shadow-md ${
                              showMap
                                ? "bg-gradient-to-br from-blue-600 to-indigo-600"
                                : "bg-gradient-to-br from-blue-500 to-indigo-500 group-hover:from-blue-600 group-hover:to-indigo-600"
                            }`}
                          >
                            <MapIcon className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg mb-1">
                              🗺️ Map Selection
                            </h3>
                            <p className="text-sm text-gray-600">
                              {showMap
                                ? "Map is visible - Click to hide"
                                : "Select location on interactive map"}
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {showMap && (
                    <MapPicker
                      lat={lat}
                      lng={lng}
                      setLat={setLat}
                      setLng={setLng}
                      setLocationName={setLocationName}
                    />
                  )}
                </div>
              )}

              {/* Step 3: Verification */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="border-b border-gray-200 pb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                      Report Verification
                    </h2>
                    <p className="text-gray-600">
                      Review and confirm your issue report details
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Issue Information
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-600">
                              Category
                            </label>
                            <p className="text-gray-900">
                              {selectedCategory || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">
                              Ward
                            </label>
                            <p className="text-gray-900">
                              {selectedWard || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">
                              Evidence File
                            </label>
                            <p className="text-gray-900">
                              {image ? image.name : "No file uploaded"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Location Details
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-600">
                              Location Name
                            </label>
                            <p className="text-gray-900">
                              {locationName || "Not specified"}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Latitude
                              </label>
                              <p className="text-gray-900 font-mono text-sm">
                                {lat || "Not set"}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Longitude
                              </label>
                              <p className="text-gray-900 font-mono text-sm">
                                {lng || "Not set"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Issue Description
                      </h3>
                      <p className="text-gray-700 bg-white p-4 rounded border border-gray-200">
                        {description || "No description provided"}
                      </p>
                    </div>

                    {/* Anonymous Option */}
                    <div className="border-t border-gray-200 pt-6">
                      <label className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mt-1"
                        />
                        <div>
                          <span className="font-semibold text-gray-900">
                            Submit as Anonymous Report
                          </span>
                          <p className="text-sm text-gray-600 mt-1">
                            Your personal information will not be recorded.
                            Report tracking will be available through reference
                            number.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Submission */}
              {currentStep === 4 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-10 h-10 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Ready to Submit
                  </h2>
                  <p className="text-gray-600 max-w-md mx-auto mb-8">
                    Your issue report is complete and ready for submission to
                    municipal authorities.
                  </p>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
                    <h3 className="font-semibold text-blue-900 mb-3">
                      Submission Summary
                    </h3>
                    <div className="text-sm text-blue-800 space-y-2">
                      <p>• Issue will be processed within 48 hours</p>
                      <p>• Reference number will be provided upon submission</p>
                      <p>
                        • Progress updates available through tracking system
                      </p>
                      {isAnonymous && <p>• Submitted as anonymous report</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center pt-8 border-t-2 border-purple-100 mt-8 gap-4">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="group relative px-8 py-4 bg-white border-3 border-gray-300 text-gray-700 rounded-2xl hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl disabled:shadow-sm transform hover:-translate-y-1 hover:scale-[1.02] disabled:transform-none overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <ArrowLeft className="w-6 h-6 relative z-10 group-hover:-translate-x-1 transition-transform duration-300" />
                  <span className="relative z-10">Previous</span>
                </button>

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 font-bold text-xl border-2 border-purple-400 shadow-2xl hover:shadow-3xl flex items-center justify-center gap-3 transform hover:-translate-y-1 hover:scale-[1.05] overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 text-lg sm:text-xl">
                      Continue
                    </span>
                    <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative px-10 py-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-2xl hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 font-bold text-xl border-2 border-emerald-400 shadow-2xl hover:shadow-3xl flex items-center justify-center gap-3 transform hover:-translate-y-1 hover:scale-[1.05] disabled:transform-none disabled:shadow-sm overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {loading ? (
                      <>
                        <Loader2 className="w-7 h-7 animate-spin relative z-10" />
                        <span className="relative z-10 text-lg sm:text-xl">
                          ✨ Submitting...
                        </span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-7 h-7 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                        <span className="relative z-10 text-lg sm:text-xl">
                          🚀 Submit Report
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Municipal Corporation Public Service Portal • Secure Issue Reporting
            System
          </p>
        </div>
      </div>
    </div>
  );
}
