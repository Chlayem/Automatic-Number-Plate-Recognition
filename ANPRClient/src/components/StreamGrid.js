import {React, useState} from "react";
import { useDetectors } from "../contexts/DetectorContext";
import StreamComponent from "./common/StreamComponent";
import { MoonLoader } from 'react-spinners';


const StreamGrid = () => {
    const { detectors, loading } = useDetectors();
    const [expandedDetectorId, setExpandedDetectorId] = useState(null);
    
    const handleDoubleClick = (id) => {
        setExpandedDetectorId(expandedDetectorId === id ? null : id);
    };
    if (loading) {
        return <div className="loader"><MoonLoader color="#999" size={30} /></div>;
    }

    return (
        <div className="stream-grid">
            {detectors.map(detector => (
                <StreamComponent 
                key={detector.id} 
                detector={detector} 
                expanded={expandedDetectorId === detector.id} 
                expandedDetectorId ={expandedDetectorId}
                onDoubleClick = {() => handleDoubleClick(detector.id)}
                />
            ))}
        </div>
    );
};

export default StreamGrid;