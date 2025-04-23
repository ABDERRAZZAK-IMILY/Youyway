import axios from 'axios';

const baseURL = 'http://localhost:80/api'; // Adjust this to your backend URL

export const axiosClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add interceptors to handle authentication
axiosClient.interceptors.request.use(
    config => {
        // Get token from localStorage or wherever you store it
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
            // Handle unauthorized access
            // You might want to redirect to login page
            console.error('Unauthorized access');
            // Optional: Clear token and redirect to login
            // localStorage.removeItem('token');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
