import { MapContainer, TileLayer, useMap } from "react-leaflet";
import api from "../api/axios";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Layers, Info, Navigation } from "lucide-react";

// Load leaflet.heat plugin from CDN as fallback if npm package doesn't work
if (typeof window !== "undefined") {
  // Try loading from CDN if L.heat is not available
  const loadHeatPlugin = () => {
    if (!L.heat) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js";
      script.onload = () => {
        console.log("Leaflet.heat loaded from CDN");
      };
      script.onerror = () => {
        console.warn("Failed to load leaflet.heat from CDN");
      };
      document.head.appendChild(script);
    }
  };

  // Try npm package first
  import("leaflet.heat")
    .then(() => {
      console.log("Leaflet.heat loaded from npm");
    })
    .catch(() => {
      console.warn("Failed to load leaflet.heat from npm, trying CDN...");
      loadHeatPlugin();
    });
}

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
  const markersRef = useRef([]);

  useEffect(() => {
    if (!map || !issues || issues.length === 0) {
      console.log("Heatmap: No map, issues, or empty issues array");
      return;
    }

    console.log(`Heatmap: Processing ${issues.length} issues`);

    // Clean up existing layers
    if (heatLayerRef.current) {
      try {
        map.removeLayer(heatLayerRef.current);
      } catch (error) {
        console.error("Error removing heat layer:", error);
      }
      heatLayerRef.current = null;
    }

    // Clean up existing markers
    markersRef.current.forEach((marker) => {
      try {
        map.removeLayer(marker);
      } catch (error) {
        // Ignore cleanup errors
      }
    });
    markersRef.current = [];

    // Process issues and ensure coordinates are numbers
    const validIssues = issues.filter((issue) => {
      const lat = Number(issue.lat);
      const lng = Number(issue.lng);
      return (
        !isNaN(lat) &&
        !isNaN(lng) &&
        lat !== 0 &&
        lng !== 0 &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
      );
    });

    if (validIssues.length === 0) {
      console.log("No valid issues with coordinates");
      return;
    }

    console.log(`Heatmap: Found ${validIssues.length} valid issues with coordinates`);

    // Group issues by location (cluster nearby issues)
    const locationGroups = {};
    const clusterRadius = 0.001; // ~100 meters

    validIssues.forEach((issue) => {
      const lat = Number(issue.lat);
      const lng = Number(issue.lng);

      // Find if there's a nearby cluster
      let foundCluster = false;
      for (const [key, group] of Object.entries(locationGroups)) {
        const [clusterLat, clusterLng] = key.split(",").map(Number);
        const distance = Math.sqrt(
          Math.pow(lat - clusterLat, 2) + Math.pow(lng - clusterLng, 2)
        );

        if (distance < clusterRadius) {
          group.push({ lat, lng });
          foundCluster = true;
          break;
        }
      }

      // Create new cluster if not found
      if (!foundCluster) {
        const key = `${lat},${lng}`;
        locationGroups[key] = [{ lat, lng }];
      }
    });

    // Create heat points with intensity based on issue count
    const heatPoints = [];
    Object.entries(locationGroups).forEach(([key, groupIssues]) => {
      const [lat, lng] = key.split(",").map(Number);
      // Intensity: minimum 0.6 for visibility, increases with count
      const intensity = Math.max(0.6, Math.min(groupIssues.length / 3, 1.0));
      heatPoints.push([lat, lng, intensity]);
    });

    // If no clustering happened, create points for all issues
    if (heatPoints.length === 0) {
      validIssues.forEach((issue) => {
        const lat = Number(issue.lat);
        const lng = Number(issue.lng);
        heatPoints.push([lat, lng, 0.7]); // Higher intensity for single points
      });
    }

    console.log(`Heatmap: Created ${heatPoints.length} heat points`);

    // ALWAYS create visible markers as fallback - made bigger
    const createMarkers = () => {
      heatPoints.forEach(([lat, lng, intensity]) => {
        const color =
          intensity > 0.8
            ? "#dc2626" // red-600
            : intensity > 0.6
            ? "#ea580c" // orange-600
            : intensity > 0.4
            ? "#ca8a04" // yellow-600
            : "#16a34a"; // green-600

        // Increased marker sizes - much bigger
        const radius = Math.max(25, intensity * 50); // Increased from 15-30 to 25-50

        // Use circle instead of circleMarker for larger sizes
        const circle = L.circle([lat, lng], {
          radius: radius * 3, // Multiply by 3 to make circles much bigger (in meters)
          fillColor: color,
          color: "#ffffff",
          weight: 4, // Increased from 3
          opacity: 0.9,
          fillOpacity: 0.7, // Slightly more transparent to see overlap
        });

        circle.addTo(map);
        markersRef.current.push(circle);
      });
      console.log(`Heatmap: Created ${markersRef.current.length} visible markers`);
    };

    // Try to create heat layer, but always show markers
    const createHeatLayer = () => {
      // Wait for plugin to be available
      const checkAndCreate = (retries = 10) => {
        const heatFn = L.heat || (window.L && window.L.heat);

        if (!heatFn && retries > 0) {
          setTimeout(() => {
            checkAndCreate(retries - 1);
          }, 300);
          return;
        }

        if (heatFn) {
          try {
            // Create heat layer with very visible and larger settings
            const heatLayer = heatFn(heatPoints, {
              radius: 120, // Increased from 60 for much bigger heat areas
              blur: 60, // Increased from 30 for smoother, larger spread
              maxZoom: 18,
              minOpacity: 0.8, // Increased opacity for better visibility
              max: 1.0,
              gradient: {
                0.0: "#3b82f6", // blue
                0.2: "#10b981", // green
                0.4: "#eab308", // yellow
                0.6: "#f97316", // orange
                0.8: "#ef4444", // red
                1.0: "#dc2626", // dark red
              },
            });

            heatLayer.addTo(map);
            heatLayerRef.current = heatLayer;
            console.log("Heatmap: Heat layer created successfully");
          } catch (error) {
            console.error("Heatmap: Error creating heat layer:", error);
          }
        } else {
          console.warn("Heatmap: Heat plugin not available, using markers only");
        }
      };

      // Start checking for plugin
      checkAndCreate();

      // Always create markers as backup/overlay
      createMarkers();
    };

    createHeatLayer();

    // Cleanup function
    return () => {
      if (heatLayerRef.current && map) {
        try {
          map.removeLayer(heatLayerRef.current);
        } catch (error) {
          console.error("Error cleaning up heat layer:", error);
        }
        heatLayerRef.current = null;
      }

      markersRef.current.forEach((marker) => {
        try {
          map.removeLayer(marker);
        } catch (error) {
          // Ignore cleanup errors
        }
      });
      markersRef.current = [];
    };
  }, [map, issues]);

  return null;
}

// Component to update map center
function MapCenterUpdater({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (center && map) {
      console.log("MapCenterUpdater: Setting view to", center, "zoom:", zoom || map.getZoom());
      try {
        map.setView(center, zoom || map.getZoom(), {
          animate: true,
          duration: 1.0
        });
      } catch (error) {
        console.error("Error setting map view:", error);
      }
    }
  }, [center, zoom, map]);
  
  return null;
}

// Component to add user location marker
function UserLocationMarker({ position, map }) {
  const markerRef = useRef(null);
  
  useEffect(() => {
    if (!map || !position || !Array.isArray(position) || position.length !== 2) {
      console.log("UserLocationMarker: Invalid position or map", position);
      return;
    }
    
    const [lat, lng] = position;
    if (isNaN(lat) || isNaN(lng)) {
      console.error("UserLocationMarker: Invalid coordinates", lat, lng);
      return;
    }
    
    // Remove existing marker
    if (markerRef.current) {
      try {
        map.removeLayer(markerRef.current);
      } catch (error) {
        console.error("Error removing marker:", error);
      }
    }
    
    console.log("UserLocationMarker: Creating marker at", lat, lng);
    
    // Create custom icon for user location with pulsing animation
    const userIcon = L.divIcon({
      className: 'user-location-marker',
      html: `
        <div style="
          width: 24px;
          height: 24px;
          background-color: #3b82f6;
          border: 4px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          animation: pulse 2s infinite;
        "></div>
        <style>
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.3); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
        </style>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
    
    // Create marker
    try {
      const marker = L.marker([lat, lng], { icon: userIcon });
      marker.addTo(map);
      marker.bindPopup(`
        <div style="text-align: center; padding: 4px;">
          <strong>📍 Your Current Location</strong><br/>
          <small>Lat: ${lat.toFixed(6)}<br/>Lng: ${lng.toFixed(6)}</small>
        </div>
      `);
      markerRef.current = marker;
      console.log("UserLocationMarker: Marker created successfully");
    } catch (error) {
      console.error("Error creating user location marker:", error);
    }
    
    return () => {
      if (markerRef.current && map) {
        try {
          map.removeLayer(markerRef.current);
        } catch (error) {
          console.error("Error cleaning up marker:", error);
        }
        markerRef.current = null;
      }
    };
  }, [map, position]);
  
  return null;
}

// Component to handle map instance
function MapContent({ issues, userLocation, mapCenter, mapZoom }) {
  const map = useMap();

  return (
    <>
      <HeatmapLayer issues={issues} map={map} />
      {userLocation && <UserLocationMarker position={userLocation} map={map} />}
      {mapCenter && <MapCenterUpdater center={mapCenter} zoom={mapZoom} />}
    </>
  );
}

export default function Heatmap() {
  const [mapType, setMapType] = useState("street");
  const [mapInstance, setMapInstance] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [mapZoom, setMapZoom] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const {
    data: issues,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["heatmap"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/issues/all");
        console.log(`Heatmap: Received ${data?.length || 0} issues from API`);
        
        // Filter and normalize coordinates
        const filtered = (data || [])
          .map((issue) => ({
            ...issue,
            lat: Number(issue.lat),
            lng: Number(issue.lng),
          }))
          .filter(
            (issue) =>
              issue.lat &&
              issue.lng &&
              !isNaN(issue.lat) &&
              !isNaN(issue.lng) &&
              issue.lat !== 0 &&
              issue.lng !== 0 &&
              issue.lat >= -90 &&
              issue.lat <= 90 &&
              issue.lng >= -180 &&
              issue.lng <= 180
          );
        
        console.log(`Heatmap: Filtered to ${filtered.length} valid issues`);
        return filtered;
      } catch (error) {
        console.error("Error fetching issues for heatmap:", error);
        return [];
      }
    },
    retry: 2,
    refetchOnWindowFocus: false,
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
    issues?.map((i) => `${Number(i.lat)?.toFixed(4)},${Number(i.lng)?.toFixed(4)}`) || []
  ).size;



  // Get current location function
  const getCurrentLocation = () => {
    // Check if geolocation is supported
    if (!("geolocation" in navigator)) {
      setLocationError("Geolocation is not supported by your browser");
      setGettingLocation(false);
      return;
    }

    setGettingLocation(true);
    setLocationError(null);
    console.log("Requesting geolocation...");

    // Use watchPosition with clearWatch for better reliability
    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 15000, // Increased timeout to 15 seconds
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = [latitude, longitude];
        
        console.log("Location obtained:", latitude, longitude);
        
        setUserLocation(location);
        setMapCenter(location);
        setMapZoom(15); // Zoom in closer when showing user location
        
        // Also update map instance directly if available
        if (mapInstance) {
          mapInstance.setView(location, 15);
          console.log("Map centered on user location");
        }
        
        setGettingLocation(false);
        setLocationError(null);
      },
      (error) => {
        setGettingLocation(false);
        let errorMessage = "Unable to retrieve your location";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions in your browser settings and try again.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable. Please check your device settings.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
          default:
            errorMessage = `Location error: ${error.message || "Unknown error"}`;
            break;
        }
        
        setLocationError(errorMessage);
        console.error("Geolocation error:", error);
      },
      geoOptions
    );
  };

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

        {/* Current Location Button */}
        <div className="mb-4 border-b border-gray-200 pb-4">
          <h3 className="text-xs font-semibold text-[#003865] mb-2 uppercase tracking-wide">
            Location
          </h3>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Get current location button clicked");
              getCurrentLocation();
            }}
            disabled={gettingLocation}
            type="button"
            className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded border text-sm font-medium transition-colors ${
              gettingLocation
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-[#3b82f6] text-white border-[#3b82f6] hover:bg-[#2563eb] hover:border-[#2563eb] active:bg-[#1d4ed8]"
            }`}
            aria-label="Get current location"
          >
            {gettingLocation ? (
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
                <span>Getting location...</span>
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                <span>My Current Location</span>
              </>
            )}
          </button>
          
          {/* Location Error Message */}
          {locationError && (
            <div className="mt-2 p-2 bg-red-50 border border-red-300 rounded text-xs text-red-700">
              <div className="flex items-start gap-2">
                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>{locationError}</span>
              </div>
            </div>
          )}
          
          {/* Success Message */}
          {userLocation && !gettingLocation && !locationError && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                <span>Location found! Map centered on your position.</span>
              </div>
            </div>
          )}
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
              <span>1 issue</span>
              <span>3+ issues</span>
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
            {mapInstance && issues && (
              <MapContent
                issues={issues}
                userLocation={userLocation}
                mapCenter={mapCenter}
                mapZoom={mapZoom}
              />
            )}
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
