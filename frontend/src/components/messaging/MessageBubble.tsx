import React from "react";
import './MessageBubble.css'

interface MessageBubbleProps {
    message: string;
    sender?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, sender }) => {
    return (
        <div className={`Bubble test ${sender ? "sender" : "receiver"}`}> 
            {message}
        </div>
    )
}

export default MessageBubble