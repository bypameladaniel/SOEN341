import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Settings, User, UsersRound } from "lucide-react";
import "./DM-sidebar.css";

const DirectSidebar = () => {
  // State for direct message conversations
  const [conversations, setConversations] = useState([
    { id: 1, name: "Conversation A", path: "/ConversationA" },
    { id: 2, name: "Conversation B", path: "/ConversationB" },
    { id: 3, name: "Conversation C", path: "/ConversationC" }
  ]);
  
  // Placeholder function for future backend integration
  const addConversation = () => {
    // Functionality will be implemented later
    console.log("Add conversation functionality will be added later.");
  };
  
  return (
    <nav className="sidebar">
      <ul className="sidebar-list">
        <li className="sidebar-item">
          <Link to="/GroupSidebar" className="sidebar-link">
            Channels <UsersRound size={24} />
          </Link>
        </li>
  
        {/* Dynamically render conversations */}
        {conversations.map((conversation) => (
          <li key={conversation.id} className="sidebar-item">
            <Link to={conversation.path} className="sidebar-link">
              <MessageCircle size={20} /> {conversation.name}
            </Link>
          </li>
        ))}
      </ul>
  
      {/* New Conversation Button (currently does nothing) */}
      <button onClick={addConversation} className="new-conversation-btn">
        ➕ New Conversation
      </button>

      {/* Sidebar bottom links */}
      <ul className="sidebar-bottom">
        <li className="sidebar-item">
          <Link to="/settings" className="sidebar-link">
            Settings <Settings size={24} />
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/profile" className="sidebar-link">
            Profile <User size={24} />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default DirectSidebar;
