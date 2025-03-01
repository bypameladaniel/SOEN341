import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './ChatArea.css';
import MessageBubble from './MessageBubble';
import ChatInputTextBox from './ChatInputTextBox';
import api from '../../api';

const ChatArea: React.FC = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const [messages, setMessages] = useState<{ message: string; sender: boolean }[]>([]);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setMessages([]);

        const response = await api.get(`http://localhost:8000/api/channels/${channelId}/messages/`);

        const currentUser = (await api.get("http://localhost:8000/app/auth/user/")).data.username;
        console.log(`currentUser: ${currentUser}`);
        
        let messages = response.data.messages;

        console.log(messages);

        for (let i = 0; i < messages.length; i++) {
          console.log(`message ${i} user: ${messages[i].user}`);
          setMessages((prevMessages) => [...prevMessages, { message: messages[i].content, sender: ((currentUser == messages[i].user.username)? true : false) }]);
        }

      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (channelId) {
      fetchMessages();
    }
  }, [channelId]);

  const sendMessage = (message: string, sender: boolean) => {
    // Optimistically update the UI
    setMessages((prevMessages) => [...prevMessages, { message, sender }]);

    // Send message to backend
    api.post(`http://localhost:8000/api/channels/message/add/`, { channel: channelId, content: message })
      .then(response => {
        console.log('Message sent successfully:', response.data);
        // Optionally, you can re-fetch messages to ensure consistency
        // fetchMessages();
      })
      .catch(error => {
        console.error('Error sending message:', error);
        // Revert the optimistic update if the request fails
        setMessages((prevMessages) => prevMessages.filter(msg => msg.message !== message));
      });
  };

  // Auto-scroll to the bottom of the message container
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