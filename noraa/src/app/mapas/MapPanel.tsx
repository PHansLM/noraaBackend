import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker,Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import ImgConstructor from '../utiles/multimedia/ImgConstructor';
import {cargarRestaurantes, cargarCercanos} from '../utiles/consultores/restaurantes';
import {cargarAvistamientos} from '../utiles/consultores/avistamientos';

interface MapPanelProps {
  centro: [number, number];
}

  const MapPanel: React.FC<MapPanelProps> = ({ centro }: MapPanelProps) => {
    const [restaurantes, setRestaurantes] = useState<any[]>([]);
    const [avistamientos, setAvistamientos] = useState<any[]>([]);

    useEffect(() => {
        const [latitud, longitud] = centro;

    // Cargar todos los restaurantes
        cargarRestaurantes()
          .then(data => {
            setRestaurantes(data);
          }
        ).catch(error => {
            console.error('Error al cargar todos los restaurantes:', error);
          }
        );

        cargarAvistamientos()
          .then(data=>{
            setAvistamientos(data);
          }
        ).catch(error => {
          console.error('Error al cargar avistamientos en el map Panel',error); 
          }
        );
        

    }, [centro]);


  return (
    <div>
      <div style={{ height: '70vh', width: '100%' }}>
        <MapContainer center={centro} zoom={16} minZoom={10} maxZoom={20} maxBounds={[[-90, -180], [90, 180]]} style={{ height: '90%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Circle center={centro} radius={700} />
          <Marker position={centro} icon={L.icon({
            iconUrl: 'ubActual.png',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -16],
          })} />
            
          {/* Marcadores de restaurantes */}
          {restaurantes.map((restaurante) => (
            <Marker
              key={restaurante.id_restaurante}
              position={[restaurante.coordenada_latitud, restaurante.coordenada_longitud]}
              icon={L.icon({
                iconUrl: restaurante.icono_base + ".png",
                iconSize: [32, 32],
                iconAnchor: [16, 16],
                popupAnchor: [0, -16],
              })}
            >
              <Popup>
                <div>
                    <h3>{restaurante.nombre_restaurante }</h3>
                    <ImgConstructor imgBytea={restaurante.imagen} height='80px' width='80px'/>
                </div>
              </Popup>
            </Marker>
           ))
          }

          {avistamientos.map((avistamiento) => (
            <Marker
              key={avistamiento.id_avistamiento}
              position={[avistamiento.coordenada_latitud, avistamiento.coordenada_longitud]}
              icon={L.icon({
                iconUrl: avistamiento.icono + ".png",
                iconSize: [32, 32],
                iconAnchor: [16, 16],
                popupAnchor: [0, -16],
              })}
            >
              <Popup>
                <div>
                    <h3>{avistamiento.nombre_restaurante }</h3>
                    <ImgConstructor imgBytea={avistamiento.foto} height='80px' width='80px'/>
                </div>
              </Popup>
            </Marker>
           ))
          }

        </MapContainer>
      </div>
    </div>
  );
};

export default MapPanel;
