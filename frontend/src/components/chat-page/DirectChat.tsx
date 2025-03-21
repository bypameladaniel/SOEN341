import DirectSidebar from "../Sidebar/DM-sidebar";
import ChatArea from "../messaging/ChatArea";

import "./Chat.css";

const DirectChat = () => {
    return (
        <div className="chat-page">
            <div>
                <DirectSidebar />
            </div>
            <div className="chat-area">
                <ChatArea />
            </div>
        </div>
    );
};

export default DirectChat;