import {React , useState , useEffect} from 'react';
import { useDetectors } from '../contexts/DetectorContext';


// const staticDetections = [
//     {
//         id: '1',
//         date: '2024-05-29T10:00:00Z',
//         cameraLabel: 'Camera 1',
//         detectorLabel: 'Detector A',
//         plateText: 'ABC123',
//         vehicleImageBase64: "images/vehicle_0.jpeg" // Add a base64 image string here
//     },
//     {
//         id: '2',
//         date: '2024-05-29T11:00:00Z',
//         cameraLabel: 'Camera 2',
//         detectorLabel: 'Detector B',
//         plateText: 'XYZ789',
//         vehicleImageBase64:  "images/vehicle_0.jpeg" // Add a base64 image string here
//     },
//     {
//         id: '3',
//         date: '2024-05-29T12:00:00Z',
//         cameraLabel: 'Camera 3',
//         detectorLabel: 'Detector C',
//         plateText: 'LMN456',
//         vehicleImageBase64: "images/vehicle_2.jpeg" // Add a base64 image string here
//     },
//     {
//         id: '2',
//         date: '2024-05-29T11:00:00Z',
//         cameraLabel: 'Camera 2',
//         detectorLabel: 'Detector B',
//         plateText: 'XYZ789',
//         vehicleImageBase64:  "images/vehicle_0.jpeg" // Add a base64 image string here
//     },
//     {
//         id: '3',
//         date: '2024-05-29T12:00:00Z',
//         cameraLabel: 'Camera 3',
//         detectorLabel: 'Detector C',
//         plateText: 'LMN456',
//         vehicleImageBase64: "images/vehicle_2.jpeg" // Add a base64 image string here
//     },{
//         id: '2',
//         date: '2024-05-29T11:00:00Z',
//         cameraLabel: 'Camera 2',
//         detectorLabel: 'Detector B',
//         plateText: 'XYZ789',
//         vehicleImageBase64:  "images/vehicle_0.jpeg" // Add a base64 image string here
//     },
//     {
//         id: '3',
//         date: '2024-05-29T12:00:00Z',
//         cameraLabel: 'Camera 3',
//         detectorLabel: 'Detector C',
//         plateText: 'LMN456',
//         vehicleImageBase64: "images/vehicle_2.jpeg" // Add a base64 image string here
//     },{
//         id: '2',
//         date: '2024-05-29T11:00:00Z',
//         cameraLabel: 'Camera 2',
//         detectorLabel: 'Detector B',
//         plateText: 'XYZ789',
//         vehicleImageBase64:  "images/vehicle_0.jpeg" // Add a base64 image string here
//     },
//     {
//         id: '3',
//         date: '2024-05-29T12:00:00Z',
//         cameraLabel: 'Camera 3',
//         detectorLabel: 'Detector C',
//         plateText: 'LMN456',
//         vehicleImageBase64: "images/vehicle_2.jpeg" // Add a base64 image string here
//     },{
//         id: '2',
//         date: '2024-05-29T11:00:00Z',
//         cameraLabel: 'Camera 2',
//         detectorLabel: 'Detector B',
//         plateText: 'XYZ789',
//         vehicleImageBase64:  "images/vehicle_0.jpeg" // Add a base64 image string here
//     },
//     {
//         id: '3',
//         date: '2024-05-29T12:00:00Z',
//         cameraLabel: 'Camera 3',
//         detectorLabel: 'Detector C',
//         plateText: 'LMN456',
//         vehicleImageBase64: "images/vehicle_2.jpeg" // Add a base64 image string here
//     },{
//         id: '2',
//         date: '2024-05-29T11:00:00Z',
//         cameraLabel: 'Camera 2',
//         detectorLabel: 'Detector B',
//         plateText: 'XYZ789',
//         vehicleImageBase64:  "images/vehicle_0.jpeg" // Add a base64 image string here
//     },
//     {
//         id: '3',
//         date: '2024-05-29T12:00:00Z',
//         cameraLabel: 'Camera 3',
//         detectorLabel: 'Detector C',
//         plateText: 'LMN456',
//         vehicleImageBase64: "images/vehicle_2.jpeg" // Add a base64 image string here
//     },{
//         id: '2',
//         date: '2024-05-29T11:00:00Z',
//         cameraLabel: 'Camera 2',
//         detectorLabel: 'Detector B',
//         plateText: 'XYZ789',
//         vehicleImageBase64:  "images/vehicle_0.jpeg" // Add a base64 image string here
//     },
//     {
//         id: '3',
//         date: '2024-05-29T12:00:00Z',
//         cameraLabel: 'Camera 3',
//         detectorLabel: 'Detector C',
//         plateText: 'LMN456',
//         vehicleImageBase64: "images/vehicle_2.jpeg" // Add a base64 image string here
//     },{
//         id: '2',
//         date: '2024-05-29T11:00:00Z',
//         cameraLabel: 'Camera 2',
//         detectorLabel: 'Detector B',
//         plateText: 'XYZ789',
//         vehicleImageBase64:  "images/vehicle_0.jpeg" // Add a base64 image string here
//     },
//     {
//         id: '3',
//         date: '2024-05-29T12:00:00Z',
//         cameraLabel: 'Camera 3',
//         detectorLabel: 'Detector C',
//         plateText: 'LMN456',
//         vehicleImageBase64: "images/vehicle_2.jpeg" // Add a base64 image string here
//     },{
//         id: '2',
//         date: '2024-05-29T11:00:00Z',
//         cameraLabel: 'Camera 2',
//         detectorLabel: 'Detector B',
//         plateText: 'XYZ789',
//         vehicleImageBase64:  "images/vehicle_0.jpeg" // Add a base64 image string here
//     },
//     {
//         id: '3',
//         date: '2024-05-29T12:00:00Z',
//         cameraLabel: 'Camera 3',
//         detectorLabel: 'Detector C',
//         plateText: 'LMN456',
//         vehicleImageBase64: "images/vehicle_2.jpeg" // Add a base64 image string here
//     },{
//         id: '2',
//         date: '2024-05-29T11:00:00Z',
//         cameraLabel: 'Camera 2',
//         detectorLabel: 'Detector B',
//         plateText: 'XYZ789',
//         vehicleImageBase64:  "images/vehicle_0.jpeg" // Add a base64 image string here
//     },
//     {
//         id: '3',
//         date: '2024-05-29T12:00:00Z',
//         cameraLabel: 'Camera 3',
//         detectorLabel: 'Detector C',
//         plateText: 'LMN456',
//         vehicleImageBase64: "images/vehicle_2.jpeg" // Add a base64 image string here
//     },{
//         id: '2',
//         date: '2024-05-29T11:00:00Z',
//         cameraLabel: 'Camera 2',
//         detectorLabel: 'Detector B',
//         plateText: 'XYZ789',
//         vehicleImageBase64:  "images/vehicle_0.jpeg" // Add a base64 image string here
//     },
//     {
//         id: '3',
//         date: '2024-05-29T12:00:00Z',
//         cameraLabel: 'Camera 3',
//         detectorLabel: 'Detector C',
//         plateText: 'LMN456',
//         vehicleImageBase64: "images/vehicle_2.jpeg" // Add a base64 image string here
//     },{
//         id: '2',
//         date: '2024-05-29T11:00:00Z',
//         cameraLabel: 'Camera 2',
//         detectorLabel: 'Detector B',
//         plateText: 'XYZ789',
//         vehicleImageBase64:  "images/vehicle_0.jpeg" // Add a base64 image string here
//     },
//     {
//         id: '3',
//         date: '2024-05-29T12:00:00Z',
//         cameraLabel: 'Camera 3',
//         detectorLabel: 'Detector C',
//         plateText: 'LMN456',
//         vehicleImageBase64: "images/vehicle_2.jpeg" // Add a base64 image string here
//     },{
//         id: '2',
//         date: '2024-05-29T11:00:00Z',
//         cameraLabel: 'Camera 2',
//         detectorLabel: 'Detector B',
//         plateText: 'XYZ789',
//         vehicleImageBase64:  "images/vehicle_0.jpeg" // Add a base64 image string here
//     },
//     {
//         id: '3',
//         date: '2024-05-29T12:00:00Z',
//         cameraLabel: 'Camera 3',
//         detectorLabel: 'Detector C',
//         plateText: 'LMN456',
//         vehicleImageBase64: "images/vehicle_2.jpeg" // Add a base64 image string here
//     },{
//         id: '2',
//         date: '2024-05-29T11:00:00Z',
//         cameraLabel: 'Camera 2',
//         detectorLabel: 'Detector B',
//         plateText: 'XYZ789',
//         vehicleImageBase64:  "images/vehicle_0.jpeg" // Add a base64 image string here
//     },
//     {
//         id: '3',
//         date: '2024-05-29T12:00:00Z',
//         cameraLabel: 'Camera 3',
//         detectorLabel: 'Detector C',
//         plateText: 'LMN456',
//         vehicleImageBase64: "images/vehicle_2.jpeg" // Add a base64 image string here
//     },{
//         id: '2',
//         date: '2024-05-29T11:00:00Z',
//         cameraLabel: 'Camera 2',
//         detectorLabel: 'Detector B',
//         plateText: 'XYZ789',
//         vehicleImageBase64:  "images/vehicle_0.jpeg" // Add a base64 image string here
//     },
//     {
//         id: '3',
//         date: '2024-05-29T12:00:00Z',
//         cameraLabel: 'Camera 3',
//         detectorLabel: 'Detector C',
//         plateText: 'LMN456',
//         vehicleImageBase64: "images/vehicle_2.jpeg" // Add a base64 image string here
//     },
// ];


const Events = () => {
    const {fetchDetections} = useDetectors();
    const [detections,setDetections] = useState([]);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedId, setSelectedId] = useState('');
    console.log("Events");
    useEffect(() => {
        const handleGetDetections = async () => {
            const det = await fetchDetections();
            if(det && det.length >0){

                setDetections(det);
                //setDetections(staticDetections);
                if (det.length > 0) {
                    setSelectedImage(det[0].vehicleImageBase64);
                    setSelectedId(det[0].id);
    
                }
            }
            
        };

        handleGetDetections();
    }, []);
    const handleRowClick = (id,imageBase64) => {
        setSelectedImage(imageBase64);
        setSelectedId(id);
        
    };
    // if(detectionsLoading){
    //     return <div className="loader"><MoonLoader color="#999" size={30} /></div>;
    // }
    return(
        <div className='events-container'>
            <div className='events-table'>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Camera</th>
                            <th>Detector</th>
                            <th>Plate Text</th>
                        </tr>
                    </thead>
                    <tbody>
                        {detections.map((detection) => (
                            <tr key={detection.id} onClick={() => handleRowClick(detection.id,detection.vehicleImageBase64)} className={selectedId === detection.id ? 'selected' : ''}>

                                <td>{detection.formattedDate}</td>
                                <td>{detection.cameraLabel}</td>
                                <td>{detection.detectorLabel}</td>
                                <td>{detection.plateText}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="events-image-container">
                {selectedImage && <img src={`data:image/jpeg;base64,${selectedImage}`} alt="Vehicle" />}
            </div>
        </div>
        // <div>
        //     <div>
        //         {detections.map(detection => (
        //             <div key={detection.id}>
        //                 <p>Date: {detection.date}</p>
        //                 <p>Camera: {detection.cameraLabel}</p>
        //                 <p>Detector: {detection.detectorLabel}</p>
        //                 <p>Plate Text: {detection.plateText}</p>
        //                 <img src={`data:image/jpeg;base64,${detection.vehicleImageBase64}`} alt="Vehicle" />
        //             </div>
        //         ))}
        //     </div>
        // </div>

    );

};

export default Events;