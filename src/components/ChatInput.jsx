import React, { useState } from 'react';
import { FiSend } from "react-icons/fi";
import { HiMicrophone } from "react-icons/hi";
import { HiStop } from "react-icons/hi2";
function ChatInput({ onSendMessage }) {
  const [isListening, setIsListening] = useState(false);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };


  return (
    <div className="chat-input d-flex justify-content-center">
      <button className='prompt-mic shadow' onClick={toggleListening}>
        {isListening ? <HiStop />: <HiMicrophone />}
      </button>
      {isListening && <div className="listening-indicator">Listening...</div>}
      <textarea id="" name="prompt" className="prompt-input shadow"  placeholder="Write a prompt here ..." value={message} onChange={(e) => setMessage(e.target.value)} ></textarea>
      <div></div>
      <button className='prompt-send shadow' onClick={handleSend}><FiSend /></button>
    </div>
  );
}

export default ChatInput;