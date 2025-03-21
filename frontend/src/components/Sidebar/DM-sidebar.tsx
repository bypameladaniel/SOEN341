import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { MessageCircle, Settings, User, UsersRound } from "lucide-react";
import "./sidebar.css";
import logout from "../authentication/logout";
import api from "../../api";

interface User {
  id: number;
  username: string;
  email: string;
  profile_picture: string | null;
  role: string;
}

const DirectSidebar = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  const handleLogout = async () => {
    await logout();
    <Navigate to="/"></Navigate>
    window.location.reload(); // Refresh the page
  };

  // Fetch conversations from Django backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("http://localhost:8000/api/direct_messages/list-users/");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <nav className="sidebar">
      <ul className="sidebar-list">
        <li className="sidebar-item">
          <Link to="/app/groupsidebar" className="sidebar-link">
            Channels <UsersRound size={24} />
          </Link>
        </li>
  
        {loading ? (
        <p>Loading users...</p>
        ) : (
          users.map((user) => (
            <li key={user.id} className="sidebar-item">
              <Link to={`/conversations/${user.id}`} className="sidebar-link">
                <MessageCircle size={20} /> {user.username}
              </Link>
            </li>
          ))
        )}

      </ul>

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

export default DirectSidebar;
