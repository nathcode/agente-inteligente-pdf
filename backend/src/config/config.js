require('dotenv').config();

const provider = (process.env.LLM_PROVIDER || 'openai').toLowerCase();
const model = process.env.LLM_MODEL || process.env.OPENAI_MODEL || process.env.OLLAMA_MODEL || (provider === 'ollama' ? 'llama3.2' : 'gpt-4o-mini');
const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

module.exports = {
    port: process.env.PORT || 3000,
    llm: {
        provider,
        model,
        baseUrl,
        keepAlive: process.env.OLLAMA_KEEP_ALIVE || '5m'
    },
    openai: {
        apiKey: process.env.OPENAI_API_KEY
    },
    cors: {
        origin: process.env.CORS_ORIGIN || '*'
    }
}; 