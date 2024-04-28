import React from "react";
import { MapContainer, TileLayer, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapView = ({ center }) => {
  return (
    <MapContainer center={center} zoom={23}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Circle center={center} radius={500} /> {/* Radio en metros */}
    </MapContainer>
  );
};

export default MapView;
