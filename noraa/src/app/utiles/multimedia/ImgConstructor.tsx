import React from 'react';

interface ImgConstructorProps {
    imgBytea: string;
    width?: string; // Anchura deseada de la imagen
    height?: string; // Altura deseada de la imagen
}

const ImgConstructor: React.FC<ImgConstructorProps> = ({ imgBytea, width, height}) => {
    const construirUrlImagen = (imgBytea: string) => {
        // Convertir cadena base64 a un ArrayBuffer
        const arrayBuffer = Buffer.from(imgBytea, 'base64').buffer;
        // Crear un Blob a partir del ArrayBuffer
        const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
        // Crear una URL para el Blob
        return URL.createObjectURL(blob);
    };

    return <img src={construirUrlImagen(imgBytea)} style={{ width: width, height: height }} />;
};

export default ImgConstructor;
