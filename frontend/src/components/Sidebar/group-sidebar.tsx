import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Settings, User, Inbox } from "lucide-react";
import "./group-sidebar.css";

const GroupSidebar = () => {
  // State for group channels
  const [channels, setChannels] = useState([
    { id: 1, name: "Channel A", path: "/ChannelA" },
    { id: 2, name: "Channel B", path: "/ChannelB" },
    { id: 3, name: "Channel C", path: "/ChannelC" }
  ]);

  // Function to add a new group channel (backend integration later)
  const addChannel = (channelName: string) => {
    const newChannel = {
      name: channelName,
      path: `/channel-${channelName.toLowerCase().replace(/\s+/g, "-")}`
    }
  };

  return (
    <nav className="sidebar">
      <ul className="sidebar-list">
        <li className="sidebar-item">
          <Link to="/DirectSidebar" className="sidebar-link">
            Direct Messages <Inbox size={24} />
          </Link>
        </li>

        {/* Dynamically render group channels */}
        {channels.map((channel) => (
          <li key={channel.id} className="sidebar-item">
            <Link to={channel.path} className="sidebar-link">
              <MessageCircle size={20} /> {channel.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Add Channel button */}
      <button onClick={() => addChannel(`New Channel ${channels.length + 1}`)} className="add-channel-btn">
        ➕ Add Channel
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

export default GroupSidebar;
