const express = require('express');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const router = express.Router();


router.post('/signup', async (req, res) => {
  const { username, password, age, address, phoneNumber, userType } = req.body;

  if(!username || !password || !age || !address || !phoneNumber) {
    res.send({ message: 'Please fill all the necessary sections'});
  } else {

    try {
      const existingUser = await User.findOne({
        username: req.body.username
      });
  
      if(existingUser) {
        return res.status(409).send({ message: 'Username already exits' });
      } else {
         
    

        const newUser = new User({
          username,
          password,
          age,
          address,
          phoneNumber,
          userType
        });

     

     
      await newUser.validate();

      newUser.password = await bcrypt.hash(password, 10);

      await newUser.save();


   
     

      res.status(200).send({ message: 'User registered successfully' });
      }
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Handle validation error
        return res.status(400).send({ message: error.message });
      } else {
        // Handle other errors
        console.error('Error during user creation',error);
        res.status(500).send({ message: 'Error creating user', error: error.message });
      }
    }
  }   
});

router.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if(!user) {
      return res.status(404).send({ message: 'User not found '});
    }
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching user', error: error.message });
  }
});



router.get('/user/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('User not found');
    res.send(user);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

router.patch('/user/profile/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
    res.send(user);
  } catch (error) {
    res.status(500).send('Server error');
  }
});


router.get('/user/public-profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password -email -otherSensitiveData');
    if (!user) return res.status(404).send('User not found');
    res.send(user);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;