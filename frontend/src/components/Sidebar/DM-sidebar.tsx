import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Settings, User, UsersRound } from "lucide-react";
import "./DM-sidebar.css";

// Define a type for conversations
interface Conversation {
  id: number;
  name: string;
}

const DirectSidebar = () => {
  // State for direct message conversations
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch conversations from Django backend
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/conversations/"); // Adjust endpoint as needed
        if (!response.ok) {
          throw new Error("Failed to fetch conversations");
        }
        const data: Conversation[] = await response.json();
        setConversations(data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  // Function to add a new conversation
  const addConversation = async (conversationName: string) => {
    try {
      const response = await fetch("http://localhost:8000/api/conversations/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: conversationName }),
      });
      if (!response.ok) {
        throw new Error("Failed to add conversation");
      }
      const newConversation: Conversation = await response.json();
      setConversations([...conversations, newConversation]);
    } catch (error) {
      console.error("Error adding conversation:", error);
    }
  };

  return (
    <nav className="sidebar">
      <ul className="sidebar-list">
        <li className="sidebar-item">
          <Link to="/app/GroupSidebar" className="sidebar-link">
            Channels <UsersRound size={24} />
          </Link>
        </li>
  
        {loading ? (
          <p>Loading conversations...</p>
        ) : (
          conversations.map((conversation) => (
            <li key={conversation.id} className="sidebar-item">
              <Link to={`/conversations/${conversation.id}`} className="sidebar-link">
                <MessageCircle size={20} /> {conversation.name}
              </Link>
            </li>
          ))
        )}
      </ul>
  
      <button onClick={() => addConversation(`New Conversation ${conversations.length + 1}`)} className="new-conversation-btn">
        ➕ New Conversation
      </button>

      <ul className="sidebar-bottom">
        <li className="sidebar-item">
          <Link to="/settings" className="sidebar-link">
            <Settings size={24} /> Settings 
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/profile" className="sidebar-link">
            <User size={24} /> Profile 
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default DirectSidebar;
