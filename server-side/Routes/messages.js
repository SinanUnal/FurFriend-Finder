const express = require('express');
const router = express.Router();
const Message = require('../models/messageModel');
const authenticateToken = require('../middleware/authentication');

router.get('/messages/:adopterId/:giverId', authenticateToken, async (req, res) => {
  const { adopterId, giverId } = req.params;
  
  try {
   
    const messages = await Message.find({
      $or: [
        { senderId: adopterId, recipientId: giverId },
        { senderId: giverId, recipientId: adopterId }
      ]
    });
    res.send(messages);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching messages', error: error.message });
  }
});

// router.get('/messages', authenticateToken, async (req, res) => {
//   try {
//     const messages = await Message.find({});
//     res.send(messages);
//   } catch (error) {
//     res.status(500).send('Error fetching messages');
//   }
// });

module.exports = router;
