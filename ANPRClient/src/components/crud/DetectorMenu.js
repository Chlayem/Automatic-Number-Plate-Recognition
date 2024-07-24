import React, { useRef, useEffect } from 'react';
import { ModalContentType } from '../../constants/ModalContentTypes';


const typeMap = {
    "Détecteur d'objets" : { label :"Détecteur d'objets" , type:ModalContentType.AddObjectDetector } ,
    "Détecteur de vehicules" : { label :"Détecteur de vehicules" , type:ModalContentType.AddVehiculeDetector } ,
    "Détecteur de plaques" : { label :"Détecteur de plaques" , type:ModalContentType.AddPlateDetector }
}
export const DetectorMenu = ({ onSelect,onOutsideClick  }) => {
    
    console.log("Detector Menu")

    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onOutsideClick();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onOutsideClick]);
    return (
        <div ref={menuRef}  className="detector-menu">
            {Object.entries(typeMap).map(([key,item], index) => (
                <div key={index} className="menu-item" onClick={() => onSelect(item)}>
                    {item.label}
                </div>
            ))}
        </div>
    );
};
