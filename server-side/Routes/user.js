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
         
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
          username,
          password: hashedPassword,
          age,
          address,
          phoneNumber,
          userType
        });

     

     
      await newUser.validate();
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




module.exports = router;