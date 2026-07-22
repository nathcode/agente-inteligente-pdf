import React, { useState, useEffect } from 'react';
import chatService from './services/chat.service';
import ChatContainer from './components/Chat/ChatContainer';
import AssistantConfig from './components/AssistantConfig/AssistantConfig';
import './App.css';

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [threadId, setThreadId] = useState(null);
    const [modelName, setModelName] = useState('');
    const [currentModel, setCurrentModel] = useState(null);
    const [provider, setProvider] = useState('openai');
    const [showAssistantConfig, setShowAssistantConfig] = useState(false);

    // Cargar la configuración inicial
    useEffect(() => {
        const loadConfig = async () => {
            try {
                const config = await chatService.getConfig();
                const selectedModel = config.model || '';
                setModelName(selectedModel);
                setCurrentModel(selectedModel);
                setProvider(config.provider || 'openai');
            } catch (error) {
                console.error('Error al cargar la configuración:', error);
                setMessages([{
                    role: 'assistant',
                    content: 'Error al cargar la configuración. Por favor, recarga la página.'
                }]);
            }
        };
        loadConfig();
    }, []);

    const handleModelChange = async (e) => {
        e.preventDefault();
        if (!modelName.trim()) return;

        try {
            await chatService.updateModel(modelName.trim());
            setCurrentModel(modelName.trim());
            setShowAssistantConfig(false);
            setMessages([]);
            setThreadId(null);

            setMessages([{
                role: 'assistant',
                content: `Modelo actualizado a: ${modelName.trim()}`
            }]);
        } catch (error) {
            console.error('Error al actualizar el modelo:', error);
            setMessages([{
                role: 'assistant',
                content: 'Error al actualizar el modelo. Por favor, verifica el nombre e intenta de nuevo.'
            }]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await chatService.sendMessage(
                userMessage,
                threadId,
                currentModel
            );

            if (!threadId && response.threadId) {
                setThreadId(response.threadId);
            }

            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: response.response 
            }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.' 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Soporte Interno</h1>
                <button 
                    className="config-button"
                    onClick={() => setShowAssistantConfig(!showAssistantConfig)}
                >
                    {showAssistantConfig ? 'Cerrar Configuración' : 'Configurar Modelo'}
                </button>
            </header>

            {showAssistantConfig && (
                <AssistantConfig
                    modelName={modelName}
                    setModelName={setModelName}
                    currentModel={currentModel}
                    provider={provider}
                    onSubmit={handleModelChange}
                    onClose={() => setShowAssistantConfig(false)}
                />
            )}

            <ChatContainer
                messages={messages}
                input={input}
                setInput={setInput}
                isLoading={isLoading}
                onSubmit={handleSubmit}
            />
        </div>
    );
}

export default App; 