import axios from 'axios';

const baseURL = 'http://localhost:80/api';

export const axiosClient = axios.create({
    baseURL,
    headers: {
        'Accept': 'application/json'
    }
});

axiosClient.interceptors.request.use(
    config => {

        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
          }

        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized access', error.config.url);
            
            if (error.config.url && error.config.url.includes('/mentors/')) {
                return Promise.reject(error);
            }
            
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
