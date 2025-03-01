import React, { useState } from "react";
import defaultPfp from "./images/defaultPfp.png";
import { Link } from "react-router-dom";
import { ArrowBigLeft, PencilLine } from "lucide-react";
import "./profile.css";


const Profile: React.FC = () => {
    const [profilePic, setProfilePic] = useState<string>(defaultPfp); //need to fetch from backend
    const [username, setUsername] = useState<string>("Username"); //need to fetch from backend
    const [role] = useState<string>("Member"); //add setRole function AND need to fetch from backend
    const [email] = useState<string>("user@example.com"); //add setEmail function AND need to fetch from backend
    const [showFileInput, setShowFileInput] = useState<boolean>(false);
    const [newUsername, setNewUsername] = useState<string>("");
    const [showUsernameInput, setShowUsernameInput] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    const changeProfilePic = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setProfilePic(imageUrl);
        }
    };
    const changeRole = async () => {
        console.log("change role");
        // const newRole = role === "member" ? "admin" : "member";
        setLoading(true);
        // try {
        //   const response = await api.post("http://127.0.0.1:8000/api/update-role/", {
        //     role: newRole,
        //   });
    
        //   if (response.status === 200) {
        //     setRole(newRole);
        //   }
        // } catch (error) {
        //   console.error("Error updating role:", error);
        // } finally {
        //   setLoading(false);
        // }
    }
    
    const changeEmail =() => {
        console.log("change email");
    }

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
                        <div className="profile-item">
                            <p><strong>Role:</strong> {role}</p> 
                            <button onClick={changeRole} className="edit-button"><PencilLine className="edit-icon"/></button>
                        </div>
                        <div className="profile-item">
                            <p><strong>Email:</strong> {email}</p> 
                            <button onClick={changeEmail} className="edit-button"><PencilLine className="edit-icon"/></button>
                        </div>
                        
                    </div>
                    <Link to="/settings" className="back-button"> <ArrowBigLeft size={24} className="back-icon" /> <span>Back to Settings</span> </Link>
                    <Link to="/app/groupsidebar" className="back-button"> <ArrowBigLeft size={24} className="back-icon" /><span>Back to Text Channels</span></Link>

                </div>
                
            </div>
        </div>
    );
};

export default Profile;