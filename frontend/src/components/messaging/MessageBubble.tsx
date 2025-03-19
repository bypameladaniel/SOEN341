import React from "react";
import './MessageBubble.css'

interface MessageBubbleProps {
    message: string;
    sender?: boolean;
    senderName?: string; // Add senderName prop
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, sender, senderName }) => {
    return (
        <div className={`Bubble test ${sender ? "sender" : "receiver"}`}> 
            {!sender && senderName && <div className="sender-name">{senderName}</div>} {/* Display sender name if it's a received message */}
            {message.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                    {line}
                    <br />
                </React.Fragment>
            ))}
        </div>
    )
}

export default MessageBubble;