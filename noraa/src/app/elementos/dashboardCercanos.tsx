import { useEffect, useState } from "react";
import ImgConstructor from "../utiles/multimedia/ImgConstructor";
import {cargarCercanos} from '../utiles/consultores/restaurantes';

interface MapPanelProps {
    centro: [number, number];
}

const DashboardCercanos = ({ centro }: MapPanelProps) => {
    const [restaurantesC, setRestaurantesC] = useState<any[]>([]);

    useEffect(() => {
        const [latitud, longitud] = centro;
    
        cargarCercanos(latitud, longitud)
          .then(data => {
            setRestaurantesC(data);
          }
        ).catch(error => {
            console.error('Error al cargar los restaurantes cercanos en el dashboard de cercanos:', error);
          }
        );

    }, [centro]);

    return (
        <div className="mt-1 ml-1 mr-1 bg-white" style={{ height: 'auto', width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
    {restaurantesC.map((restaurante) => (
        <div key={restaurante.id_restaurante} className="card" style={{ height: 'auto', width: '45%', margin: '2%', padding: '10px', border: '1px solid black', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            {restaurante.imagen && (
                        <ImgConstructor imgBytea={restaurante.imagen} height="100px" width="100px"/>
            )}
            <div style={{ marginTop: 'auto' }}>
                <h3 className="font-bold">{restaurante.nombre_restaurante}</h3>
                <p>{restaurante.horario_atencion}</p>
                <p>{restaurante.valoracion}</p>
            </div>
        </div>
    ))}
</div>

    );
};

export default DashboardCercanos;




