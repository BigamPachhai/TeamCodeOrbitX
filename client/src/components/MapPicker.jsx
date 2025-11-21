import { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function MapPicker({
  lat,
  lng,
  setLat,
  setLng,
  setLocationName,
}) {
  const [position, setPosition] = useState(null);
  const markerRef = useRef(null);

  // Update position when lat/lng props change
  useEffect(() => {
    if (lat && lng) {
      setPosition([parseFloat(lat), parseFloat(lng)]);
    }
  }, [lat, lng]);

  // Component to handle map events
  function LocationMarker() {
    const map = useMap();

    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setLat(lat);
        setLng(lng);
        setPosition([lat, lng]);

        // Reverse geocode to get location name
        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        )
          .then((res) => res.json())
          .then((data) => {
            if (setLocationName && data.display_name) {
              setLocationName(data.display_name);
            }
          })
          .catch((err) => console.error("Geocoding error:", err));
      },
    });

    // Center map when position changes
    useEffect(() => {
      if (position) {
        map.flyTo(position, 15);
      }
    }, [position, map]);

    return position ? (
      <Marker
        position={position}
        draggable={true}
        ref={markerRef}
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target;
            const pos = marker.getLatLng();
            setLat(pos.lat);
            setLng(pos.lng);
            setPosition([pos.lat, pos.lng]);

            // Reverse geocode to get location name
            fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${pos.lat}&lon=${pos.lng}&format=json`
            )
              .then((res) => res.json())
              .then((data) => {
                if (setLocationName && data.display_name) {
                  setLocationName(data.display_name);
                }
              })
              .catch((err) => console.error("Geocoding error:", err));
          },
        }}
      />
    ) : null;
  }

  return (
    <div className="space-y-3">
      <div className="w-full h-80 rounded-lg overflow-hidden border-2 border-gray-300 shadow-lg">
        <MapContainer
          center={position || [27.6842, 83.4323]} // Default to Butwal center
          zoom={position ? 15 : 12}
          className="w-full h-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker />
        </MapContainer>
      </div>

      <p className="text-sm text-gray-600 text-center">
        💡 Click on the map or drag the marker to select a location
      </p>
    </div>
  );
}
