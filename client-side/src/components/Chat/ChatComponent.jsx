import React from 'react';
import { useState, useEffect, useRef } from 'react';
import socketIOClient from 'socket.io-client';
import axiosWithAuth from '../utils/axiosWithAuth';
import { Paper, List, ListItem, ListItemText, Divider, TextField, Button, Box, Typography } from '@mui/material';

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


    const userId = userType === 'giver' ? giverId : adopterId;
    newSocket.emit('register', userId);

    // newSocket.on('chat message', data => {
    //   setResponse(oldMessages => [...oldMessages, data]);
    // });
    newSocket.on('chat message', (newMessage) => {
      // Handle messages only if they belong to the current conversation
      if ((newMessage.senderId === adopterId && newMessage.recipientId === giverId) ||
          (newMessage.senderId === giverId && newMessage.recipientId === adopterId)) {
        setResponse(oldMessages => [...oldMessages, newMessage]);
      }
    });

    return () => {
      newSocket.emit('unregister', userId);
      newSocket.disconnect();
      // if (newSocket) newSocket.disconnect();
    };
  }, [adopterId, giverId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const axiosInstance = axiosWithAuth();
        const response = await axiosInstance.get(`${ENDPOINT}/messages/${adopterId}/${giverId}`);
        // setResponse(response.data);
        setResponse(response.data.filter(message => 
          (message.senderId === adopterId && message.recipientId === giverId) ||
          (message.senderId === giverId && message.recipientId === adopterId)
        ));
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
  
    if (adopterId && giverId) {
      fetchMessages();
    }
    
  }, [adopterId, giverId]);
  



  const sendMessage = () => {
    if (message.trim()) {   
      // let senderUsername;

      // if (userType === 'giver') {
      //   senderUsername = giverUsername;
      // } else {
      //   senderUsername = adopterUsername;
      // }

      const messageData = {
        senderId: userType === 'giver' ? giverId : adopterId, 
        recipientId: userType === 'giver' ? adopterId : giverId, 
        message: message,
        timestamp: new Date()
      };
      socket.emit('chat message', messageData);
      // setResponse(oldMessages => [...oldMessages, messageData]);
      setMessage('');

    }
  };

  const formatTimestamp = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString();
  };

  const handleKeyDown = (event) => {
    if(event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  };



  const chatEndRef = useRef(null);


  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [response]);

  return (
    <Paper style={{ padding: '20px', maxHeight: '300px', maxWidth: '350px', overflowY: 'auto' }}>
      <List>
        {response.map((msg, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={ <Typography component="span" variant="body2" style={{ fontWeight: 'bold' }}>
                {msg.senderId === adopterId ? adopterUsername : giverUsername}
              </Typography>}
                secondary={
                  <>
                    <Typography
                      component="span" variant="body2" 
                      color="text.primary"
                      style={{ wordBreak: 'break-word' }}
                    >
                      {msg.message}
                    </Typography>
                    <span>{formatTimestamp(msg.timestamp)}</span>
                  </>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
        <div ref={chatEndRef} />
      </List>
      <Box
        component="form"
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '20px'
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          fullWidth
          label="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          variant="outlined"
          size="small"
          sx={{ marginRight: '10px' }}
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={sendMessage} 
          disabled={!message.trim()}
        >
          Send
        </Button>
      </Box>
    </Paper>

  );
};
