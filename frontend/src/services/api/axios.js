import axios from 'axios';

// Determine the base URL based on the environment
const getBaseUrl = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // Check if running on port 8000 (php artisan serve)
        if (window.location.port === '8000') {
            return 'http://localhost:8000';
        }
        // XAMPP default
        return 'http://localhost/CineVerse/backend/public';
    }
    return 'http://localhost:8000'; // fallback
};

const api = axios.create({
    baseURL: getBaseUrl(),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Initialize with token if available
const token = localStorage.getItem('token');
if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Add request interceptor to add token
api.interceptors.request.use((config) => {
    // Check token again on each request in case it was updated
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear token if unauthorized
            localStorage.removeItem('token');
            // You could also redirect to login page here if needed
        }
        return Promise.reject(error);
    }
);

// Helper functions to manage tokens
export const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
    }
};

export default api;