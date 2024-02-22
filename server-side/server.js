require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
// const io = socketIo(server);
app.use(express.json());
require('./connection');
const Admin = require('./Routes/admin');
const User = require('./Routes/user');
const userManagement = require('./Routes/userManagement');
const giverDashboard = require('./Routes/giverDashboard');
const adopterDashboard = require('./Routes/adopterDashboard');
const adoptionApplication = require('./Routes/adoptionApplication');
const Message = require('./models/messageModel');
const MessageRoute = require('./Routes/messages');





const cors = require('cors');

app.use(cors());

const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});





app.use(Admin);
app.use(User);
app.use(userManagement);
app.use(giverDashboard);
app.use(adopterDashboard);
app.use(adoptionApplication);
app.use(MessageRoute);



const userSocketMap = {};

io.on('connection', (socket) => {
  // Handle user registration on connect
  socket.on('register', (userId) => {
    userSocketMap[userId] = socket.id;
  });

  socket.on('chat message', async (msg) => {
    try {
      const newMessage = new Message({
        senderId: msg.senderId,
        recipientId: msg.recipientId,
        message: msg.message,
        timestamp: new Date()
      });
      await newMessage.save();

      // Emit the message to sender and recipient only
      const senderSocket = userSocketMap[msg.senderId];
      const recipientSocket = userSocketMap[msg.recipientId];

      if (senderSocket) {
        io.to(senderSocket).emit('chat message', newMessage);
      }
      if (recipientSocket) {
        io.to(recipientSocket).emit('chat message', newMessage);
      }
    } catch (error) {
      console.error('Error saving message', error);
    }
  });

  // Remove the user from the map on disconnect
  socket.on('disconnect', () => {
    for (const [userId, socketId] of Object.entries(userSocketMap)) {
      if (socketId === socket.id) {
        delete userSocketMap[userId];
        break;
      }
    }
  });
});


// io.on('connection', (socket) => {
//   console.log('New client connected');

//   socket.on('chat message', async (msg) => {
//     try {
      
//     const newMessage = new Message({
//       senderId: msg.senderId,
//       recipientId: msg.recipientId,
//       message: msg.message,
//       timestamp: new Date()
//     });
//     await newMessage.save();

//     console.log('Message saved:', newMessage);

//     io.emit('chat message', msg);
//     console.log('Message emitted to all clients:', msg);
//     } catch (error) {
//       console.error('Error saving message', error);
//     }
//   });

  
// });


const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


