import React from 'react';
import { useDetectors } from '../contexts/DetectorContext';

const DetectionsList = () => {
    const {detections} = useDetectors();
    return (
        <div className='detection-container'>
            <div className="detections-list">
                {detections.map((detection, index) => (
                    <DetectionItem key={index} detection={detection} />
                ))}
            </div>
        </div>
    );
};

export default DetectionsList;

const DetectionItem = React.memo(({index,detection}) => {
    return(
        <div className="detection-item">
            <p>{detection.label}</p>

            <div className='vehicle'>
                <img src={detection.vehicleImage} alt="Vehicle" />
            </div>
            <div className='plate'>
                <img src={detection.plateImage} alt="Plate"/>
                <div className='detection-plate-text'>{detection.plateText}</div>
                {/* <div>{detection.detectionNumber}</div> */}
            </div>
        </div>
    );
});