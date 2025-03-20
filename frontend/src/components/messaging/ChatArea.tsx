import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './ChatArea.css';
import MessageBubble from './MessageBubble';
import ChatInputTextBox from './ChatInputTextBox';
import api from '../../api';

interface Message {
  content: string;
  user: {
    username: string;
  };
}

const ChatArea: React.FC = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const [messages, setMessages] = useState<{ message: string; sender: boolean; senderName?: string }[]>([]); // Add senderName to the state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const debounceTimer = setTimeout(() => {
      const fetchMessages = async () => {
        try {
          setIsLoading(true);
          setError(null);
          setMessages([]);
  
          const [messagesResponse, currentUserResponse] = await Promise.all([
            api.get(`http://localhost:8000/api/channels/${channelId}/messages/`),
            api.get("http://localhost:8000/app/auth/user/"),
          ]);
  
          if (!isMounted) return;
  
          const currentUser = currentUserResponse.data.username;
          const formattedMessages = messagesResponse.data.messages.map((message: Message) => ({
            message: message.content,
            sender: currentUser === message.user.username,
            senderName: message.user.username, // Add senderName to the message object
          }));
  
          setMessages(formattedMessages);
        } catch (error) {
          if (isMounted) {
            setError('Failed to fetch messages. Please try again later.');
            console.error('Error fetching messages:', error);
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };
  
      if (channelId) {
        fetchMessages();
      }
    }, 100);
  
    return () => {
      isMounted = false;
      clearTimeout(debounceTimer);
    };
  }, [channelId]);

  const sendMessage = (message: string, sender: boolean) => {
    // Optimistically update the UI
    setMessages((prevMessages) => [...prevMessages, { message, sender }]);

    // Send the message to the server
    api
      .post(`http://localhost:8000/api/channels/message/add/`, { channel: channelId, content: message })
      .catch((error) => {
        console.error('Error sending message:', error);
        // Revert the UI if the message fails to send
        setMessages((prevMessages) => prevMessages.filter((msg) => msg.message !== message));
      });
  };

  // Auto-scroll to the bottom when messages change
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
        {isLoading && <p>Loading messages...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {messages.map((msg, index) => (
          <MessageBubble 
            key={index} 
            message={msg.message} 
            sender={msg.sender} 
            senderName={msg.senderName} // Pass senderName to MessageBubble
          />
        ))}
      </div>
      <div className="chat-input">
        <ChatInputTextBox onSend={(message) => sendMessage(message, true)} />
      </div>
    </div>
  );
};

export default ChatArea;