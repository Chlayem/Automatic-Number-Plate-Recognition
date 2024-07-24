import React, { useEffect, useState,useRef } from 'react';
import { useSignalR } from '../../contexts/SignalRContext';
import { useDetectors } from '../../contexts/DetectorContext';


const loadImageWithCrossOrigin = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // This enables cross-origin image loading
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
};
const StreamComponent = ({ detector , expanded,expandedDetectorId, onDoubleClick }) => {
    const {detectionConnection,cameraConnection} = useSignalR();
    const [imageUrl, setImageUrl] = useState('images/nosignal.jpg');  
    const {subscribed,fetchVehicles,setDetections} = useDetectors();
    //const [detectionCounter, setDetectionCounter] = useState(0);
    const componentStyle =expandedDetectorId? expanded ? { gridColumn: '1 / -1', gridRow: '1 / -1' } : {display : 'none'} : {};
    const canvasRef = useRef(null);
    useEffect(() => {
        const updateFrameDetection = async(detectorId) => {
            //console.log('updating frame ...');
            if (detectorId === detector.id) {
                const frameUrl = `${process.env.REACT_APP_URL}/api/Detector/detectedFrame/${detectorId}?timestamp=${new Date().getTime()}`;

                //const frame = `https://localhost:7145/api/Camera/frame/${detector.cameraId}?timestamp=${new Date().getTime()}`;
                setImageUrl(frameUrl);
                if(detector.active){
                    try {
                        const vehicles = await fetchVehicles(detector.id);
                        if(!vehicles){
                            //console.log('No vehicles detected');
                            return;
                        }
                        const image = await loadImageWithCrossOrigin(frameUrl);
                        //console.log("vehicles :",vehicles);

                        //let counter = detectionCounter;
                        const newDetections = vehicles.map(vehicle => {
                            //console.log(`Previous Counter: ${detectionCounter}`);
                            //console.log(vehicle);
                            const { vehicleBoundingBox, plateBoundingBox, plateText } = vehicle;
                            if(!plateBoundingBox) return null;

                            //counter +=1;
                            //console.log("counter :", counter);

                            const detection ={
                                label : detector.label,
                                //detectionNumber: counter,
                            };
                            //setDetectionCounter(prev => prev +1);
                            if (vehicleBoundingBox) {
                                detection.vehicleImage = cropImage(image,vehicleBoundingBox);
                            }
                            if (plateBoundingBox) {
                                detection.plateImage = cropImage(image,plateBoundingBox);
                                detection.plateText = plateText;
                                //console.log('text',plateText);
                            }
                            //console.log("Detection:",detection);
                            return detection;
                        }).filter(detection => detection !== null);
                        //console.log(newDetections.length);
                        //console.log("new Detections:",newDetections);
                        setDetections(prevDetections => [ ...newDetections,...prevDetections]);
                        //setDetectionCounter(counter);


                        //console.log(vehicles);
                        // vehicles.forEach(vehicle => {
                        //     const { vehicleBoundingBox, plateBoundingBox, plateText } = vehicle;
                        //     console.log("vehicle", vehicleBoundingBox);
                        //     if (plateBoundingBox) {
                        //         console.log("plate", plateBoundingBox);
                        //         console.log("text", plateText);
                        //     }
                        // });
    
                    }
                    catch (error) {
                        console.error('Error fetching and processing vehicles:', error);
                    }
                }
            }
        };
        const updateFrame = (cameraId) => {
            if (cameraId === detector.cameraId) {
                setImageUrl(`${process.env.REACT_APP_URL}/api/Camera/frame/${cameraId}?timestamp=${new Date().getTime()}`)
            }

        }

        if (subscribed) {
            if (detector.active) {
                detectionConnection.on('DetectedFrameReady', updateFrameDetection);
            }else{
                cameraConnection.on('FrameReady', updateFrame);

            }
                
        }
        return () => {
            console.log(`Cleaning up event handlers for detector: ${detector.id}`);
            detectionConnection.off('DetectedFrameReady', updateFrameDetection);
            cameraConnection.off('FrameReady', updateFrame);
        };

        // const subscribeToUpdates = async () => {
        //     if (detector.cameraId && connection && connection.state === signalR.HubConnectionState.Connected) {
        //         try {
        //             await connection.invoke('Subscribe', detector.id)
        //                 .then(()=>{
        //                     connection.on('DetectedFrameReady', updateFrame);
        //                     console.log(detector.label, "Subscribed to detection:", detector.id);
        //                 })
        //                 .catch(err => {
        //                     console.error('Failed to subscribe to detection group:', err);
        //                 });
        //         } catch (err) {
        //             console.error('Error subscribing to detection group:', err);
        //         }
        //     }else{
        //         setImageUrl('images/nosignal.jpg');
        //     }
        // };

        //subscribeToUpdates();


            // return () => {
            //     if (detector.cameraId && connection) {
            //         connection.invoke('UnSubscribe', detector.id).catch(err => {
            //             console.error('Error unsubscribing from detection group:', err);
            //         });
            //         connection.off('DetectedFrameReady', updateFrame);
            //         console.log(detector.label, "UnSubscribed to detection:", detector.id);

            //     }
            // };
        

    }, [subscribed,detectionConnection, detectionConnection?.state,cameraConnection,cameraConnection?.state,detector.cameraId,detector.id,detector.active]);  
    const cropImage = (image, boundingBox) => {
        const { x, y, width, height } = boundingBox;
        const croppedCanvas = document.createElement('canvas');
        const croppedContext = croppedCanvas.getContext('2d');
        croppedCanvas.width = width;
        croppedCanvas.height = height;
        croppedContext.drawImage(image, x, y, width, height, 0, 0, width, height);
        return croppedCanvas.toDataURL();
    };
      return (
        <div className="detector" style={componentStyle} onDoubleClick={onDoubleClick}>
            <p>{detector.label}</p>
            <img src={imageUrl} alt={`Stream ${detector.label}`} className="video-stream" />
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>
    );
};

export default StreamComponent;
