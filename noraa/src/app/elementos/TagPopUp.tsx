import React, { useState, useEffect } from 'react';
import { cargarEtiquetas } from '../utiles/consultores/etiquetas';

interface TagPopupProps {
    selectedTags: string[];
    onUpdateTags: (tags: string[]) => void;
    onClose: () => void;
}

const TagPopup: React.FC<TagPopupProps> = ({ selectedTags, onUpdateTags, onClose }) => {
    const [tags, setTags] = useState<any[]>([]);

    useEffect(() => {
        cargarEtiquetas()
            .then(data => {
                setTags(data);
            })
            .catch(error => {
                console.error('Error al cargar los tags:', error);
            });
    }, []);

    useEffect(() => {
        console.log('selectedTags actualizados:', selectedTags);
    }, [selectedTags]);

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            onUpdateTags(selectedTags.filter(t => t !== tag));
        } else {
            onUpdateTags([...selectedTags, tag]);
        }
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Seleccionar etiquetas</h2>
                <div className="flex flex-wrap">
                    {tags.map(tag => (
                        <button 
                            key={tag.id_etiqueta}
                            className={`mr-4 mb-4 px-4 py-2 rounded-lg border ${selectedTags.includes(tag.id_etiqueta+'') ? 'bg-gray-400 text-white' : 'border-gray-300'}`}
                            onClick={() => toggleTag(tag.id_etiqueta+"")}
                            type="button"
                        >
                            {tag.etiqueta_nombre}
                        </button>
                    ))}
                </div>
                <button 
                    className="mt-4 px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500"
                    onClick={onClose} 
                >
                    Aceptar
                </button>
            </div>
        </div>
    );
};

export default TagPopup;
