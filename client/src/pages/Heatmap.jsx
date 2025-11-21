import { MapContainer, TileLayer, useMap } from "react-leaflet";
import api from "../api/axios";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { MapPin, Layers, Info } from "lucide-react";

// Fix Leaflet default icon issue
if (typeof window !== "undefined") {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
}

// Component to update heatmap when issues change
function HeatmapLayer({ issues, map }) {
  const heatLayerRef = useRef(null);

  useEffect(() => {
    if (!map || !issues || issues.length === 0) return;

    // Remove existing heat layer if any
    if (heatLayerRef.current) {
      try {
        map.removeLayer(heatLayerRef.current);
      } catch (error) {
        console.error("Error removing heat layer:", error);
      }
      heatLayerRef.current = null;
    }

    // Group issues by location (cluster nearby issues)
    const locationGroups = {};
    const clusterRadius = 0.001; // ~100 meters

    issues.forEach((issue) => {
      if (!issue.lat || !issue.lng) return;

      // Find if there's a nearby cluster
      let foundCluster = false;
      for (const [key, group] of Object.entries(locationGroups)) {
        const [clusterLat, clusterLng] = key.split(",").map(Number);
        const distance = Math.sqrt(
          Math.pow(issue.lat - clusterLat, 2) +
            Math.pow(issue.lng - clusterLng, 2)
        );

        if (distance < clusterRadius) {
          group.push(issue);
          foundCluster = true;
          break;
        }
      }

      // Create new cluster if not found
      if (!foundCluster) {
        const key = `${issue.lat},${issue.lng}`;
        locationGroups[key] = [issue];
      }
    });

    // Create heat points with intensity based on issue count
    const heatPoints = [];
    Object.entries(locationGroups).forEach(([key, groupIssues]) => {
      const [lat, lng] = key.split(",").map(Number);
      // Intensity increases with number of issues (max 1.0)
      const intensity = Math.min(groupIssues.length / 10, 1.0);
      heatPoints.push([lat, lng, intensity]);
    });

    // If no clustering, use individual points
    if (heatPoints.length === 0) {
      issues.forEach((issue) => {
        if (issue.lat && issue.lng) {
          heatPoints.push([issue.lat, issue.lng, 0.3]);
        }
      });
    }

    // Only create heat layer if we have points
    if (heatPoints.length === 0) return;

    try {
      // Check if L.heat is available (from leaflet.heat plugin)
      if (!L.heat) {
        console.error(
          "Leaflet.heat plugin not loaded. Make sure leaflet.heat is installed."
        );
        return;
      }

      // Create heat layer with better settings
      const heatLayer = L.heat(heatPoints, {
        radius: 30,
        blur: 20,
        maxZoom: 17,
        max: 1.0,
        gradient: {
          0.0: "#3b82f6", // blue-500
          0.3: "#10b981", // green-500
          0.5: "#eab308", // yellow-500
          0.7: "#f97316", // orange-500
          1.0: "#ef4444", // red-500
        },
      });

      heatLayer.addTo(map);
      heatLayerRef.current = heatLayer;
    } catch (error) {
      console.error("Error creating heat layer:", error);
    }

    // Cleanup on unmount
    return () => {
      if (heatLayerRef.current && map) {
        try {
          map.removeLayer(heatLayerRef.current);
        } catch (error) {
          console.error("Error cleaning up heat layer:", error);
        }
        heatLayerRef.current = null;
      }
    };
  }, [map, issues]);

  return null;
}

// Component to handle map instance
function MapContent({ issues }) {
  const map = useMap();

  return <HeatmapLayer issues={issues} map={map} />;
}

export default function Heatmap() {
  const [mapType, setMapType] = useState("street"); // 'street' or 'satellite'
  const [mapInstance, setMapInstance] = useState(null);

  const {
    data: issues,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["heatmap"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/issues/all");
        // Filter out issues without valid coordinates
        const filtered = data.filter(
          (issue) =>
            issue.lat &&
            issue.lng &&
            !isNaN(Number(issue.lat)) &&
            !isNaN(Number(issue.lng)) &&
            Number(issue.lat) !== 0 &&
            Number(issue.lng) !== 0
        );
        return filtered;
      } catch (error) {
        console.error("Error fetching issues for heatmap:", error);
        return [];
      }
    },
    retry: 2,
  });

  // Tile layer URLs
  const tileLayers = {
    street: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  };

  // Count issues by location for stats
  const issueCount = issues?.length || 0;
  const uniqueLocations = new Set(
    issues?.map((i) => `${i.lat?.toFixed(4)},${i.lng?.toFixed(4)}`) || []
  ).size;

  return (
    <div className="w-full h-screen relative bg-gray-50">
      {/* Official Government Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-white border-b-4 border-[#DC143C] px-6 py-4 shadow-md">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#003865] rounded flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#003865]">
                Community Issues Heatmap
              </h1>
              <p className="text-xs text-gray-600">
                रुपन्देही जिल्ला | Rupandehi District Administration Office
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Geospatial analysis of reported community concerns
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="flex items-center gap-5">
            <div className="text-right border-r border-gray-200 pr-5">
              <p className="text-2xl font-bold text-[#003865]">{issueCount}</p>
              <p className="text-xs text-gray-600 font-medium">Total Issues</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#003865]">
                {uniqueLocations}
              </p>
              <p className="text-xs text-gray-600 font-medium">Locations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="absolute top-24 right-6 z-[1000] bg-white rounded border border-gray-200 shadow-sm p-4 w-72">
        {/* Map Type Selection */}
        <div className="mb-4 border-b border-gray-200 pb-4">
          <h3 className="text-xs font-semibold text-[#003865] mb-2 uppercase tracking-wide">
            Map View
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMapType("street")}
              className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded border text-sm transition-colors ${
                mapType === "street"
                  ? "bg-[#003865] text-white border-[#003865]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Street
            </button>
            <button
              onClick={() => setMapType("satellite")}
              className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded border text-sm transition-colors ${
                mapType === "satellite"
                  ? "bg-[#003865] text-white border-[#003865]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              Satellite
            </button>
          </div>
        </div>

        {/* Heat Intensity Legend */}
        <div className="mb-4 border-b border-gray-200 pb-4">
          <h3 className="text-xs font-semibold text-[#003865] mb-2 uppercase tracking-wide">
            Issue Density
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Low</span>
              <span className="text-xs text-gray-600">High</span>
            </div>
            <div className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 via-orange-500 to-red-500"></div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>1-2 issues</span>
              <span>6+ issues</span>
            </div>
          </div>
        </div>

        {/* Data Status */}
        <div className="bg-gray-50 rounded p-3 border border-gray-200">
          <h4 className="text-xs font-semibold text-[#003865] mb-2 uppercase tracking-wide flex items-center gap-1">
            <Info className="w-3 h-3" />
            Data Status
          </h4>
          <div className="space-y-1.5 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Last Updated:</span>
              <span className="font-medium">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Coverage:</span>
              <span className="font-medium">Rupandehi District</span>
            </div>
            {isLoading && (
              <div className="flex items-center gap-2 text-[#003865]">
                <svg
                  className="animate-spin h-3 w-3"
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
                <span>Loading data...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="pt-20 h-full">
        {isLoading ? (
          <div className="h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#003865] mx-auto"></div>
              <p className="mt-4 text-gray-700 font-semibold">
                Loading map data...
              </p>
            </div>
          </div>
        ) : queryError ? (
          <div className="h-full flex items-center justify-center bg-gray-100">
            <div className="text-center bg-white border border-gray-200 p-6 rounded shadow-sm">
              <p className="text-red-600 font-semibold">
                Error loading heatmap data
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Please try refreshing the page
              </p>
            </div>
          </div>
        ) : (
          <MapContainer
            center={[27.6842, 83.4323]}
            zoom={11}
            className="h-full w-full"
            whenCreated={setMapInstance}
            scrollWheelZoom={true}
          >
            <TileLayer
              url={tileLayers[mapType]}
              attribution={
                mapType === "satellite"
                  ? "&copy; Esri &mdash; Source: Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community"
                  : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              }
            />
            {mapInstance && issues && <MapContent issues={issues} />}
          </MapContainer>
        )}
      </div>

      {/* Empty State */}
      {issues && issues.length === 0 && !isLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000] bg-white rounded border border-gray-200 shadow-sm p-6 text-center max-w-sm">
          <div className="w-14 h-14 bg-gray-100 rounded flex items-center justify-center mx-auto mb-3">
            <MapPin className="w-7 h-7 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-[#003865] mb-2">
            No Data Available
          </h3>
          <p className="text-gray-600 text-sm">
            There are currently no geotagged issues to display on the heatmap.
          </p>
        </div>
      )}

      {/* Footer Information */}
      <div className="absolute bottom-4 left-6 z-[1000] bg-white rounded border border-gray-200 shadow-sm px-3 py-2">
        <p className="text-xs text-gray-600 font-medium">
          Municipal Corporation • Geospatial Analysis System
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          नेपाल सरकार | Government of Nepal
        </p>
      </div>
    </div>
  );
}
