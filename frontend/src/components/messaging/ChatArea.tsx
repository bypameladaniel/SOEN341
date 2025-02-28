import React, { useState, useEffect, useRef } from 'react';
import './ChatArea.css';
import MessageBubble from './MessageBubble';
import ChatInputTextBox from './ChatInputTextBox';
import api from '../../api';

const ChatArea: React.FC = () => {
  const [messages, setMessages] = useState<{ message: string; sender: boolean }[]>([]);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const sendMessage = (message: string, sender: boolean) => {
    setMessages((prevMessages) => [...prevMessages, { message, sender }]);

    
  };

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-area">
      <div className="message-container" ref={messageContainerRef}>
        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg.message} sender={msg.sender} />
        ))}
      </div>
      <div className="chat-input">
        <ChatInputTextBox onSend={(message) => sendMessage(message, true)} />
      </div>
    </div>
  );
};

export default ChatArea;