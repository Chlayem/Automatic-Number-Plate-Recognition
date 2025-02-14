import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_URL}/api`,
    headers: { 'Content-Type': 'application/json' }
});

export default axiosInstance;
