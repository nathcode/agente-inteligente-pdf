import React from 'react';
import PropTypes from 'prop-types';

const ChatMessage = ({ role, content }) => {
    return (
        <div className={`message-bubble ${role === 'user' ? 'user-message' : 'bot-message'}`}>
            <div className="message-content">
                {content}
            </div>
        </div>
    );
};

ChatMessage.propTypes = {
    role: PropTypes.oneOf(['user', 'assistant']).isRequired,
    content: PropTypes.string.isRequired
};

export default ChatMessage; 