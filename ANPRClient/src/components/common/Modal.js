import React, { useState ,useEffect } from 'react';
import { ModalContentType } from '../../constants/ModalContentTypes';
import {CameraForm, CamerasPage} from '../crud/Camera';
import { MdClose } from "react-icons/md";
import { DetectorPage ,DetectorForm} from '../crud/Detector';
import { useDetectors } from '../../contexts/DetectorContext';
import Events from '../Journal';

const Modal = ({ isVisible, onClose,openModal, contentType,label,icon ,initialData}) => {
    
    //const {addCamera , editCamera} = useCameras();
    const {addDetector,editDetector} = useDetectors()
    //const [temporaryCamera, setTemporaryCamera] = useState(null);
    const [temporaryDetector, setTemporaryDetector] = useState(null);
    const [enabled, setEnabled] = useState(true);

    console.log(contentType," Modal opened with data ",initialData);
    
    useEffect(() => {
        if (contentType === ModalContentType.AddDetector || contentType === ModalContentType.AddCamera ) 
            setEnabled(false); 
        else 
            setEnabled(true); 
        
    }, []);
    if (!isVisible) return null;
    
    const modalContent = () =>{
        switch (contentType){
            case ModalContentType.Cameras:
                return <CamerasPage openModal={openModal}/>;
            case ModalContentType.AddCamera:
                return <CameraForm onConfirmed={setEnabled} />;
            case ModalContentType.EditCamera:
                return <CameraForm initialData={initialData} onConfirmed={setEnabled}/>;
            case ModalContentType.Detectors:
                return <DetectorPage openModal={openModal}/>;
            case ModalContentType.AddDetector:
                return <DetectorForm onSave={setTemporaryDetector} onConfirmed={setEnabled}/>;
            case ModalContentType.EditDetector:
                return <DetectorForm onSave={setTemporaryDetector} initialData={initialData} onConfirmed={setEnabled} />;
            case ModalContentType.Events:
                return <Events />;
            default:
                return <div>No content</div>
        }
    }
    const handleSave = () => {
        // if (contentType === ModalContentType.AddCamera && temporaryCamera) {
        //     const {label , url } = temporaryCamera; 
        //     addCamera({label , url});
        // }
        // else if (contentType === ModalContentType.EditCamera && temporaryCamera) {
        //     console.log("temp",temporaryCamera);
        //     editCamera(temporaryCamera);
        // }
        // else 
        if(contentType === ModalContentType.AddDetector && temporaryDetector){
            addDetector(temporaryDetector);
        }
        else if(contentType === ModalContentType.EditDetector && temporaryDetector){
            editDetector(temporaryDetector);
        }
        onClose();
    };
    return (
        <div className="modal-overlay" >
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <button className="close-button" onClick={onClose}>
                        <MdClose className="icon" />
                    </button>
                </div>
                <div className="modal-body">
                {label &&<div className="label">
                    {icon}
                    <h2>{label}</h2>
                </div>}
                    {modalContent()}
                </div>
                <div className="modal-footer">
                    <button onClick={onClose}>Annuler</button>
                    <button onClick={handleSave} disabled= {!enabled} >OK</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
