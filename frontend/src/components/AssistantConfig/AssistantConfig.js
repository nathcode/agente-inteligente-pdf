import React from 'react';
import PropTypes from 'prop-types';

const AssistantConfig = ({ 
    assistantId, 
    setAssistantId, 
    currentAssistant, 
    provider, 
    onSubmit, 
    onClose 
}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!assistantId.trim()) return;
        onSubmit(e);
    };

    const placeholder = provider === 'ollama'
        ? 'Modelo de Ollama (ej. llama3.2)'
        : 'ID del asistente de OpenAI';
    const submitLabel = provider === 'ollama' ? 'Actualizar modelo' : 'Actualizar Asistente';
    const currentLabel = provider === 'ollama' ? 'Modelo actual:' : 'Asistente actual:';

    return (
        <div className="assistant-config">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={assistantId}
                    onChange={(e) => setAssistantId(e.target.value)}
                    placeholder={placeholder}
                    className="assistant-input"
                />
                <button type="submit" className="config-submit-button">
                    {submitLabel}
                </button>
                <button 
                    type="button" 
                    onClick={onClose}
                    className="config-close-button"
                >
                    Cerrar
                </button>
            </form>
            {currentAssistant && (
                <p className="current-assistant">
                    {currentLabel} {currentAssistant}
                </p>
            )}
        </div>
    );
};

AssistantConfig.propTypes = {
    assistantId: PropTypes.string.isRequired,
    setAssistantId: PropTypes.func.isRequired,
    currentAssistant: PropTypes.string,
    provider: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default AssistantConfig; 