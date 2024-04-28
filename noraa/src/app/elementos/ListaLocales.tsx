"use client";
import React, { useEffect, useState } from 'react';
import ImgConstructor from "../utiles/multimedia/ImgConstructor";
import { cargarRestaurantesConEtiqueta } from "../utiles/consultores/restaurantes";

const ListaLocales: React.FC<{ etiqueta: string }> = ({ etiqueta }) => {
    const [locales, setLocales] = useState<any[]>([]);
    useEffect(() => {
        cargarRestaurantesConEtiqueta(etiqueta)
            .then(data => {
            setLocales(data);
            }
        ).catch(error => {
            console.error('Error al cargar todos los restaurantes:', error);
            }
        );
    });
  return (
    <div className="mt-1 ml-1 mr-1 bg-white" style={{ height: 'auto', width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
      {locales.map((local) => (
        <div key={local.id_restaurante} className="card" style={{ height: 'auto', width: '45%', margin: '2%', padding: '10px', border: '1px solid black', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          {local.imagen && (
            <ImgConstructor imgBytea={local.imagen} height="100px" width="100px"/>
          )}
          <div style={{ marginTop: 'auto' }}>
            <h3 className="font-bold">{local.nombre_restaurante}</h3>
            <p>{local.horario_atencion}</p>
            <p>{local.valoracion}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListaLocales;
