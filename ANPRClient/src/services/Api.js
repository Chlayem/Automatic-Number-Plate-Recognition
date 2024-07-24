import axiosInstance from './AxiosSetup.js';

export const startCameraApi = (cameraId) => {
    return axiosInstance.post(`/Camera/start/${cameraId}`)
        .then(response =>{
            console.log(response.data);
            return response.data;  
        } )
        .catch(error => {
            console.error('Error starting camera:', error);
            throw error;
        });
};

export const stopCameraApi = (cameraId) => {
    return axiosInstance.post(`/Camera/stop/${cameraId}`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error stopping camera:', error);
            throw error;
        });
};
export const fetchCamerasApi = () => {
    return axiosInstance.get('/Camera')
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching cameras:', error);
            throw error;
        });
};

export const addCameraApi = (camera) => {
    return axiosInstance.post('/Camera', camera)
        .then(response => response.data)
        .catch(error => {
            console.error('Error adding camera:', error);
            throw error; 
        });
};


export const getCameraByIdApi = (cameraId) => {
    return axiosInstance.get(`/Camera/${cameraId}`)
        .then(response => response.data)
        .catch(error => {
            console.error(`Error fetching camera:${cameraId}`, error);
            throw error;
        });
};

export const updateCameraApi = (cameraId, cameraData) => {
    return axiosInstance.put(`/Camera/${cameraId}`, cameraData)
        .then(response => response.data)
        .catch(error => {
            console.error('Error updating camera:', error);
            throw error;
        });
};

export const deleteCameraApi = (cameraId) => {
    return axiosInstance.delete(`/Camera/${cameraId}`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error deleting camera:', error);
            throw error;
        });
};

export const fetchDetectorApi = () => {
    return axiosInstance.get('/Detector')
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching detectors:', error);
            throw error;
        });
};

export const addDetectorApi = (detector) => {
    return axiosInstance.post('/Detector', detector)
        .then(response => response.data)
        .catch(error => {
            console.error('Error adding detector:', error);
            throw error; 
        });
};


export const getDetectorByIdApi = (detectorId) => {
    return axiosInstance.get(`/Detector/${detectorId}`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching specific detector:', error);
            throw error;
        });
};

export const updateDetectorApi = (detectorId, detectorData) => {
    return axiosInstance.put(`/Detector/${detectorId}`, detectorData)
        .then(response => response.data)
        .catch(error => {
            console.error('Error updating detector:', error);
            throw error;
        });
};

export const deleteDetectorApi = (detectorId) => {
    return axiosInstance.delete(`/Detector/${detectorId}`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error deleting detector:', error);
            throw error;
        });
};

export const initiateDetectionServices = async () => {
    return axiosInstance.post(`/Detector/services`);
}

export const getVehiclesApi = (detectorId) => {
    return axiosInstance.get(`/Detector/detectedVehicles/${detectorId}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error fetching vehicles:', error);
            throw error;
        } );
};

export const getDetectionsApi = () => {
    return axiosInstance.get(`/Detector/detections`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error fetching detections:', error);
            throw error;
        } );
};