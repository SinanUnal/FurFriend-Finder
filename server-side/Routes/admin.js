const express = require('express');
const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');
const router = express.Router();


router.post('/signup/admin', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).send({ message: 'Please fill in both username and password' });
  } else {
    try {
      const existingAdmin = await Admin.findOne({ username });
      if (existingAdmin) {
        return res.status(409).send({ message: 'Username already exists' });
      } else {
         
        // Validation passed, hash the password and save the admin
        const hashedPassword = await bcrypt.hash(password, 10);
        

        const newAdmin = new Admin({ username, password: hashedPassword });

        await newAdmin.validate();
       
        await newAdmin.save();
        res.status(201).send({ message: 'Admin registered successfully' });
      }
  
     

    } catch (error) {
      if (error.name === 'ValidationError') {
        // Handle validation error
        return res.status(400).send({ message: error.message });
      } else {
        // Handle other errors
        console.error(error);
        return res.status(500).send({ message: 'Error creating admin', error: error.message });
      }
    }
  }
});





module.exports = router;