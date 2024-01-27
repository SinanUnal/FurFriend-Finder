require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
const User = require('../models/userModel');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password} = req.body;
  

  try {
    let account = await Admin.findOne({ username });

    if (!account) {
      account = await User.findOne({ username });
      if (!account) {
        return res.status(404).send({ message: 'Invalid username or password' });
      }
    }

    const passwordMatch = await bcrypt.compare(password, account.password);
    if (!passwordMatch) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    const role = account instanceof Admin ? 'admin' : 'user';
    const token = jwt.sign({ id: account._id, role: role }, process.env.JWT_SECRET_KEY);

    

    const userData = {
      username: account.username,
    };

    if (role === 'user') {
      userData.userType = account.userType;
    }


    res.status(200).send({ 
      token, 
      message: 'Login is successful', 
      role: role,
      user: userData 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Login failed', error: error.message });
  }
    
});

module.exports = router;
