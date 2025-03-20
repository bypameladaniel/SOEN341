import React from "react";
import './MessageBubble.css'

interface MessageBubbleProps {
    message: string;
    sender?: boolean;
    senderName?: string; // Add senderName prop
    timestamp?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, sender, senderName, timestamp }) => {
    return (
        <div className={`Bubble ${sender ? "sender" : "receiver"}`}> 
            {senderName && <div className="metaData">{!sender && <text className="senderName">{senderName} </text> }<text className="timestamp">{timestamp}</text></div>}
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