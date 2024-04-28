"use client";
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import useUserLocation from '../utiles/geolocalizadores/useUserLocation';
import 'leaflet/dist/leaflet.css';
import useGeocoder from '../utiles/geolocalizadores/Geocoder';
import TagPopup from '../elementos/TagPopUp';
Modal.setAppElement('#root'); // Necesario para evitar advertencias de accesibilidad

const RegistroAvistamiento: React.FC = () => {
    const [primerUso, setPrimerUso] = useState(true);
    const userLocation = useUserLocation();
    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState<string>(''); 
    const [latitud, setLatitud] = useState(0);
    const [longitud, setLongitud] = useState(0);  
    const [imagen, setImagen] = useState<string>('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [intentoSumbit, setIntentoSumbit] = useState(false);
    const { direccion: direccionGeocoder } = useGeocoder({ lat: latitud, lng: longitud });

    const [selectedFile, setSelectedFile] = useState<File | null>(null); // Definición de selectedFile

    useEffect(() => {
        if (primerUso && userLocation?.lat !== undefined && userLocation?.lng !== undefined) {
            setLatitud(userLocation.lat);
            setLongitud(userLocation.lng);
            setPrimerUso(false);
        }
    }, [primerUso, userLocation]);

    useEffect(() => {
        setDireccion(direccionGeocoder);
    }, [direccionGeocoder]);

    const MapEventHandler = () => {
        const map = useMapEvents({
            moveend: () => {
                const center = map.getCenter();
                const latC = parseFloat(center.lat.toFixed(5));
                const lngC = parseFloat(center.lng.toFixed(5));
                setLatitud(latC);
                setLongitud(lngC);
            },
        });
        return null;
    };

    const [registroExitoso, setRegistroExitoso] = useState(false);
    const [contador, setContador] = useState(10);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (registroExitoso) {
            interval = setInterval(() => {
                setContador((prevContador) => prevContador - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [registroExitoso]);

    useEffect(() => {
        if (contador === 0) {
            window.close();
        }
    }, [contador]);

    const playSuccessSound = () => {
        const audio = new Audio('correcto.mp3');
        audio.play();
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!nombre || !direccion || !imagen) {
            setIntentoSumbit(true);
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/avistamientos-registrar', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre_restaurante: nombre,
                    direccion: direccion,
                    coordenada_longitud: longitud,
                    coordenada_latitud: latitud,
                    valoracion: 0.0,
                    imagen: imagen // Envía la imagen base64 al backend
                })
            });
            if (response.ok) {
                console.log('Restaurante registrado exitosamente');
                setRegistroExitoso(true);
                playSuccessSound();  
            } else {
                console.error('Error al registrar el restaurante:', response.statusText);  
            }
        } catch (error) {
            console.error('Error al registrar el restaurante:', error);   
        }
    };
    
    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleFileUpload = (files: FileList | null) => {
        if (files && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target) {
                    const fileContent = event.target.result as string; // Contenido del archivo en formato base64
                    setImagen(fileContent); // Almacena la imagen como base64 en lugar de un array de bytes
                    // Ahora puedes enviar la imagen base64 al backend
                }
            };
            reader.readAsDataURL(file);
            setSelectedFile(file); // Asigna el archivo seleccionado a selectedFile
        }
    };

    return (
        <div className={`min-h-screen ${registroExitoso ? 'bg-green-500' : 'bg-orange-700'} text-gray-900 flex justify-center`}>
            <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
                    <div>
                        <h1 className="font-bold text-2xl mt-2">Registra un avistamiento</h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mt-1 flex flex-col items-center">
                            <div className="w-full flex-1 mt-7">
                                <div className="mx-auto max-w-xs">
                                    <h1 className="font-semibold mt-7">Nombre del avistamiento</h1>
                                    <input
                                        className={`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 ${intentoSumbit && !nombre && 'border-red-500'}`}
                                        type="text"
                                        placeholder="Ingresa el nombre del avistamiento"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                    />
                                    {intentoSumbit && !nombre && <p className="text-red-500">Campo obligatorio</p>}
                                    
                                    <h1 className="font-semibold mt-5">Direccion</h1>
                                    <button
                                        className="mt-7 tracking-wide font-semibold bg-orange-400 text-white w-full py-4 rounded-3xl hover:bg-orange-500 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                        onClick={openModal}
                                    >
                                        <svg className="ml-7 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                            <path fill="#ffffff" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                        </svg>
                                        <span>{direccion}</span>
                                    </button>
                                    <div className="mt-5">
                                       <h1 className="font-semibold mt-7">Cargar imagenes del avistamiento</h1>
                                       <label
                                           htmlFor="logoInput"
                                           className={`ml-16 mt-7 cursor-pointer inline-block ${selectedFile ? 'bg-green-400' : 'bg-gray-100'} border border-black text-black px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-blue-200`}
                                        >
                                             {selectedFile ? "Imagen Seleccionada" : "Seleccionar Imagenes"}
                                       </label>
                                       <input
                                          id="logoInput"
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => handleFileUpload(e.target.files)}
                                          className="hidden"
                                        />
                                        {selectedFile && (
                                            <p className="mt-2">{selectedFile.name}</p>
                                        )}
                                       </div>
                                    <div className="flex mt-2">
                                    </div>
                                    <button
                                        className="text-white mt-28 tracking-wide font-semibold bg-orange-400 text-white-500 w-full py-4 rounded-lg hover:bg-orange-500 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                        type="submit"
                                    >
                                        <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                            <path fill="#ffffff" d="M96 80c0-26.5 21.5-48 48-48H432c26.5 0 48 21.5 48 48V384H96V80zm313 47c-9.4-9.4-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L409 161c9.4-9.4 9.4-24.6 0-33.9zM0 336c0-26.5 21.5-48 48-48H64V416H512V288h16c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V336z" />
                                        </svg>
                                        <span className="ml-2">
                                            Registrar
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="flex-1 bg-green-100 text-center hidden lg:flex rounded-lg"
                    style={{ backgroundImage: "url('chorizo.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <div className="m-12 xl:m-16 w-full" />
                </div>
            </div>
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={{ overlay: { zIndex: 1000, backgroundColor: 'rgba(0, 0, 0, 0.5)' }, content: { position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', border: 'none', background: 'transparent', padding: '0', display: 'flex', justifyContent: 'center', alignItems: 'center' } }}>
                <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: '1000' }}>
                    <h1 style={{ position: 'absolute', top: '10px', left: '10px' }}>Latitud: {latitud}</h1>
                    <h1 style={{ position: 'absolute', top: '40px', left: '10px' }}>Longitud: {longitud}</h1>
                    <button 
                            className="mb-3 mr-4 accept-button mt-3 tracking-wide font-semibold bg-orange-400 text-white py-3 px-5 rounded-3xl hover:bg-orange-500 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none" 
                            style={{ position: 'absolute', bottom: '20px', right: '10px', zIndex: '1100' }} 
                            onClick={closeModal}
                            >
                            Aceptar
                            </button>
                    <MapContainer center={[latitud, longitud]} zoom={13} style={{ width: '100%', height: '100%', zIndex: '1' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <MapEventHandler />
                    </MapContainer>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '1000' }}>
                        <img src="miUbi.png" alt="icono" style={{ width: '32px', height: '32px' }} />
                    </div>
                </div>
            </Modal>
            {registroExitoso && (
                <div className="fixed bottom-0 left-0 w-full bg-green-500 flex justify-center items-center p-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">¡Avistamiento registrado exitosamente!</h1>
                        <p className="text-white">{`Cerrando la página automáticamente en ${contador} segundos`}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegistroAvistamiento;
