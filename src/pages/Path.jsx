import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { RiVoiceprintFill, RiPauseFill } from "react-icons/ri";
import { FiSend } from "react-icons/fi";

const Path = () => {
  const { id } = useParams();
  const [pathData, setPathData] = useState({});
  const [toDoList, setToDoList] = useState([]);
  const [progress, setProgress] = useState(0);
  const [conversation, setConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null); // Stores the recorded audio
  const mediaRecorderRef = useRef(null); // Ref for the media recorder
  const audioStreamRef = useRef(null); // Ref for the audio stream

  // Function to generate speech using OpenAI's TTS API
  const generateSpeech = async (text) => {
    try {
      const response = await fetch('http://localhost:5000/api/generate-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          text,
          pathName: pathData.name // Add pathName to the payload
        })
      });
  
      if (response.ok) {
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        return audioUrl; // Return the URL of the generated audio
      } else {
        console.error('Failed to generate speech');
        return null;
      }
    } catch (error) {
      console.error('Error generating speech:', error);
      return null;
    }
  };

  // Play audio when a new bot response is added
  useEffect(() => {
    if (conversation && conversation.messages.length > 0) {
      const lastMessage = conversation.messages[conversation.messages.length - 1];
      if (!lastMessage.isuser) { // Check if it's a bot response
        // Generate and play speech for the bot response
        generateSpeech(lastMessage.value).then((audioUrl) => {
          if (audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play();
          }
        });
      }
    }
  }, [conversation]); // Trigger when the conversation updates

  // Fetch path data on component mount
  useEffect(() => {
    const fetchPathData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(`http://localhost:4200/path/get/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setPathData(data.path);
        setToDoList(data.toDoList || []);
        setProgress(data.progress || 0);
        setConversation(data.conversation || null);
        console.log(data);
      } catch (error) {
        console.error('Error fetching path data:', error);
      }
    };

    fetchPathData();
  }, [id]);

  // Start recording function
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        setAudioBlob(event.data);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting audio recording:", err);
    }
  };

  // Stop recording function
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    audioStreamRef.current.getTracks().forEach(track => track.stop());
    setIsRecording(false);
    sendRecording(); // Automatically send the recording for processing
  };

  // Toggle recording/pause
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Send the recorded audio to the backend for processing
  const sendRecording = async () => {
    if (!audioBlob) return;
  
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.wav");
    formData.append("pathName", pathData.name); // Add pathName to the FormData
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/record', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
  
      if (response.ok) {
        const data = await response.json();
        const transcription = data.transcription;
  
        // Add the transcribed message to the conversation
        setConversation(prev => {
          const updatedConversation = { ...prev };
          if (updatedConversation && updatedConversation.messages) {
            updatedConversation.messages = [
              ...updatedConversation.messages,
              { value: transcription, isuser: true } // Add transcribed message
            ];
          }
          return updatedConversation;
        });
  
        // Automatically send the transcribed message to GPT-4
        setNewMessage(transcription);
        handleSendMessage();
      } else {
        console.error('Failed to process audio');
      }
    } catch (error) {
      console.error('Error processing audio:', error);
    }
  };
  // Handle sending a message to GPT-4
  const handleSendMessage = async () => {
    const token = localStorage.getItem('token');
    if (!token || !newMessage.trim()) return;
  
    // Ensure pathData.name is defined
    if (!pathData.name) {
      console.error("Path name is not defined.");
      return;
    }
  
    // Add the user's message to the conversation locally
    setConversation(prev => {
      const updatedConversation = { ...prev };
      if (updatedConversation && updatedConversation.messages) {
        updatedConversation.messages = [
          ...updatedConversation.messages,
          { value: newMessage, isuser: true } // Add user's message
        ];
      }
      return updatedConversation;
    });
  
    // Clear the input field immediately after adding the message
    setNewMessage("");
  
    try {
      // Save the user's message using the 4200 API
      const saveUserMessageResponse = await fetch('http://localhost:4200/message/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          idConversation: conversation?.idconversation, // Assuming there's at least one conversation
          content: newMessage,
          isUser: true
        })
      });
  
      if (!saveUserMessageResponse.ok) {
        console.error('Failed to save user message');
        return;
      }
  
      // Send the user's message to the GPT-4 API for processing
      const gptResponse = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: newMessage,
          pathName: pathData.name // Pass pathData.name to the backend
        })
      });
  
      if (gptResponse.ok) {
        const data = await gptResponse.json();
  
        // Add GPT-4's response to the conversation locally
        setConversation(prev => {
          const updatedConversation = { ...prev };
          if (updatedConversation && updatedConversation.messages) {
            updatedConversation.messages = [
              ...updatedConversation.messages,
              { value: data.response, isuser: false } // Add GPT-4's response
            ];
          }
          return updatedConversation;
        });
  
        // Save GPT-4's response using the 4200 API
        const saveGPTResponse = await fetch('http://localhost:4200/message/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            idConversation: conversation?.idconversation, // Same conversation ID
            content: data.response, // GPT-4's response
            isUser: false // Indicates this is a bot response
          })
        });
  
        if (!saveGPTResponse.ok) {
          console.error('Failed to save GPT-4 response');
          return;
        }
  
        // Generate and play speech for the GPT-4 response
        const audioUrl = await generateSpeech(data.response);
        if (audioUrl) {
          const audio = new Audio(audioUrl);
          audio.play();
        }
      } else {
        console.error('Failed to send message to GPT-4');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="row m-0" style={{ height: "100vh" }}>
      {/* Sidebar */}
      <div className="col-md-3 bg-dark border-right-2 text-white p-4 d-flex flex-column justify-content-between">
        <h3 className="fw-bold fs-2">{pathData.name}</h3>

        {/* To-Do List */}
        <div className="p-2">
          <h5 className="fw-semibold fs-3 mb-4">My To Do List</h5>

          {/* Remaining Tasks */}
          <h6 className="fs-5 fw-bold">Remaining Tasks</h6>
          <hr className="my-2 " />
          <ul className="list-unstyled">
            {toDoList.length > 0 ? (
              toDoList.map((list, index) => (
                <li key={index} className="mb-2">
                  <span className="me-2 py-5">⚪</span> {list.tasks.map(task => task.name).join(', ')}
                </li>
              ))
            ) : (
              <li className="mb-2 text-center fw-light"><ins>No tasks available</ins></li>
            )}
          </ul>

          {/* Finished Tasks */}
          <h6 className="fs-4 fw-bold">Finished Tasks</h6>
          <hr className="my-2" />
          <ul className="list-unstyled">
            {/* Add finished tasks here */}
          </ul>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <h5 className="fw-bold">Progress</h5>
          <div className="progress" style={{ height: "35px" }}>
            <div
              className="progress-bar bg-primary"
              role="progressbar"
              style={{ width: `calc(${progress} + 5) %` }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {progress}%
            </div>
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="col-md-9 position-relative">
        <Header />
        <div className="container p-5 d-flex flex-column justify-content-between">
          {/* Chat Box */}
          <div className="bg-secondary p-4 rounded-4 mb-3 overflow-auto" style={{ height: "70vh" }}>
              {conversation && conversation.messages.length > 0 ? (
                conversation.messages.map((message, idx) => (
                  <div key={idx} className={`my-4 ${message.isuser ? 'text-end' : 'text-start'}`}>
                    <span className={`bg-primary rounded-4 shadow px-3 py-3 d-inline-block ${message.isuser ? 'ms-auto' : 'me-auto bg-info'}`} style={{ whiteSpace: 'pre-wrap' }}>
                      {message.value}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-white fw-bold m-auto display-6">What Do You Wanna Learn About {pathData.name}?</p>
              )}
            </div>

          {/* Chat Input */}
          <div className="d-flex text-white align-items-center position-absolute bottom-0 start-0 w-100 p-3">
            <div className="col-10 mx-auto d-flex align-items-center">
              <input
                type="text"
                className="form-control me-2 border-0 rounded-4 px-4 py-3 shadow"
                placeholder="Enter Your Prompt"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <span
                className="fs-4 mx-2 rounded-circle px-3 py-2 shadow"
                role="button"
                onClick={handleSendMessage}
                style={{ backgroundColor: '#007bff', color: '#fff', transition: 'transform 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <FiSend />
              </span>
              <div className="d-flex flex-column align-items-center">
                {isRecording && <p className="text-white mb-1">Listening...</p>}
                <span
                  className="fs-4 rounded-circle px-3 py-2 shadow"
                  role="button"
                  onClick={toggleRecording}
                  style={{ backgroundColor: '#007bff', color: '#fff', transition: 'transform 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {isRecording ? <RiPauseFill /> : <RiVoiceprintFill />}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Path;














