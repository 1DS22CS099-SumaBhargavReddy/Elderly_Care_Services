import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://elderly-care-services.onrender.com/api',
});

// Set session ID in headers
api.interceptors.request.use((config) => {
    let sessionId = localStorage.getItem('care_session_id');
    if (!sessionId) {
        sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('care_session_id', sessionId);
    }
    config.headers['x-session-id'] = sessionId;
    return config;
});

export default api;
