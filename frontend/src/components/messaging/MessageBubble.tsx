import React from "react";
import './MessageBubble.css';
import defaultPFP from "../profile-page/images/defaultPfp.png";

interface MessageBubbleProps {
    message: string;
    sender?: boolean;
    senderName?: string;
    timestamp?: string;
    profilePicture?: string | null;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
    message, 
    sender = false, 
    senderName, 
    timestamp, 
    profilePicture = null 
}) => {
    return (
        <div className={`messageContainer ${sender ? "sender" : "receiver"}`}>
            {!sender && (
                <img 
                    src={profilePicture || defaultPFP} 
                    alt="Profile" 
                    className="profilePicture" 
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = defaultPFP;
                    }}
                />
            )}
            <div className="Bubble">
                {(senderName || timestamp) && (
                    <div className="metaData">
                        {!sender && senderName && (
                            <span className="senderName">{senderName}</span>
                        )}
                        {timestamp && (
                            <span className="timestamp">{timestamp}</span>
                        )}
                    </div>
                )}
                <div className="messageText">
                    {message.split('\n').map((line, index) => (
                        <React.Fragment key={index}>
                            {line}
                            <br />
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;