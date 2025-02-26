import { Link } from "react-router-dom";
import { MessageCircle, Settings, User, UsersRound } from "lucide-react";
import "./DM-sidebar.css"

const DirectSidebar = () => {
  return (
        <nav className="sidebar">
          <ul className="sidebar-list">
            <li className="sidebar-item">
              <Link to="/GroupSidebar" className="sidebar-link">Channels
                <UsersRound size={24} />
              </Link>
            </li>
            {/*need to implement adding group text channels */}
            <li className="sidebar-item">
              <Link to="/ChannelA" className="sidebar-link">
                <MessageCircle size={20} /> Channel A
              </Link>
            </li>
            <li className="sidebar-item">
              <Link to="/ChannelB" className="sidebar-link">
                <MessageCircle size={20} /> Channel B
              </Link>
            </li>
            <li className="sidebar-item">
              <Link to="/ChannelC" className="sidebar-link">
                <MessageCircle size={20} /> Channel C
              </Link>
            </li>
            
          </ul>
          <ul className="sidebar-bottom">
            <li className="sidebar-item">
              <Link to="/settings" className="sidebar-link">Settings
                <Settings size={24} />
              </Link>
            </li>
            <li className="sidebar-item">
              <Link to="/profile" className="sidebar-link">Profile
                <User size={24} />
              </Link>
            </li>
          </ul>
        </nav>
      );
    };

export default DirectSidebar;