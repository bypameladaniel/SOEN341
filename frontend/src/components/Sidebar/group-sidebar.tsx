import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { MessageCircle, Settings, User, Inbox } from "lucide-react";
import "./sidebar.css";
import logout from "../authentication/logout";
import api from "../../api";
import { AxiosResponse } from "axios"; // Import AxiosResponse

// Define a type for channels
interface Channel {
  id: number;
  name: string;
}

// Define the structure of the response data
interface ChannelResponse {
  id: number;
  name: string;
  members: any[]; // Adjust this type based on your actual data structure
}

const GroupSidebar = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string>("member");
  const [showInput, setShowInput] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");

  const handleLogout = async () => {
    await logout();
    <Navigate to="/"></Navigate>;
    window.location.reload(); // Refresh the page
  };

  // Fetch channels from Django backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [channelsResponse, userResponse] = await Promise.all([
          api.get("http://127.0.0.1:8000/api/channels/channel-list/"),
          fetch("http://127.0.0.1:8000/app/auth/user/", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }),
        ]);
  
        // Handle channels response
        setChannels(channelsResponse.data);
        // Handle user role response
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setRole(userData.role);
        } else {
          throw new Error("Failed to fetch user role");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false only once, after both requests
      }
    };
    fetchData();
  }, []);
  

  // Function to add a new group channel
  const addChannel = async (channelName: string) => {
    api
      .post<ChannelResponse>(`http://localhost:8000/api/channels/create/`, {
        name: channelName,
        members: [],
      })
      .then((response: AxiosResponse<ChannelResponse>) => {
        // If the API call is successful, add the new channel to the list
        const newChannel: Channel = response.data; // response.data is now properly typed
        setChannels((prevChannels) => [...prevChannels, newChannel]); // Update the channels state
        setShowInput(false); // Hide the input field and OK/Cancel buttons
        setNewChannelName(""); // Clear the input field
      })
      .catch((error) => {
        console.error("Error creating channel:", error);
      });
  };

  const joinChannel = async (channelId: number) => {
    try {
      const response = await api.get("http://localhost:8000/app/auth/user/");

      await api.post(`http://localhost:8000/api/channels/join/${channelId}/`, {
        user: response.data.username,
      });
    } catch (error: any) {
      console.error("failed to join channel:", error);
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
              <Link
                to={`/channels/${channel.id}`}
                className="sidebar-link"
                onClick={() => {
                  joinChannel(channel.id);
                }}
              >
                <MessageCircle size={20} /> {channel.name}
              </Link>
            </li>
          ))
        )}
      </ul>

      {/* Add Channel Section */}
      {role === "admin" && (
        <div className="create-channel">
          {showInput ? (
            <div>
              <input
                className="channel-name-input"
                type="text"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                placeholder="Enter channel name"
              />
              <button
                className="channel-add-ok"
                onClick={() => addChannel(newChannelName)}
                disabled={!newChannelName.trim()} // Disable OK button if input is empty
              >
                OK
              </button>
              <button className="cancel-channel-add-btn" onClick={() => setShowInput(false)}>Cancel</button>
            </div>
          ) : (
            <button
              onClick={() => setShowInput(true)}
              className="add-channel-btn"
            >
              ➕ Add Channel
            </button>
          )}
        </div>
      )}

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
            <button onClick={handleLogout}>Log Out</button>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default GroupSidebar;
