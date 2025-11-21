import { MapContainer, TileLayer } from "react-leaflet";
import api from "../api/axios";
import { useQuery } from "@tanstack/react-query";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

export default function Heatmap() {
  const { data: issues } = useQuery({
    queryKey: ["heatmap"],
    queryFn: async () => {
      const { data } = await api.get("/issues/all");
      return data;
    },
  });

  return (
    <div className="w-full h-screen">
      <MapContainer
        center={[27.6842, 83.4323]}
        zoom={11}
        className="h-full w-full"
        whenCreated={(map) => {
          if (issues) {
            const heatPoints = issues.map((i) => [i.lat, i.lng, 0.5]);
            L.heatLayer(heatPoints, { radius: 25 }).addTo(map);
          }
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </div>
  );
}
