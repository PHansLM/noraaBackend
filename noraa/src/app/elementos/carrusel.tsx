import { useEffect, useState } from 'react';

const Carrusel = () => {
    const [windowSize, setWindowSize] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowSize(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const renderImages = () => {
        const isMobile = windowSize < 768; // Tamaño de pantalla móvil

        return (
            <div className="grid lg:grid-cols-4 grid-cols-2 gap-2 pt-3 mt-4">
                {[1, 2, 3, 4].map((index) => (
                    <div className="flex justify-center" key={index}>
                        <img
                            className="h-auto max-w-full rounded-lg"
                            style={{ maxWidth: isMobile ? "190px" : "none", width: "95%" }}
                            src={`https://flowbite.s3.amazonaws.com/docs/gallery/square/image-${index}.jpg`}
                            alt={`Image ${index}`}
                        />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="lg:flex lg:justify-center">
            {renderImages()}
        </div>
    );
};

export default Carrusel;
