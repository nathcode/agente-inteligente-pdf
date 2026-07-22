import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const ChatContainer = ({ messages, input, setInput, isLoading, onSubmit }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <main className="chat-container">
            <div className="messages-container">
                {messages.map((message, index) => (
                    <ChatMessage
                        key={index}
                        role={message.role}
                        content={message.content}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>
            <ChatInput
                input={input}
                setInput={setInput}
                isLoading={isLoading}
                onSubmit={onSubmit}
            />
        </main>
    );
};

ChatContainer.propTypes = {
    messages: PropTypes.arrayOf(
        PropTypes.shape({
            role: PropTypes.oneOf(['user', 'assistant']).isRequired,
            content: PropTypes.string.isRequired
        })
    ).isRequired,
    input: PropTypes.string.isRequired,
    setInput: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired
};

export default ChatContainer; 