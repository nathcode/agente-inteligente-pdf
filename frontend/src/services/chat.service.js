import axios from 'axios';
import { API_ENDPOINTS } from '../config/api.config';

class ChatService {
    async sendMessage(message, threadId, assistantId) {
        try {
            const response = await axios.post(API_ENDPOINTS.chat, {
                message,
                threadId,
                assistantId
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getConfig() {
        try {
            const response = await axios.get(API_ENDPOINTS.config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async updateAssistant(assistantId) {
        try {
            const response = await axios.post(API_ENDPOINTS.updateAssistant, {
                assistantId
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    handleError(error) {
        if (error.response) {
            return new Error(error.response.data.error || 'Error en la comunicación con el servidor');
        }
        return new Error('Error de conexión');
    }
}

export default new ChatService(); 