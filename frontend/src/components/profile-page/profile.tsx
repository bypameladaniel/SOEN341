import React, { useState } from "react";
import defaultPfp from "./images/defaultPfp.png";
import { Link } from "react-router-dom";
import { ArrowBigLeft } from "lucide-react";
import "./profile.css";


const Profile: React.FC = () => {
    const [profilePic, setProfilePic] = useState<string>(defaultPfp);
    const [username, setUsername] = useState<string>("Username");
    const [role] = useState<string>("Member"); //add setRole function
    const [email] = useState<string>("user@example.com"); //add setEmail function
    const [showFileInput, setShowFileInput] = useState<boolean>(false);
    const [newUsername, setNewUsername] = useState<string>("");
    const [showUsernameInput, setShowUsernameInput] = useState<boolean>(false);

    const changeProfilePic = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setProfilePic(imageUrl);
        }
    };

    const removeProfilePic = () => {
        setProfilePic(defaultPfp);
    };

    const updateUsername = () => {
        if (!/^[^\s]{1,16}$/.test(newUsername)) {
            alert("Username must be 1-16 characters long with no spaces.");
            return;
        }
        setUsername(newUsername);
        setNewUsername("");
        setShowUsernameInput(false);
    };

    return (
        <div className="profile">
            
            <div className="profile-container">
                <div className="profile-box">
                    <h2>{username}</h2>
                    <button onClick={() => setShowUsernameInput(!showUsernameInput)} className="change-username">Change Username</button>
                    {showUsernameInput && (
                        <div className="username-input-container">
                            <input 
                                className="new-username-box"
                                type="text" 
                                value={newUsername} 
                                onChange={(e) => setNewUsername(e.target.value)} 
                                placeholder="Enter new username"
                            />
                            <button onClick={updateUsername} className="update-username">Update Username</button>
                        </div>
                    )}
                    <div className="profile-pic-container">
                        <img src={profilePic} alt="Profile" className="profile-pic" />
                        <button onClick={() => setShowFileInput(!showFileInput)} className="change-pfp">Change Profile Picture</button>
                        {showFileInput && <input type="file" accept="image/*" onChange={changeProfilePic} />}
                        <button onClick={removeProfilePic} className="remove-pfp">Remove Profile Picture</button>
                    </div>
                    <div className="profile-details">
                        <p><strong>Role:</strong> {role}</p>
                        <p><strong>Email:</strong> {email}</p>
                        
                    </div>
                    <Link to="/settings" className="back-button"> <ArrowBigLeft size={24} className="back-icon" /> <span>Back to Settings</span> </Link>
                    <Link to="/app/groupsidebar" className="back-button"> <ArrowBigLeft size={24} className="back-icon" /><span>Back to Text Channels</span></Link>

                </div>
                
            </div>
        </div>
    );
};

export default Profile;