import React from 'react';
import { GiCctvCamera } from "react-icons/gi";
import { MdRemoveRedEye,MdSensors,MdSettings,MdInfo,MdCalendarMonth } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import { ModalContentType } from '../../constants/ModalContentTypes';


const iconAndTypeMap = {
    'Caméras': { label:'Caméras',icon: <GiCctvCamera className='dropdownmenu-icon'/>, type: ModalContentType.Cameras },
    'Détecteurs': { label:'Détecteurs', icon: <MdRemoveRedEye className='dropdownmenu-icon'/>, type: ModalContentType.Detectors },
    'Contrôleurs': { label:'Contrôleurs',icon: <MdSensors className='dropdownmenu-icon'/>, type: ModalContentType.Controllers },
    'Paramètres': {label:'Paramètres',icon: <MdSettings className='dropdownmenu-icon'/>, type: ModalContentType.Settings },
    'Utilisateurs': { label:'Utilisateurs',icon: <FaUserGroup className='dropdownmenu-icon'/>, type: ModalContentType.Users },
    'Info': {label:'Info', icon: <MdInfo className='dropdownmenu-icon'/>, type: ModalContentType.Info },
    'Evenements': {label:'Evenements', icon: <MdCalendarMonth className='dropdownmenu-icon'/>, type: ModalContentType.Events }
};

const DropUpMenu = ({ options,onSelect }) => {

 
    return (
        <div className="drop-up-menu">
            {options.map((option, index) => (
                <div key={index} className="menu-option" onClick={() => onSelect(iconAndTypeMap[option])}>
                    {iconAndTypeMap[option].icon}{option}
                </div>
            ))}
        </div>
    );
};

export default DropUpMenu;
