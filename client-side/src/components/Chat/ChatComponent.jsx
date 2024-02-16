import React from 'react';
import { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import axiosWithAuth from '../utils/axiosWithAuth';


const ENDPOINT = 'http://localhost:5000';

export default function ChatComponent({ adopterId, giverId, userType }) {
  const [response, setResponse] = useState([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [adopterUsername, setAdopterUsername] = useState('');
  const [giverUsername, setGiverUsername] = useState('');
  

  useEffect(() => {
    console.log("Adopter ID in ChatComponent:", adopterId);
    console.log("Giver ID in ChatComponent:", giverId);

    if (!adopterId || !giverId) {
      console.error("Adopter ID or Giver ID is undefined.");
      return;
    }
    
    const fetchUsernames = async () => {
      
      try {
        const axiosInstance = axiosWithAuth();
        const adopterUrl = `http://localhost:5000/user/${adopterId._id ? adopterId._id : adopterId}`;
        const giverUrl = `http://localhost:5000/user/${giverId}`;
       ;

        const adopterResponse = await axiosInstance.get(adopterUrl);
        const giverResponse = await axiosInstance.get(giverUrl);

       

        setAdopterUsername(adopterResponse.data.username);
        setGiverUsername(giverResponse.data.username);
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };
    fetchUsernames();
  }, [adopterId, giverId]);


  useEffect(() => {
    const newSocket = socketIOClient(ENDPOINT);
    setSocket(newSocket);

    newSocket.on('chat message', data => {
      setResponse(oldMessages => [...oldMessages, data]);
    });

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const axiosInstance = axiosWithAuth();
        const response = await axiosInstance.get(`${ENDPOINT}/messages`);
        setResponse(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
  
    fetchMessages();
    
  }, []);
  

  //  useEffect(() => {
  //   if (socket) {
  //     socket.on('chat message', data => {
  //       setResponse(oldMessages => [...oldMessages, data]);
  //     });
  //   }
  // }, [socket]);

  const sendMessage = () => {
    if (message.trim()) {    //return; 
      // const sender = adopterUsername ? adopterUsername : giverUsername;
      let senderUsername;

      if (userType === 'giver') {
        senderUsername = giverUsername;
      } else {
        senderUsername = adopterUsername;
      }

      const messageData = {
        sender: senderUsername,
        message: message,
        timestamp: new Date()
      };
      socket.emit('chat message', messageData);
      setMessage('');
    }
  };

  const formatTimestamp = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString();
  };

  const handleKeyDown = (event) => {
    if(event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div>
      <div>
        {response.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}</strong>:
            <p>{msg.message}</p>
            <span>{formatTimestamp(msg.timestamp)}</span>
          </div>
        ))}
      </div>
      <input 
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='Type a message...'
       /> 
       <button onClick={sendMessage} disabled={!message.trim()}>Send</button>
    </div>
  );
};
