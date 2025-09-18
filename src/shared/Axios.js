import axios from 'axios';
import * as AppConstant from '../components/AppConstant';

const instance = axios.create({
    baseURL: AppConstant.API_URL
});

// Add a request interceptor
instance.interceptors.request.use(config => {
    config.headers['accessedBy'] = localStorage.getItem("userToken");
    config.headers['Access-Control-Allow-Origin'] = "*";
    config.headers['Access-Control-Allow-Headers'] = "Content-Type";
    config.headers['Authorization'] = 'Basic YXBpLWV4aW13YXRjaDp1ZTg0Q1JSZnRAWGhBMyRG';
    return config;
}, error => {
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(response => {
    return response;
}, error => {
    return Promise.reject(error.response);
});

export default instance;