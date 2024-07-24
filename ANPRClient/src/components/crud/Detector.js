import { useState , useEffect } from "react";
import CrudTable from "../common/CrudTable";
import { useDetectors } from "../../contexts/DetectorContext";
import { MoonLoader } from 'react-spinners';
import { useCameras } from "../../contexts/CameraContext";
import { ModalContentType } from "../../constants/ModalContentTypes";
import { MdRemoveRedEye} from "react-icons/md";

export const DetectorPage = ({openModal}) => {

    const {detectors,removeDetector,loading} = useDetectors();
    const detectorColumns = [
        { key: 'id', label: 'N°' },
        { key: 'label', label: 'Libellé' },
        { key: 'cameraId', label: 'Caméra' },
        { key: 'active', label: 'Active' },
    ];
    if(loading){
        return <div className="loader"><MoonLoader color="#999" size={30} /></div>;
    }
    const handleAddDetector = () => {
        openModal(ModalContentType.AddDetector,null,"Détecteur",<MdRemoveRedEye className='dropdownmenu-icon'/>);
    };

    // const handleSelectType = (item) => {
    //     console.log('Type selected:', item.type);
    //     openModal(item.type,null,item.label);
    //     setShowDropUp(false);
    // };
    // const handleCloseDropUp = () => {
    //     setShowDropUp(false); 
    // };

    const EditDetector = (detector) => {
        openModal(ModalContentType.EditDetector,detector,"Détecteur",<MdRemoveRedEye className='dropdownmenu-icon'/>)
    };

    const RemoveDetector = (detectorId) => {
        // seDetectorData(currentData => currentData.filter(detector => detector.id !== detectorId));
        removeDetector(detectorId);
        console.log('Removing detector', detectorId);
    };

    return (
        <CrudTable
            data={detectors}
            columns={detectorColumns}
            onAdd={handleAddDetector}
            onEdit={EditDetector}
            onRemove={RemoveDetector}
            // showDropUp={showDropUp}
            // onSelectType={handleSelectType}
            // onOutsideClick={handleCloseDropUp}
        />
    );
};

export const DetectorForm = ({onSave,initialData,onConfirmed})=>{
    const { cameras } = useCameras();
    const [detector,setDetector] = useState({id:null, label:'' ,active : false , cameraId:'',ocrConfidence:'0',vehiculeConfidence :'0'});
    
    useEffect(() => {
        if (initialData) {
            console.log('use effect initial Data ',initialData);
            setDetector(initialData); 
        }
        //console.log("Detector",detector);
    }, [initialData]);

    const handleChange = (event) => {
        const { name, type,value,checked } = event.target;
    
        setDetector(prev => ({ ...prev,[name]: type === 'checkbox' ? checked : value    }));
        onConfirmed(false);

    };
    const handleSubmit = (event) => {
        event.preventDefault();
        const updatedDetector = {
            ...detector,
            cameraId: detector.cameraId === '' ? null : detector.cameraId,
            vehiculeConfidence:parseFloat(detector.vehiculeConfidence) || 0.25,
            ocrConfidence:parseFloat(detector.ocrConfidence) || 0.25
        };
        onSave(updatedDetector);
        onConfirmed(true);
    };
    //console.log("Cameras:",cameras);
    return (
        <form onSubmit={handleSubmit} className="detector-form">
            <div className="first-column">

                <InputField label="Libellé" value={detector.label} name = "label" onChange={handleChange} />
                <SelectField 
                    label="Camera" 
                    options={[{ id: '', label: 'Select a camera' },...cameras.map(camera =>({
                        id : camera.id,
                        label : camera.label
                    }))]} 
                    name="cameraId"
                    value={detector.cameraId}
                    onChange={e => handleChange({ target: { name: 'cameraId', value: e.target.value } })}
                />
                <div className="precision">
                    <InputField className="precision-input" label="Precision de Vehicule Minimale" value={String(detector.vehiculeConfidence)} name= "vehiculeConfidence" onChange={handleChange} />
                    <InputField className="precision-input" label="Precision de Texte Minimale" value={String(detector.ocrConfidence)} name= "ocrConfidence" onChange={handleChange} />
                </div>
                <button type="submit">Confirmer</button>

            </div>
            <div className="second-column">
                <CheckboxField label="Active" checked={detector.active}  name= "active" onChange={handleChange} />
            </div>
        </form>
    );


};

const InputField = ({ label, value, name,onChange }) => (
    <div className="detector-input-group">
        <label>{label}</label>
        <input type="text" value={value} name={name} onChange={onChange} />
    </div>
);

const SelectField = ({ label, options, name,value, onChange }) => (
    <div className="detector-input-group">
        <label>{label}</label>
        <select name={name} value={value} onChange={onChange}>
            {options.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
        </select>
    </div>
);

const CheckboxField = ({ label, checked, name,onChange }) => (
    <div className="check-button">
        <label>
            <input type="checkbox" checked={checked} name={name} onChange={onChange} />
            {label}
        </label>
    </div>
);
