"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const hazardIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Hazard {
  id: string;
  latitude: number;
  longitude: number;
  description: string;
  timestamp: number;
}

function RecenterOnNewHazard({ hazards }: { hazards: Hazard[] }) {
  const map = useMap();
  useEffect(() => {
    if (hazards.length > 0) {
      const latest = hazards[hazards.length - 1];
      map.flyTo([latest.latitude, latest.longitude], map.getZoom(), {
        duration: 1,
      });
    }
  }, [hazards, map]);
  return null;
}

export default function HazardMap({ hazards }: { hazards: Hazard[] }) {
  const center: [number, number] =
    hazards.length > 0
      ? [hazards[hazards.length - 1].latitude, hazards[hazards.length - 1].longitude]
      : [30.2849, -97.7341];

  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RecenterOnNewHazard hazards={hazards} />
      {hazards.map((h) => (
        <Marker key={h.id} position={[h.latitude, h.longitude]} icon={hazardIcon}>
          <Popup>
            <div style={{ maxWidth: 250 }}>
              <p style={{ fontSize: 13, lineHeight: 1.5, margin: 0 }}>{h.description}</p>
              <p style={{ fontSize: 11, color: "#888", marginTop: 6 }}>
                {new Date(h.timestamp).toLocaleString([], {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
