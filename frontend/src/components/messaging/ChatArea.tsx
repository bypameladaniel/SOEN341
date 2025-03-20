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
  timestamp: string;
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
    let isMounted = true;
    const debounceTimer = setTimeout(() => {
      const fetchMessages = async () => {
        try {
          setIsLoading(true);
          setError(null);
          setMessages([]);
  
          const [messagesResponse, currentUserResponse] = await Promise.all([
            api.get(`http://localhost:8000/api/channels/${channelName}/messages/`),
            api.get("http://localhost:8000/app/auth/user/"),
          ]);
  
          if (!isMounted) return;
  
          const user = currentUserResponse.data.username;
          setCurrentUser(user);
        
          const formattedMessages = messagesResponse.data.messages.map((message: Message) => ({
            message: message.content,
            sender: user === message.user.username, // this has to be user and not currentUser because it's async so currentUser still holds null at this point
            timestamp: new Date(message.timestamp).toLocaleTimeString(), // Format the timestamp
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
  
      if (channelName) {
        fetchMessages();
      }
    }, 100);

    if (channelName && currentUser) {
      const socket = new WebSocket(`ws://localhost:8000/ws/chat/${channelName}/`);

      socket.onopen = () => {
        console.log('WebSocket connection established');
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const newMessage = {
          message: data.message,
          sender: data.user === currentUser,
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };

      socket.onclose = (event) => {
        console.log('WebSocket connection closed', event);
      };

      setWs(socket);
    }
  
    return () => {
      if (ws) {
        ws.close();
      }

      isMounted = false;
      clearTimeout(debounceTimer);
    };
  }, [channelName, currentUser]);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

    //Handle sending messages
    const sendMessage = (message: string) => {
      //websocket
      if (ws) {
        ws.send(JSON.stringify({ message, user: currentUser }));
      }
  
        // Send the message to the server via the route so it gets added to database meaning it gets loaded when you enter the channel :))) yipee woohoo
        api
        .post(`http://localhost:8000/api/channels/message/add/`, { channel: channelName, content: message })
        .catch((error) => {
          console.error('Error sending message:', error);
          // Revert the UI if the message fails to send :( oh no
          setMessages((prevMessages) => prevMessages.filter((msg) => msg.message !== message));
        });
    };

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
            senderName={msg.senderName}
            timestamp={msg.timestamp} // Pass timestamp to MessageBubble
          />
        ))}
      </div>
      <div className="chat-input">
        <ChatInputTextBox onSend={sendMessage} />
      </div>
    </div>
  );
};

export default ChatArea;