import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './ChatArea.css';
import MessageBubble from './MessageBubble';
import ChatInputTextBox from './ChatInputTextBox';
import api from '../../api';

const ChatArea: React.FC = () => {
  const { channelId } = useParams<{ channelId: string }>(); // Extract channelId from URL
  const [messages, setMessages] = useState<{ message: string; sender: boolean }[]>([]);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Fetch messages for the selected channel
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get(`http://localhost:8000/api/channels/${channelId}/messages/`);
        if(response.data.length > 0) {
          setMessages(response.data);
        }
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (channelId) {
      fetchMessages();
    }
  }, [channelId]); // Re-fetch messages when channelId changes

  const sendMessage = (message: string, sender: boolean) => {
    setMessages((prevMessages) => [...prevMessages, { message, sender }]);

    // Send message to backend
    api.post(`http://localhost:8000/api/channels/${channelId}/messages/`, { message })
      .then(response => {
        console.log('Message sent successfully:', response.data);
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });
  };

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
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