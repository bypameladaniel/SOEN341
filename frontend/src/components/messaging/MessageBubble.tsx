import React from "react";
import './MessageBubble.css'

interface MessageBubbleProps {
    message: string;
    sender?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, sender }) => {
    return (
        <div className={`Bubble test ${sender ? "sender" : "receiver"}`}> 
            {message.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ))}
        </div>
    )
}

export default MessageBubble