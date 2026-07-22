const { OpenAI } = require('openai');
const config = require('../config/config');

class OpenAIService {
    constructor() {
        this.provider = config.llm.provider;
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

    _buildOpenAIChatMessages(threadMessages) {
        // Formato que OpenAI espera para el historial del chat.
        return threadMessages.map(message => ({
            role: message.role === 'user' ? 'user' : 'assistant',
            content: message.content
        }));
    }

    _buildOllamaMessages(threadMessages) {
        // Se construye un historial compatible con Ollama.
        // El primer mensaje es una instrucción del sistema para guiar la respuesta.
        return [
            {
                role: 'system',
                content: 'Responde de forma breve, natural y útil a la pregunta del usuario. No repitas saludos genéricos ni respuestas predefinidas.'
            },
            ...threadMessages.map(message => ({
                role: message.role === 'user' ? 'user' : 'assistant',
                content: message.content
            }))
        ];
    }

    async createThread() {
        const threadId = `${this.provider}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        this.messages.set(threadId, []);
        return { id: threadId };
    }

    async addMessage(threadId, message) {
        const threadMessages = this._getThreadMessages(threadId);
        threadMessages.push({ role: 'user', content: message });
        this.messages.set(threadId, threadMessages);
        return { id: `${threadId}-msg-${threadMessages.length}` };
    }

    async runAssistant(threadId, modelName = this.model) {
        const threadMessages = this._getThreadMessages(threadId);

        if (this.provider === 'openai') {
            if (!this.client) {
                throw new Error('OpenAI no está configurado. Define OPENAI_API_KEY o usa LLM_PROVIDER=ollama.');
            }

            // Se envía al modelo de OpenAI el historial del chat en el formato esperado.
            const completion = await this.client.chat.completions.create({
                model: modelName,
                messages: this._buildOpenAIChatMessages(threadMessages)
            });

            // Se recibe la respuesta del modelo y se guarda para el siguiente turno.
            const assistantReply = completion.choices?.[0]?.message?.content || '';
            threadMessages.push({ role: 'assistant', content: assistantReply });
            this.messages.set(threadId, threadMessages);

            return { status: 'completed', response: assistantReply };
        }

        // Se envía al servidor de Ollama un cuerpo con el modelo, el historial y la instrucción del sistema.
        const response = await fetch(`${this.baseUrl.replace(/\/$/, '')}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: modelName,
                messages: this._buildOllamaMessages(threadMessages),
                stream: false,
                keep_alive: config.llm.keepAlive
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error de Ollama: ${errorText}`);
        }

        // Se recibe la respuesta de Ollama y se extrae el contenido del mensaje.
        const data = await response.json();
        const assistantReply = data.message?.content || data.response || '';
        threadMessages.push({ role: 'assistant', content: assistantReply });
        this.messages.set(threadId, threadMessages);

        return { status: 'completed', response: assistantReply };
    }

    async getMessages(threadId) {
        const threadMessages = this._getThreadMessages(threadId);
        return {
            data: threadMessages.map(message => ({
                role: message.role,
                content: [{ text: { value: message.content } }]
            }))
        };
    }

    async updateModel(newModel) {
        this.model = newModel;
        return true;
    }

    getConfig() {
        return {
            provider: this.provider,
            model: this.model,
            status: 'ok'
        };
    }
}

module.exports = new OpenAIService(); 