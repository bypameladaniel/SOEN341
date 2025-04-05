import React, { useState, useEffect } from "react";
import defaultPfp from "./images/defaultPfp.png";
import { Link } from "react-router-dom";
import { ArrowBigLeft, PencilLine } from "lucide-react";
import "./profile.css";

const Profile: React.FC = () => {
    const [profilePic, setProfilePic] = useState<string>(defaultPfp);
    const [username, setUsername] = useState<string>("Username");
    const [role, setRole] = useState<string>("Member");
    const [email, setEmail] = useState<string>("user@example.com");
    const [showFileInput, setShowFileInput] = useState<boolean>(false);
    const [newUsername, setNewUsername] = useState<string>("");
    const [showUsernameInput, setShowUsernameInput] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    const fetchUserData = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/app/auth/user/", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access")}`,
                },
            });
    
            if (response.ok) {
                const data = await response.json();
                setUsername(data.username);
                setEmail(data.email);
                setRole(data.role);
                setProfilePic(data.profile_picture || defaultPfp);
            } else {
                console.error("Failed to fetch user data:", response.statusText);
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };
    
    useEffect(() => {
        fetchUserData();
    }, []);
    

    const changeProfilePic = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const formData = new FormData();
            formData.append("profile_picture", file);
    
            try {
                const response = await fetch("http://127.0.0.1:8000/app/user/modify/", {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`,
                    },
                    body: formData,
                });
    
                if (response.ok) {
                    await fetchUserData();  // Re-fetch user data after upload
                } else {
                    console.error("Failed to update profile picture:", response.statusText);
                }
            } catch (error) {
                console.error("Failed to update profile picture:", error);
            }
        }
    };
    

    const removeProfilePic = async () => {
        try {
            const formData = new FormData();
            formData.append("profile_picture", "");
    
            const response = await fetch("http://127.0.0.1:8000/app/user/modify/", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access")}`,
                },
                body: formData,
            });
    
            console.log("Remove Profile Picture Response:", response);
    
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setProfilePic(defaultPfp);
            } else {
                const errorText = await response.text();
                console.error("Failed to remove profile picture:", errorText);
            }
        } catch (error) {
            console.error("Failed to remove profile picture:", error);
        }
    };

    const updateUsername = async () => {
        if (!/^[^\s]{1,16}$/.test(newUsername)) {
            alert("Username must be 1-16 characters long with no spaces.");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/app/user/modify/", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: newUsername }),
            });
            if (response.ok) {
                setUsername(newUsername);
                setNewUsername("");
                setShowUsernameInput(false);
            } else {
                console.error("Failed to update username:", response.statusText);
            }
        } catch (error) {
            console.error("Failed to update username:", error);
        }
    };

    const changeRole = async () => {
        const newRole = role === "member" ? "admin" : "member";
        setLoading(true);
        console.log(loading);
        try {
            const response = await fetch("http://127.0.0.1:8000/app/user/modify/", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ role: newRole }),
            });
            if (response.ok) {
                setRole(newRole);
            } else {
                console.error("Failed to update role:", response.statusText);
            }
        } catch (error) {
            console.error("Failed to update role:", error);
        } finally {
            setLoading(false);
        }
    };

    const changeEmail = async () => {
        const newEmail = prompt("Enter new email:");
        if (newEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
            try {
                const response = await fetch("http://127.0.0.1:8000/app/user/modify/", {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: newEmail }),
                });
                if (response.ok) {
                    setEmail(newEmail);
                } else {
                    console.error("Failed to update email:", response.statusText);
                }
            } catch (error) {
                console.error("Failed to update email:", error);
            }
        } else {
            alert("Please enter a valid email address.");
        }
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
                    <Link to="/app/groupsidebar" className="back-button"> <ArrowBigLeft size={24} className="back-icon" /><span>Back to Text Channels</span></Link>

                </div>
                
            </div>
        </div>
    );
};

export default Profile;


