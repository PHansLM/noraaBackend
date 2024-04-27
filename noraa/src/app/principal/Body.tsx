"use client";
import React, { useState } from 'react';
import MapPanel from '../mapas/MapPanel';
import useUserLocation from '../utiles/geolocalizadores/useUserLocation';
import Geocoder from '../utiles/geolocalizadores/Geocoder';
import Carrusel from '../carrusel';
import PiePagina from './piePagina'
import useGeocoder from '../utiles/geolocalizadores/Geocoder';
import DashboardCercanos from '../elementos/dashboardCercanos';

const Body = () => {
    const [showMap, setShowMap] = useState(false);
    const userLocationLat = useUserLocation()?.lat;
    const userLocationLng = useUserLocation()?.lng;
    const { direccion } = useGeocoder({ lat: userLocationLat?userLocationLat:0 , lng: userLocationLng?userLocationLng:0 });

    const handleShowMap = () => {
        setShowMap(!showMap);
    };

    return (
        <>
            <button 
                className="mt-6 w-30 h-12 flex items-center space-x-2 bg-orange-400 text-white px-4 py-2 rounded-full mx-auto sm:float-right sm:mr-12 hover:bg-orange-500"
                onClick={handleShowMap}
            >
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                    <path fill="#ffffff" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
                <span>{direccion}</span>
            </button>

            {showMap ? (
                <MapPanel centro={[(userLocationLat!=null)?userLocationLat:0.0, (userLocationLng!=null)?userLocationLng:0.0]}/>
            ) : (
                <>
                    <h1 className="lg:font-bold lg:ml-8 lg:mt-11 xl:text-2xl font-bold mt-5 ml-3 text-lg">¿Qué buscas hoy?</h1> 
                    <h1> <Carrusel></Carrusel></h1>
                    <h1 className="lg:font-bold lg:ml-8 lg:mt-11 xl:text-2xl font-bold mt-5 ml-3 text-lg">Negocios cercanos a ti</h1> 
                    <DashboardCercanos centro={[(userLocationLng!=null)?userLocationLng:0.0, (userLocationLat!=null)?userLocationLat:0.0]} /> 
                    <PiePagina />



                </>
            )}
        </>      
    );
}

export default Body;
