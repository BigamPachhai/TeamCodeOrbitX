import { MapContainer, TileLayer, useMap } from "react-leaflet";
import api from "../api/axios";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

// Component to update heatmap when issues change
function HeatmapLayer({ issues, map }) {
  const heatLayerRef = useRef(null);

  useEffect(() => {
    if (!map || !issues || issues.length === 0) return;

    // Remove existing heat layer if any
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
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

    // Create heat layer with better settings
    const heatLayer = L.heatLayer(heatPoints, {
      radius: 30,
      blur: 20,
      maxZoom: 17,
      max: 1.0,
      gradient: {
        0.0: "blue",
        0.3: "cyan",
        0.5: "lime",
        0.7: "yellow",
        1.0: "red",
      },
    });

    heatLayer.addTo(map);
    heatLayerRef.current = heatLayer;

    // Cleanup on unmount
    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
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

  const { data: issues, isLoading } = useQuery({
    queryKey: ["heatmap"],
    queryFn: async () => {
      const { data } = await api.get("/issues/all");
      // Filter out issues without valid coordinates
      return data.filter(
        (issue) =>
          issue.lat &&
          issue.lng &&
          !isNaN(issue.lat) &&
          !isNaN(issue.lng) &&
          issue.lat !== 0 &&
          issue.lng !== 0
      );
    },
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
    <div className="w-full h-screen relative">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-3 space-y-2">
        {/* Map Type Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setMapType("street")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              mapType === "street"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            🗺️ Street
          </button>
          <button
            onClick={() => setMapType("satellite")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              mapType === "satellite"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            🛰️ Satellite
          </button>
        </div>

        {/* Stats */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
          <p className="font-semibold text-blue-800 mb-1">📊 Statistics</p>
          <p className="text-blue-700">
            Total Issues: <strong>{issueCount}</strong>
          </p>
          <p className="text-blue-700">
            Locations: <strong>{uniqueLocations}</strong>
          </p>
        </div>

        {/* Legend */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs">
          <p className="font-semibold text-gray-800 mb-2">🔥 Heat Intensity</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Low (1-2 issues)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>Medium (3-5 issues)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>High (6+ issues)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-3">
          <p className="text-sm font-semibold text-gray-700">
            Loading heatmap data...
          </p>
        </div>
      )}

      {/* Map */}
      <MapContainer
        center={[27.6842, 83.4323]}
        zoom={11}
        className="h-full w-full"
        whenCreated={setMapInstance}
      >
        <TileLayer
          url={tileLayers[mapType]}
          attribution={
            mapType === "satellite"
              ? "&copy; Esri &mdash; Source: Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community"
              : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
        />
        {mapInstance && <MapContent issues={issues} />}
      </MapContainer>

      {/* Info Box */}
      {issues && issues.length === 0 && !isLoading && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <p className="text-sm font-semibold text-gray-800 mb-1">
            No issues found
          </p>
          <p className="text-xs text-gray-600">
            There are no reported issues to display on the heatmap yet.
          </p>
        </div>
      )}
    </div>
  );
}
