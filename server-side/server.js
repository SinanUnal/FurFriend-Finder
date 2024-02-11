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
const MessageRoute = require('./Routes/messages')



const cors = require('cors');
// const Message = require('./models/messageModel');
// const authenticateToken = require('./middleware/authentication');
// app.use(cors({
//   origin:'*',
// }));

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


io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('chat message', async (msg) => {
    try {
      
    const newMessage = new Message({
      sender: msg.sender,
      message: msg.message,
      timestamp: new Date()
    });
    await newMessage.save();

    console.log('Message saved:', newMessage);

    io.emit('chat message', msg);
    console.log('Message emitted to all clients:', msg);
    } catch (error) {
      console.error('Error saving message', error);
    }
  });

  // socket.on('disconnect', () => {
  //   console.log('Client disconnected');
  // });
});


const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


