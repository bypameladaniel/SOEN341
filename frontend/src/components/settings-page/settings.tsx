import { useState } from "react";
import { Link } from "react-router-dom"; 
import { ArrowBigLeft } from "lucide-react";
import "./Settings.css";

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("light");
  const [micVolume, setMicVolume] = useState(50);
  const [cameraEnabled, setCameraEnabled] = useState(true);

  return (
    <div className="settings">
      <div className="settings-container">
        <h1 className="settings-title">Settings</h1>
        
        {/* Edit Profile Button */}
        <div className="edit-profile-container">
          <Link to="/profile" className="edit-profile-button">Edit Profile</Link>
        </div>
        
        {/* Notifications Settings */}
        
          <div>
            <h2 className="card-title">Notifications</h2>
          </div>
          <div className="card-content">
            <span>Enable Notifications</span>
            <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
          </div>
        
        
        {/* Preferences & Appearance */}
        <div>
            <h2 className="card-title">Appearance</h2>
          </div>
          <div className="card-content">
            <label className="label">Theme</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
       
        </div>
        
        {/* Voice & Video Settings */}
        <div>
           <h2 className="card-title">Voice & Video</h2>
      </div>
      <div className="card-content">
          <label className="label">Microphone Volume</label>
          <input type="range" min="0" max="100" value={micVolume} onChange={(e) => setMicVolume(Number(e.target.value))} />
      </div>
      <div className="card-content enable-camera">
          <span>Enable Camera</span>
          <input type="checkbox" checked={cameraEnabled} onChange={(e) => setCameraEnabled(e.target.checked)} />
      </div>

        
        <button className="save-button">Save Changes</button>
        <Link to="/GroupSidebar" className="back-button"> <ArrowBigLeft size={24} className="back-icon" /> <span>Back to Text Channels</span> </Link>
      </div>
    </div>
  );
}

export default Settings;
