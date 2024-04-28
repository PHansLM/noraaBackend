import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  centro: [number, number];
  zoom: number;
  height: string;
  width: string;
}

const Mapa: React.FC<MapProps> = ({ centro, zoom, height, width }: MapProps) => {
  return (
    <MapContainer center={centro} zoom={zoom} style={{ height, width }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
  );
};

export default Mapa;
