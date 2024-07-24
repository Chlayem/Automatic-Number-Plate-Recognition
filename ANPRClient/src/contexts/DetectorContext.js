import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchDetectorApi,addDetectorApi,updateDetectorApi,deleteDetectorApi,getVehiclesApi , getDetectionsApi} from '../services/Api';
import { useSignalR } from './SignalRContext';
import * as signalR from '@microsoft/signalr';

const DetectorContext = createContext();


export const DetectorProvider = ({ children }) => {
    const [detectors, setDetectors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subscribed,setSubscribed]=useState(false);
    const {detectionConnection,cameraConnection} = useSignalR();

    const [detections,setDetections] = useState([]);

    useEffect(() => {
        const fetchAndSubscribe = async () => {
            try {
                const fetchedDetectors = await fetchDetectorApi();
                setDetectors(fetchedDetectors);
                fetchedDetectors.forEach(detector =>{
                    if (detector.active) {
                        detectionConnection.invoke('Subscribe', detector.id);
                        console.log(detector.label, "Subscribed to detection:", detector.id);
                    } else {
                        cameraConnection.invoke('Subscribe', detector.cameraId);
                        console.log(detector.label, "Subscribed to camera:", detector.cameraId);
                    }
                })
            }catch(error){
                console.error('Error fetching and subscribing to detectors:', error);
            } finally {
                setSubscribed(true);
                setLoading(false);
            }
        };
        if(detectionConnection && detectionConnection.state === signalR.HubConnectionState.Connected && 
        cameraConnection && cameraConnection.state === signalR.HubConnectionState.Connected) {
            fetchAndSubscribe();
        }

        // fetchDetectorApi().then(detectors => {
        //     setDetectors(detectors);
        //     console.log(detectors);
        //     setLoading(false);
        // });
    }, [detectionConnection,detectionConnection?.state,cameraConnection,cameraConnection?.state]);

    const fetchVehicles = async (detectorId) => {
        try{
            const vehicles = await getVehiclesApi(detectorId);
            if(!vehicles || !vehicles.length){
                //console.log('No vehicles detected');
                return null;
            }
            return vehicles;
            // vehicles.forEach(vehicle => {
            //     const { VehicleBoundingBox, PlateBoundingBox, PlateText } = vehicle;
            //     console.log("vehicle",VehicleBoundingBox);
            //     if (PlateBoundingBox) {
            //         console.log("plate",PlateBoundingBox);
            //         console.log("text",PlateText);
            //     }
            // });
        }catch (error){
            console.error('Error fetching and processing vehicles:', error);
            return null;
        }
    };
    const fetchDetections = async () => {
        try{
            const det = await getDetectionsApi();
            
            console.log(det);
            return det;
            
        }catch (error){
            console.error('Error fetching detections:', error);
        }
    }

    const addDetector = async (detector) => {
        setLoading(true);
        try {
            const newDetector = await addDetectorApi(detector);
            setDetectors(prevDetectors => [...prevDetectors, newDetector]);
            console.log("Detector added : ",newDetector);
            if (newDetector.active) {
                detectionConnection.invoke('Subscribe', newDetector.id);
                console.log(newDetector.label, "Subscribed to detection:", newDetector.id);
            } else {
                cameraConnection.invoke('Subscribe', newDetector.cameraId);
                console.log(newDetector.label, "Subscribed to camera:", newDetector.cameraId);
            }
        } catch (error) {
            console.error('Error adding detector:', error);
        } finally{
            setLoading(false)
        }
    };

    const removeDetector = async (detectorId) => {
        setLoading(true);
        try {
            const detector = await deleteDetectorApi(detectorId);
            setDetectors(prevDetectors => prevDetectors.filter( detector=> detector.id !== detectorId));
            console.log("Detector deleted : ",detector);
            if (detector.active) {
                detectionConnection.invoke('UnSubscribe', detectorId);
                console.log(detector.label, "UnSubscribed to detection:", detectorId);
            } else {
                cameraConnection.invoke('UnSubscribe', detector.cameraId);
                console.log(detector.label, "UnSubscribed to camera:", detector.cameraId);
            }

        } catch (error) {
            console.error('Error removing detector:', error);
        } finally {
            setLoading(false);
        }
    };

    const editDetector = async (detector) => {
        setLoading(true);
        try {
            const {id, ...updateDate} = detector;
            const oldDetector = detectors.find(d => d.id === id);
            const response = await updateDetectorApi(id, updateDate);

            if (oldDetector.active !== response.active|| oldDetector.cameraId !== response.cameraId){
                if (!oldDetector.active && !response.active) {
                    cameraConnection.invoke('UnSubscribe', oldDetector.cameraId);
                    cameraConnection.invoke('Subscribe', response.cameraId);
                    console.log(response.label, "Subscribed to camera:", response.cameraId);

                }else if(oldDetector.active && response.active){
                    detectionConnection.invoke('UnSubscribe', oldDetector.id);
                    detectionConnection.invoke('Subscribe', response.id);
                    console.log(response.label, "Subscribed to detection:", response.id);
                    
                }else if(oldDetector.active && !response.active){
                    detectionConnection.invoke('UnSubscribe', oldDetector.id);
                    cameraConnection.invoke('Subscribe', response.cameraId);
                    console.log(response.label, "Subscribed to camera:", response.cameraId);
                }else if(!oldDetector.active && response.active){
                    cameraConnection.invoke('UnSubscribe', oldDetector.cameraId);
                    detectionConnection.invoke('Subscribe', response.id);
                    console.log(response.label, "Subscribed to detection:", response.id);

                }
                //     if(response.active){
                //         detectionConnection.invoke('Subscribe', response.id);
                //     }else{
                //         cameraConnection.invoke('Subscribe', response.cameraId);
                //     }


                // if(response.active){
                //     cameraConnection.invoke('UnSubscribe', oldDetector.cameraId);
                //     detectionConnection.invoke('Subscribe', response.id);
                //     console.log(response.label, "Subscribed to detection:", response.id);

                // }else{
                //     detectionConnection.invoke('UnSubscribe', oldDetector.id);
                //     cameraConnection.invoke('Subscribe', response.cameraId);
                //     console.log(response.label, "Subscribed to camera:", response.cameraId);

                // }
            }
            
            
            setDetectors(prevDetectors => prevDetectors.map(_ => _.id === id ? response : _));

        } catch (error) {
            console.error('Error updating detector:', error);
        } finally {
            setLoading(false)
        }
    };

    const updateDetectorsOnCameraRemoval = async (cameraId) => {
        const updatedDetectors = detectors.map(detector =>
            detector.cameraId === cameraId ? { ...detector, cameraId: null } : detector
        );
        setDetectors(updatedDetectors);

        updatedDetectors.filter(detector => detector.cameraId === null).forEach(async detector => {
            const {id, ...detectorData} = detector;
            await updateDetectorApi(id, detectorData);
        });
    };
    return (
        <DetectorContext.Provider value={{ detectors,addDetector,editDetector,removeDetector,updateDetectorsOnCameraRemoval,fetchVehicles,fetchDetections, loading,subscribed ,detections,setDetections}}>
            {children}
        </DetectorContext.Provider>
    );
};

export const useDetectors = () => useContext(DetectorContext);
