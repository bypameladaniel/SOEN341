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
  const { channelName } = useParams<{ channelName: string }>();
  const [messages, setMessages] = useState<{ message: string; sender: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessagesAndUser = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setMessages([]);
        const [messagesResponse, currentUserResponse] = await Promise.all([
          api.get(`http://localhost:8000/api/channels/${channelName}/messages/`),
          api.get("http://localhost:8000/app/auth/user/"),
        ]);

        const user = currentUserResponse.data.username;
        setCurrentUser(user);

        const formattedMessages = messagesResponse.data.messages.map((message: Message) => ({
          message: message.content,
          sender: user === message.user.username,
        }));

        setMessages(formattedMessages);
      } catch (error) {
        setError('Failed to fetch messages. Please try again later.');
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (channelName) {
      fetchMessagesAndUser();
    }
  }, [channelName]);

  useEffect(() => {
    if (channelName && currentUser) {
      const socket = new WebSocket(`ws://localhost:8000/ws/chat/${channelName}/`);

      socket.onopen = () => {
        console.log('WebSocket connection established');
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const newMessage = {
          message: data.message,
          sender: data.sender === currentUser,
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };

      socket.onclose = (event) => {
        console.log('WebSocket connection closed', event);
      };

      setWs(socket);

      // Cleanup WebSocket connection on unmount
      return () => {
        socket.close();
      };
    }
  }, [channelName, currentUser]);

  // Step 4: Handle sending messages via WebSocket
  const sendMessage = (message: string) => {
    if (ws) {
      ws.send(JSON.stringify({ message }));
      
      // Optimistically update the UI
      setMessages((prevMessages) => [...prevMessages, { message, sender: true }]);
    }
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
          <MessageBubble key={index} message={msg.message} sender={msg.sender} />
        ))}
      </div>
      <div className="chat-input">
        <ChatInputTextBox onSend={sendMessage} />
      </div>
    </div>
  );
};

export default ChatArea;