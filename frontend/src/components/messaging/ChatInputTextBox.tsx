import { Send } from 'lucide-react'
import {useState} from 'react'
import './ChatInputTextBox.css'

interface ChatInputTextBoxProps {
    onSend: (message: string) => void;
  }


  const ChatInputTextBox: React.FC<ChatInputTextBoxProps> = ({ onSend }) =>  {

    const [message, setMessage] = useState("");

    const autoResize = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value);

        event.target.style.height = "auto";
        event.target.style.height = event.target.scrollHeight + "px";
    };

    function enter() {
        if(message !== "") {
        setMessage("");
        resize();
        onSend(message);
        }
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
            enter();
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
        <div id="sendMessageButton" onClick={enter}><Send id="sendIcon"></Send></div>
        </div>
    )
}

export default ChatInputTextBox