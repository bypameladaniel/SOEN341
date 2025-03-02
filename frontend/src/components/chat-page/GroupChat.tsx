import GroupSidebar from "../Sidebar/group-sidebar";
import ChatArea from "../messaging/ChatArea";

import "./GroupChat.css";

const GroupChat = () => {
    return (
        <div className="chat-page">
            <div>
                <GroupSidebar />
            </div>
            <div className="chat-area">
                <ChatArea />
            </div>
        </div>
    );
};

export default GroupChat;