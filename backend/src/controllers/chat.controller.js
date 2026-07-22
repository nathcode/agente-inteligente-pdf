const openaiService = require('../services/openai.service');

class ChatController {
    async handleChat(req, res) {
        const { message, threadId, model } = req.body;

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
            await openaiService.runAssistant(currentThreadId, model || openaiService.model);

            const messages = await openaiService.getMessages(currentThreadId);
            const assistantMessage = messages.data.find(m => m.role === 'assistant');

            if (!assistantMessage) {
                throw new Error('No se recibió respuesta del modelo');
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
        res.json(openaiService.getConfig());
    }

    async updateModel(req, res) {
        const { model } = req.body;

        if (!model) {
            return res.status(400).json({
                error: 'Se requiere el nombre del modelo'
            });
        }

        try {
            await openaiService.updateModel(model);

            res.json({
                message: 'Modelo actualizado correctamente',
                model,
                modelName: model
            });
        } catch (error) {
            console.error('Error al actualizar el modelo:', error);
            res.status(400).json({
                error: 'Error al actualizar el modelo',
                details: error.message
            });
        }
    }

    async updateAssistant(req, res) {
        return this.updateModel(req, res);
    }
}

module.exports = new ChatController(); 