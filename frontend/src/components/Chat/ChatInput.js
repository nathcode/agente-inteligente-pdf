import React from 'react';
import PropTypes from 'prop-types';

const ChatInput = ({ input, setInput, isLoading, onSubmit }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        onSubmit(e);
    };

    return (
        <form onSubmit={handleSubmit} className="input-container">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
                disabled={isLoading}
                className="message-input"
            />
            <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`send-button ${(!input.trim() || isLoading) ? 'disabled' : ''}`}
            >
                {isLoading ? (
                    <span className="loading-spinner"></span>
                ) : (
                    'Enviar'
                )}
            </button>
        </form>
    );
};

ChatInput.propTypes = {
    input: PropTypes.string.isRequired,
    setInput: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired
};

export default ChatInput; 