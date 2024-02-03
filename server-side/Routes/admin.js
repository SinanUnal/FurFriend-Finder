const express = require('express');
const Admin = require('../models/adminModel');
// const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const authenticateToken = require('../middleware/authentication');
const Submission = require('../models/submission');

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


router.get('/admin/approvals', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send({ message: 'Access denied '});
  }

  try {
    const pendingSubmissions = await Submission.find({ status: 'pending' }).populate('giverId');
    res.send(pendingSubmissions);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching pending submissions', error: error.message });
  }
});

router.post('/admin/approve/:submissionId', authenticateToken, async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).send({ message: 'Access denied' });
  }

  try {
    console.log('Approving submission with ID:', req.params.submissionId);

    const submissionId = req.params.submissionId;
    const updatedSubmission = await Submission.findByIdAndUpdate(submissionId, { status: 'active' }, { new: true });

    if (!updatedSubmission) {
      console.log('No submission found with ID:', submissionId);
      return res.status(404).send({ message: 'Submission not found' });
    }
    console.log('Updated Submission:', updatedSubmission);

    

    res.send({ message: 'Submission approved successfully', updatedSubmission });
  } catch (error) {
    console.log('Error in approving submission:', error);
    res.status(500).send({ message: 'Error approving submission', error: error.message });
  }
});

router.post('/admin/reject/:submissionId', authenticateToken, async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).send({ message: 'Access denied '});
  }

  try {
    const submissionId = req.params.submissionId;
    const updatedSubmission = await Submission.findByIdAndUpdate(submissionId, { status: 'rejected' }, { new: true });

    if (!updatedSubmission) {
      return res.status(404).send({ message: 'Submission not found' });
    }

    res.send({ message: 'Submission rejected successfully', updatedSubmission });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error rejecting submission', error: error.message });
  }
});




module.exports = router;