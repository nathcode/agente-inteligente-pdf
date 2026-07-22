const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
    chat: `${API_BASE_URL}/chat`,
    config: `${API_BASE_URL}/config`,
    updateAssistant: `${API_BASE_URL}/config/assistant`,
    health: `${API_BASE_URL}/health`
}; 