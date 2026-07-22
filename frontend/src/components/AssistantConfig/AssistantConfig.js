import React from 'react';
import PropTypes from 'prop-types';

const AssistantConfig = ({
    modelName,
    setModelName,
    currentModel,
    provider,
    onSubmit,
    onClose
}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!modelName.trim()) return;
        onSubmit(e);
    };

    const placeholder = provider === 'ollama'
        ? 'Modelo de Ollama (ej. llama3.2)'
        : 'Modelo de OpenAI (ej. gpt-4o-mini)';
    const submitLabel = 'Guardar modelo';
    const currentLabel = 'Modelo actual:';

    return (
        <div className="assistant-config">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
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
            {currentModel && (
                <p className="current-assistant">
                    {currentLabel} {currentModel}
                </p>
            )}
        </div>
    );
};

AssistantConfig.propTypes = {
    modelName: PropTypes.string.isRequired,
    setModelName: PropTypes.func.isRequired,
    currentModel: PropTypes.string,
    provider: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default AssistantConfig; 