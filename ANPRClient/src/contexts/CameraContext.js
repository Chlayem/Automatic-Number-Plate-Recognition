import React, { createContext, useState, useContext, useEffect } from 'react';
import {startCameraApi,stopCameraApi, fetchCamerasApi, addCameraApi,updateCameraApi,deleteCameraApi,initiateDetectionServices } from '../services/Api';
import { useDetectors } from './DetectorContext';


const CameraContext = createContext();

// const fetchCamerasAPI = () => {
//     return fetch('/data/data.json') 
//         .then(response => response.json())
//         .then(data => data.cameras);
// };
// const fetchCamerasAPI = () => {
//     // Update the URL to the endpoint where your API is hosted
//     return fetch('https://localhost:7145/api/Detector') 
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok ' + response.statusText);
//             }
//             return response.json();
//         })
//         .then(data => data); // Ensure that your API returns the array directly, or adjust the access here as needed
// };

export const CameraProvider = ({ children }) => {
    const [cameras, setCameras] = useState([]);
    const [loading, setLoading] = useState(false);
    const { updateDetectorsOnCameraRemoval } = useDetectors();


    useEffect(() => {
        const fetchAndStartCameras = async () => {
            setLoading(true);
            try {
                const fetchedCameras = await fetchCamerasApi();
                setCameras(fetchedCameras);
                //console.log("Cameras : ", cameras);
                await Promise.all(fetchedCameras.map(camera => startCameraApi(camera.id)));
                await initiateDetectionServices();
                console.log("Detection services initialized");

            } catch (error) {
                console.error('Error fetching cameras:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAndStartCameras();

    }, []);

    const addCamera = async (camera) => {
        setLoading(true)
        try {
            const {id,...cameraData} = camera;
            const newCamera = await addCameraApi(cameraData);
            setCameras(prevCameras => [...prevCameras, newCamera]);
            console.log("Camera added :",newCamera);
            await startCameraApi(newCamera.id);
            return newCamera;
        } catch (error) {
            console.error('Error adding camera:', error);
        }finally{
            setLoading(false);
        }
    };

    const removeCamera = async (cameraId) => {
        setLoading(true)
        try {
            await deleteCameraApi(cameraId);
            setCameras(prevCameras => prevCameras.filter(cam => cam.id !== cameraId));
            
            await stopCameraApi(cameraId);
            await updateDetectorsOnCameraRemoval(cameraId);
        } catch (error) {
            console.error('Error removing camera:', error);
        }finally{
            setLoading(false);
        }        
    };

    const editCamera = async (updatedCamera) => {
        setLoading(true)
        try {
            const {id,...cameraData} = updatedCamera;
            const response = await updateCameraApi(id, cameraData);
            setCameras(prevCameras => prevCameras.map(cam => cam.id === id ? response : cam));
        } catch (error) {
            console.error('Error updating camera:', error);
        }finally{
            setLoading(false);
        }
    };

    return (
        <CameraContext.Provider value={{ cameras, addCamera, removeCamera, editCamera, loading }}>
            {children}
        </CameraContext.Provider>
    );
};

export const useCameras = () => useContext(CameraContext);
