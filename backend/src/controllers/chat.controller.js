const openaiService = require('../services/openai.service');

class ChatController {
    async handleChat(req, res) {
        const { message, threadId, assistantId } = req.body;

        if (!message) {
            return res.status(400).json({ 
                error: 'El mensaje no puede estar vacío' 
            });
        }

        try {
            let currentThreadId = threadId;

            if (!currentThreadId) {
                const thread = await openaiService.createThread();
                currentThreadId = thread.id;
            }

            await openaiService.addMessage(currentThreadId, message);
            await openaiService.runAssistant(currentThreadId, assistantId);

            const messages = await openaiService.getMessages(currentThreadId);
            const assistantMessage = messages.data.find(m => m.role === 'assistant');

            if (!assistantMessage) {
                throw new Error('No se recibió respuesta del asistente');
            }

            res.json({ 
                response: assistantMessage.content[0].text.value,
                threadId: currentThreadId,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Error en el chat:', error);
            res.status(500).json({
                error: 'Error interno del servidor',
                details: error.message
            });
        }
    }

    async getConfig(req, res) {
        res.json({
            assistantId: openaiService.assistantId,
            model: 'gpt-3.5-turbo',
            status: 'ok'
        });
    }

    async updateAssistant(req, res) {
        const { assistantId } = req.body;
        
        if (!assistantId) {
            return res.status(400).json({
                error: 'Se requiere el ID del asistente'
            });
        }

        try {
            const assistant = await openaiService.getAssistant(assistantId);
            await openaiService.updateAssistantId(assistantId);
            
            res.json({
                message: 'Asistente actualizado correctamente',
                assistantId: assistantId,
                assistantName: assistant.name
            });
        } catch (error) {
            console.error('Error al actualizar el asistente:', error);
            res.status(400).json({
                error: 'Error al actualizar el asistente',
                details: error.message
            });
        }
    }
}

module.exports = new ChatController(); 