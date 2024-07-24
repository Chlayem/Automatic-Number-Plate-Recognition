import React, { createContext, useContext, useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

const SignalRContext = createContext(null);

export const SignalRProvider = ({ children }) => {
    const [detectionConnection, setDetectionConnection] = useState(null);
    const [cameraConnection, setCameraConnection] = useState(null);
    useEffect(() => {
        const detectionConnect = new signalR.HubConnectionBuilder()
            .withUrl(`${process.env.REACT_APP_URL}/detectionHub`)
            .configureLogging(signalR.LogLevel.Information)
            .build();
        
        const cameraConnect = new signalR.HubConnectionBuilder()
            .withUrl(`${process.env.REACT_APP_URL}/jpegHub`)
            .configureLogging(signalR.LogLevel.Information)
            .build();

        detectionConnect.start()
            .then(() =>{
                console.log("Connected to Detection Hub!");
                setDetectionConnection(detectionConnect);
            })
            .catch(err => console.error('Error connecting to Detection Hub: ', err));
                
        cameraConnect.start()
            .then(() =>{
                console.log("Connected to Camera Hub!");
                setCameraConnection(cameraConnect);
            })
            .catch(err => console.error('Error connecting to Camera Hub: ', err));
        return () => {
            cameraConnect.stop();
        };
    }, []);

    return (
        <SignalRContext.Provider value={{detectionConnection,cameraConnection}}>
            {children}
        </SignalRContext.Provider>
    );
};

export const useSignalR = () => useContext(SignalRContext);
