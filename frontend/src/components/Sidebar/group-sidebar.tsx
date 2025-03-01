import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { MessageCircle, Settings, User, Inbox } from "lucide-react";
import "./group-sidebar.css";
import logout from "../logout";

// Define a type for channels
interface Channel {
  id: number;
  name: string;
}

const GroupSidebar = () => {
  // State for group channels
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await logout();
    <Navigate to="/"></Navigate>
    window.location.reload(); // Refresh the page
  };

  // Fetch channels from Django backend
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/channels/"); // Adjust endpoint as needed
        if (!response.ok) {
          throw new Error("Failed to fetch channels");
        }
        const data: Channel[] = await response.json();
        setChannels(data);
      } catch (error) {
        console.error("Error fetching channels:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChannels();
  }, []);

  // Function to add a new group channel
  const addChannel = async (channelName: string) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/channels/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: channelName }),
      });
      if (!response.ok) {
        throw new Error("Failed to add channel");
      }
      const newChannel: Channel = await response.json();
      setChannels([...channels, newChannel]);
    } catch (error) {
      console.error("Error adding channel:", error);
    }
  };

  return (
    <nav className="sidebar">
      <ul className="sidebar-list">
        <li className="sidebar-item">
          <Link to="/app/DirectSidebar" className="sidebar-link">
            Direct Messages <Inbox size={24} />
          </Link>
        </li>

        {loading ? (
          <p>Loading channels...</p>
        ) : (
          channels.map((channel) => (
            <li key={channel.id} className="sidebar-item">
              <Link to={`/channels/${channel.id}`} className="sidebar-link">
                <MessageCircle size={20} /> {channel.name}
              </Link>
            </li>
          ))
        )}
      </ul>

      <button onClick={() => addChannel(`New Channel ${channels.length + 1}`)} className="add-channel-btn">
        ➕ Add Channel
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
        <li>
          <Link to="/" className="logout-button">
            <button onClick={handleLogout}>
              Log Out
            </button>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default GroupSidebar;