import React, { useState, useEffect } from 'react';
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";

function ChatConversation({ conversation }) {
  const [feedback, setFeedback] = useState({});
  const [showTyping, setShowTyping] = useState(false);

  useEffect(() => {
    const lastMessage = conversation[conversation.length - 1];
    if (lastMessage && lastMessage.sender === 'user') {
      setShowTyping(true);
    } else {
      setShowTyping(false);
    }
  }, [conversation]);

  const handleFeedback = (index, type) => {
    setFeedback(prevFeedback => ({
      ...prevFeedback,
      [index]: prevFeedback[index] === type ? null : type
    }));
  };

  return (
    <div className="chat-conversation">
      {conversation.map((message, index) => (
        <div key={index} className={`chat-message ${message.sender}`}>
          <div className="chat-message-content text-start">{message.text}</div>
          <div className="chat-message-meta">
            <span className="chat-message-time">{message.time}</span>
            {message.sender === "bot" && (
              <span className="chat-message-feedback">
                <button onClick={() => handleFeedback(index, 'like')}>
                  {feedback[index] === 'like' ? <BiSolidLike className="chat-message-feedback-icon" /> : <AiOutlineLike className="chat-message-feedback-icon" />}
                </button>
                <button onClick={() => handleFeedback(index, 'dislike')}>
                  {feedback[index] === 'dislike' ? <BiSolidDislike className="chat-message-feedback-icon" /> : <AiOutlineDislike className="chat-message-feedback-icon" />}
                </button>
              </span>
            )}
          </div>
        </div>
      ))}
      {showTyping && (
        <div className="chat-message bot">
          <div className="chat-message-content typing">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatConversation;