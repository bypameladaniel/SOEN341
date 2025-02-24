import { Send } from 'lucide-react'
import {useState} from 'react'
import './ChatInputTextBox.css'

function ChatInputTextBox() {
    const [message, setMessage] = useState("");

    const autoResize = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value);

        event.target.style.height = "auto";
        event.target.style.height = event.target.scrollHeight + "px";
    };

    function sendMessage() {
        setMessage("");
        resize();
        //api call to send message
    }

    function resize() {
        const textarea = document.getElementById("chatInputTextArea");
        if (textarea) {
            textarea.style.height = "auto";
        }
    }

    const handleEnterTextArea = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    }

    return (
        <div id='chatInputContainer'>
        <textarea
        id="chatInputTextArea" 
        value={message}
        rows={1}
        placeholder="write your message here" 
        onChange={autoResize}
        onKeyDown={handleEnterTextArea}
        />
        <div id="sendMessageButton" onClick={sendMessage}><Send id="sendIcon"></Send></div>
        </div>
    )
}

export default ChatInputTextBox