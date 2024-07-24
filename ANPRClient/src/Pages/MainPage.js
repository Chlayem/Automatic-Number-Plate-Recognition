import {React , useState } from 'react';
import Navbar from '../components/NavBar.js';
import Sidebar from '../components/SideBar.js';
import Modal from '../components/common/Modal.js';
import { CameraProvider } from '../contexts/CameraContext.js';
import { DetectorProvider } from '../contexts/DetectorContext.js';
import StreamGrid from '../components/StreamGrid.js';
import { SignalRProvider } from '../contexts/SignalRContext.js';
import DetectionsList from '../components/DetectionsList.js';

const Main = () => {
//   const detections = [
//     {
//         vehicleImage: "images/vehicle_0.jpeg",
//         plateImage: "images/plate_0.jpeg",
//         plateText: '227 TN 168'
//     },
//     {
//         vehicleImage: "images/vehicle_2.jpeg",
//         plateImage: "images/plate_2.jpeg",
//         plateText: '202 TN 2863'
//     },
//     {
//       vehicleImage: "images/vehicle_0.jpeg",
//       plateImage: "images/plate_0.jpeg",
//       plateText: '227 TN 168'
//   },
//   {
//       vehicleImage: "images/vehicle_2.jpeg",
//       plateImage: "images/plate_2.jpeg",
//       plateText: '202 TN 2863'
//   },
//   {
//     vehicleImage: "images/vehicle_0.jpeg",
//     plateImage: "images/plate_0.jpeg",
//     plateText: '227 TN 168'
// },
// {
//     vehicleImage: "images/vehicle_2.jpeg",
//     plateImage: "images/plate_2.jpeg",
//     plateText: '202 TN 2863'
// }
//   ];
  
    //const [modalContent, setModalContent] = useState(null);
    //const [isModalVisible, setModalVisible] = useState(false);
    const [modals, setModals] = useState([]);
    const [showDetections, setShowDetections] = useState(false);

    const toggleDetections = () => {
      setShowDetections(!showDetections);
    };

    const openModal = (contentType,initialData=null,label=null,icon=null) => {
        console.log('Opening Modal with data',initialData);
        setModals(prevModals => [...prevModals, { contentType,label,icon, isVisible: true ,initialData}]);

    };

    const closeModal = () => {
        setModals(prevModals => prevModals.slice(0, -1));
    };

    console.log("Main page");



  return (
    <SignalRProvider>
      <DetectorProvider>
        <CameraProvider>
            <div className="main-page">
                <Navbar toggleDetections={toggleDetections} />
                <div className="main-container">
                  <Sidebar openModal={openModal} />
                  <div className="video-container">
                  <StreamGrid/>
                    {/* <img src="images/cars.jpg" alt="Live Stream" className="video-stream"/> */}
                  </div>
                  {showDetections && <DetectionsList/>}
                </div>
                {modals.map((modal, index) => (
                      <Modal
                          key={index}
                          isVisible={modal.isVisible}
                          onClose={closeModal}
                          openModal={openModal}
                          contentType={modal.contentType}
                          icon={modal.icon}
                          label={modal.label}
                          initialData={modal.initialData}
                      />
                  ))}
                  
            </div>
        </CameraProvider>
      </DetectorProvider>
    </SignalRProvider>
  );
}
export default Main;