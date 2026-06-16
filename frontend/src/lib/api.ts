import axios from 'axios';

const getBaseUrl = () => {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    return url.endsWith('/api') ? url : `${url}/api`;
};

const api = axios.create({
    baseURL: getBaseUrl(),
    withCredentials: true, // Important for cookies
});
console.log("Axios baseURL resolved to:", getBaseUrl());


// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Redirect to login if unauthorized (optional, depends on UX)
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
