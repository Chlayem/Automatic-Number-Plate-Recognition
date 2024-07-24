import { useEffect, useState } from "react";
import CrudTable from "../common/CrudTable";
import { ModalContentType } from "../../constants/ModalContentTypes";
import { useCameras } from "../../contexts/CameraContext";
import { MoonLoader } from 'react-spinners';
import Canvas from "../Canvas";

export const CamerasPage = ({openModal}) => {
    const {cameras ,removeCamera,loading} = useCameras();

    const cameraColumns = [
        { key: 'id', label: 'N°' },
        { key: 'label', label: 'Libellé' },
        { key: 'url', label: 'Addresse' },
    ];
    if(loading){
        return <div className="loader"><MoonLoader color="#999" size={30} /></div>;
    }
    const handleAddCamera = () => {
        console.log('Adding new camera');
        openModal(ModalContentType.AddCamera);
    };

    const handleEditCamera = (camera) => {
        console.log('Editing camera', camera);
        openModal(ModalContentType.EditCamera,camera);
    };

    const handleRemoveCamera = (cameraId) => {
        console.log('Removing camera', cameraId);
        removeCamera(cameraId);
    };

    return (
        <CrudTable
            data={cameras}
            columns={cameraColumns}
            onAdd={handleAddCamera}
            onEdit={handleEditCamera}
            onRemove={handleRemoveCamera}
        />
    );
};

export const CameraForm = ({initialData,onConfirmed}) => {
    const [camera, setCamera] = useState({id:null, label: '', url: '' ,roi:{x: 0, y: 0, width: 0, height: 0}});
    const {addCamera,editCamera} = useCameras();
    const [imageUrl, setImageUrl] = useState('images/nosignal.jpg');  
    
    useEffect(() => {
        if (initialData) {
            console.log('use effect initial Data ',initialData);
            setCamera(initialData); 
            setImageUrl(`${process.env.REACT_APP_URL}/api/Camera/frame/${initialData.id}?timestamp=${new Date().getTime()}`);
        }
        //console.log("Camera : ",camera);
    }, [initialData]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try{

            if(camera.id == null ){
                const newCamera = await addCamera(camera);
                setCamera(newCamera);            
                setTimeout(() => {
                    setImageUrl(`${process.env.REACT_APP_URL}/api/Camera/frame/${newCamera.id}?timestamp=${new Date().getTime()}`);
                    //onSave(camera);
                    onConfirmed(true);
        
                },2000);
            }else{
                await editCamera(camera);
                if(camera.url !== initialData.url){
                    setTimeout(() => {
                        setImageUrl(`${process.env.REACT_APP_URL}/api/Camera/frame/${camera.id}?timestamp=${new Date().getTime()}`);
                        //onSave(camera);
                        
                    },1500);
                }
                onConfirmed(true);
            }
        }
        catch (error) {
        console.error("Error in form submission:", error);
        }
    };
    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name.startsWith('roi')) {
            const roiKey = name.split('.')[1];
            const numericValue = parseInt(value, 10); 
            if (!isNaN(numericValue)) { 
                setCamera(prev => ({ ...prev, roi: { ...prev.roi, [roiKey]: numericValue } }));
            } else {
                setCamera(prev => ({ ...prev, roi: { ...prev.roi, [roiKey]: 0 } }));
            }
        }else{
            setCamera(prev => ({ ...prev, [name]: value }));
        }
        onConfirmed(false);
    };
    const handleROIChange = (newROI) => {
        setCamera({ ...camera, roi: newROI });
        onConfirmed(false);
    };
    return (
        <div className="add-camera-form">
            <div className="form-image">
                {/* <img src={imageUrl} alt="Camera" /> */}
                <Canvas className="canvas" imageUrl={imageUrl} roi={camera.roi} setROI={handleROIChange}/>
            </div>
            <div className="form-fields">
               <form onSubmit={handleSubmit}>
                    <div className="inputs">
                        <h2>Camera</h2>

                        <div className="camera-inputs">
                            <div className="input-group">
                                <label htmlFor="label">Libellé</label>
                                <input type="text" id="label" name="label" value={camera.label} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="url">Adresse</label>
                                <input type="text" id="url" name="url" value={camera.url} onChange={handleChange} />
                            </div>
                        </div>
                        <h3>ROI</h3>
                        <div className="roi-inputs">
                            <div className="input-group">
                                <label htmlFor="roi.x">X</label>
                                <input type="text" id="roi.x" name="roi.x" value={String(camera.roi.x)} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="roi.y">Y</label>
                                <input type="text" id="roi.y" name="roi.y" value={String(camera.roi.y)} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="roi.width">Largeur</label>
                                <input type="text" id="roi.width" name="roi.width" value={String(camera.roi.width)} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="roi.height">Hauteur</label>
                                <input type="text" id="roi.height" name="roi.height" value={String(camera.roi.height)} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                    <button type="submit">Se connecter</button>
                </form>
            </div>
        </div>
    );
};