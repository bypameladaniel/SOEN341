import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './ChatArea.css';
import MessageBubble from './MessageBubble';
import ChatInputTextBox from './ChatInputTextBox';
import api from '../../api';

interface GroupMessage {
  content: string;
  user: {
    username: string;
    profile_picture: string;
  };
  senderName: string;
  timestamp: string;
  profilePicture: string;
}

interface DirectMessage {
  message: string;
  sender: {
    username: string;
    profile_picture: string;
  };
  senderName: string;
  timestamp: string;
  profilePicture: string;
}

type MessageType = GroupMessage | DirectMessage;

interface User {
  id: string;
  name: string;
}

const ChatArea: React.FC = () => {
  const { channelName, userId } = useParams<{ channelName?: string; userId?: string }>();
  const isDirectMessage = !!userId;
  
  const [messages, setMessages] = useState<{ message: string; sender: boolean; senderName:string; timestamp: string; profilePicture: string; }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Fetch messages and current user
  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setMessages([]);

      const [messagesResponse, currentUserResponse] = await Promise.all([
        isDirectMessage
          ? api.get(`http://localhost:8000/api/direct_messages/${userId}/`)
          : api.get(`http://localhost:8000/api/channels/${channelName}/messages/`),
        api.get("http://localhost:8000/app/auth/user/"),
      ]);

      const username = currentUserResponse.data.username;
      const id = currentUserResponse.data.id;
      setCurrentUser({ id, name: username });
      console.log(messagesResponse.data.messages[1].user.profile_picture);

      const formattedMessages = (isDirectMessage
        ? messagesResponse.data.direct_messages
        : messagesResponse.data.messages
      ).map((message: MessageType) => ({
        message: isDirectMessage ? (message as DirectMessage).message : (message as GroupMessage).content,
        sender: isDirectMessage ? username === (message as DirectMessage).sender.username : username === (message as GroupMessage).user.username,
        senderName: isDirectMessage ? (message as DirectMessage).sender.username : (message as GroupMessage).user.username,
        timestamp: new Date(message.timestamp).toLocaleTimeString(),
        profilePicture: `http://localhost:8000${isDirectMessage 
          ? (message as DirectMessage).sender.profile_picture 
          : (message as GroupMessage).user.profile_picture}`
      }));

      setMessages(formattedMessages);
    } catch (error) {
      setError('Failed to fetch messages. Please try again later.');
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize WebSocket connection
  const initWebSocket = () => {
    if (!currentUser) return;

    const socketUrl = isDirectMessage
      ? `ws://localhost:8000/ws/chat/${Math.min(Number(userId), Number(currentUser.id))}_${Math.max(Number(userId), Number(currentUser.id))}/`
      : `ws://localhost:8000/ws/chat/${channelName}/`;

    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(new Date(data.timestamp).toLocaleTimeString());
      const newMessage = {
        message: data.message,
        sender: data.user.name === currentUser.name,
        timestamp: new Date(data.timestamp).toLocaleTimeString(),
        senderName: data.user.name,
        profilePicture: data.user.profile_picture
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      {console.log(messages);}

    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed', event);
    };

    setWs(socket);
  };

  useEffect(() => {
    if(!isLoading) {
      initWebSocket();
    }
  }, [isLoading, initWebSocket]);

  useEffect(() => {
      fetchMessages();  // Fetch messages when component mounts or params change

      if (ws) {
        ws.close();
      }
    
  }, [channelName, userId]);

  // , fetchMessages, ws

//   useEffect(() => {
//     // Only initialize the WebSocket connection once `currentUser` is set
//     if (currentUser && !ws) {
//       initWebSocket();  // Establish the WebSocket connection only once
//     }
// }, [currentUser, ws]);  // Dependency on `currentUser` and `ws` ensures WebSocket is created only once


  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  // Handle sending messages
  const sendMessage = (message: string) => {
    if (ws) {
      ws.send(JSON.stringify({ message, user: currentUser }));
    }

    api
      .post(
        isDirectMessage
          ? `http://localhost:8000/api/direct_messages/send-message/`
          : `http://localhost:8000/api/channels/message/add/`,
        isDirectMessage
          ? { receiver: userId, message: message }
          : { channel: channelName, content: message }
      )
      .catch((error) => {
        console.error('Error sending message:', error);
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
            timestamp={msg.timestamp}
            profilePicture={msg.profilePicture}
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
