import React from 'react';
import PropTypes from 'prop-types';

const AssistantConfig = ({ 
    assistantId, 
    setAssistantId, 
    currentAssistant, 
    onSubmit, 
    onClose 
}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!assistantId.trim()) return;
        onSubmit(e);
    };

    return (
        <div className="assistant-config">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={assistantId}
                    onChange={(e) => setAssistantId(e.target.value)}
                    placeholder="ID del asistente de OpenAI"
                    className="assistant-input"
                />
                <button type="submit" className="config-submit-button">
                    Actualizar Asistente
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
                    Asistente actual: {currentAssistant}
                </p>
            )}
        </div>
    );
};

AssistantConfig.propTypes = {
    assistantId: PropTypes.string.isRequired,
    setAssistantId: PropTypes.func.isRequired,
    currentAssistant: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default AssistantConfig; 