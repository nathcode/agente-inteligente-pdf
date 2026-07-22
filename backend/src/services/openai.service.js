const { OpenAI } = require('openai');
const config = require('../config/config');

class OpenAIService {
    constructor() {
        this.client = new OpenAI({
            apiKey: config.openai.apiKey
        });
        this.assistantId = config.openai.assistantId;
    }

    async createThread() {
        return await this.client.beta.threads.create();
    }

    async addMessage(threadId, message) {
        return await this.client.beta.threads.messages.create(threadId, {
            role: "user",
            content: message
        });
    }

    async runAssistant(threadId, assistantId = this.assistantId) {
        const run = await this.client.beta.threads.runs.create(threadId, {
            assistant_id: assistantId
        });

        let runStatus = await this.client.beta.threads.runs.retrieve(threadId, run.id);
        while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
            await new Promise(resolve => setTimeout(resolve, 1000));
            runStatus = await this.client.beta.threads.runs.retrieve(threadId, run.id);
        }

        return runStatus;
    }

    async getMessages(threadId) {
        return await this.client.beta.threads.messages.list(threadId);
    }

    async getAssistant(assistantId) {
        return await this.client.beta.assistants.retrieve(assistantId);
    }

    async updateAssistantId(newAssistantId) {
        try {
            await this.getAssistant(newAssistantId);
            this.assistantId = newAssistantId;
            return true;
        } catch (error) {
            throw new Error(`Error al actualizar el asistente: ${error.message}`);
        }
    }
}

module.exports = new OpenAIService(); 