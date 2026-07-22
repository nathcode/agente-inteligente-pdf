const { OpenAI } = require('openai');
const config = require('../config/config');

class OpenAIService {
    constructor() {
        this.provider = config.llm.provider;
        this.assistantId = this.provider === 'ollama' ? config.llm.model : config.openai.assistantId;
        this.model = config.llm.model;
        this.baseUrl = config.llm.baseUrl;
        this.messages = new Map();

        if (this.provider === 'openai' && config.openai.apiKey) {
            this.client = new OpenAI({ apiKey: config.openai.apiKey });
        } else {
            this.client = null;
        }
    }

    _getThreadMessages(threadId) {
        if (!this.messages.has(threadId)) {
            this.messages.set(threadId, []);
        }
        return this.messages.get(threadId);
    }

    async createThread() {
        if (this.provider === 'openai') {
            if (!this.client) {
                throw new Error('OpenAI no está configurado. Define OPENAI_API_KEY o usa LLM_PROVIDER=ollama.');
            }
            return await this.client.beta.threads.create();
        }

        const threadId = `ollama-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        this.messages.set(threadId, []);
        return { id: threadId };
    }

    async addMessage(threadId, message) {
        if (this.provider === 'openai') {
            if (!this.client) {
                throw new Error('OpenAI no está configurado. Define OPENAI_API_KEY o usa LLM_PROVIDER=ollama.');
            }
            return await this.client.beta.threads.messages.create(threadId, {
                role: 'user',
                content: message
            });
        }

        const threadMessages = this._getThreadMessages(threadId);
        threadMessages.push({ role: 'user', content: message });
        this.messages.set(threadId, threadMessages);
        return { id: `${threadId}-msg-${threadMessages.length}` };
    }

    async runAssistant(threadId, assistantId = this.assistantId) {
        if (this.provider === 'openai') {
            if (!this.client) {
                throw new Error('OpenAI no está configurado. Define OPENAI_API_KEY o usa LLM_PROVIDER=ollama.');
            }
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

        const threadMessages = this._getThreadMessages(threadId);
        const prompt = threadMessages
            .map(message => `${message.role === 'user' ? 'Usuario' : 'Asistente'}: ${message.content}`)
            .join('\n');

        const response = await fetch(`${this.baseUrl.replace(/\/$/, '')}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: assistantId || this.model,
                prompt,
                stream: false,
                keep_alive: config.llm.keepAlive
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error de Ollama: ${errorText}`);
        }

        const data = await response.json();
        const assistantReply = data.response || '';
        threadMessages.push({ role: 'assistant', content: assistantReply });
        this.messages.set(threadId, threadMessages);

        return { status: 'completed', response: assistantReply };
    }

    async getMessages(threadId) {
        if (this.provider === 'openai') {
            if (!this.client) {
                throw new Error('OpenAI no está configurado. Define OPENAI_API_KEY o usa LLM_PROVIDER=ollama.');
            }
            return await this.client.beta.threads.messages.list(threadId);
        }

        const threadMessages = this._getThreadMessages(threadId);
        return {
            data: threadMessages.map(message => ({
                role: message.role,
                content: [{ text: { value: message.content } }]
            }))
        };
    }

    async getAssistant(assistantId) {
        if (this.provider === 'ollama') {
            return { id: assistantId, name: assistantId, provider: 'ollama' };
        }

        if (!this.client) {
            throw new Error('OpenAI no está configurado. Define OPENAI_API_KEY o usa LLM_PROVIDER=ollama.');
        }

        return await this.client.beta.assistants.retrieve(assistantId);
    }

    async updateAssistantId(newAssistantId) {
        try {
            if (this.provider === 'ollama') {
                this.assistantId = newAssistantId;
                this.model = newAssistantId;
                return true;
            }

            await this.getAssistant(newAssistantId);
            this.assistantId = newAssistantId;
            return true;
        } catch (error) {
            throw new Error(`Error al actualizar el asistente: ${error.message}`);
        }
    }

    getConfig() {
        return {
            assistantId: this.assistantId,
            model: this.provider === 'ollama' ? this.model : 'gpt-3.5-turbo',
            provider: this.provider,
            status: 'ok'
        };
    }
}

module.exports = new OpenAIService(); 