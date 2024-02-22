const express = require('express');
const AdoptionApplication = require('../models/adoptionApplication');
const authenticateToken = require('../middleware/authentication');
const router = express.Router();


router.post('/submitApplication', authenticateToken, async (req, res) => {
  const { submissionId, age, homeEnvironment, petExperience } = req.body;
  const adopterId = req.user.id;

  try {
    const newApplication = new AdoptionApplication({
      adopterId,
      submissionId,
      age,
      homeEnvironment,
      petExperience
    });

    await newApplication.save();
    res.status(201).send({ message: 'Application submitted successfully', application: newApplication });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error submitting application', error: error.message });
  }
});

module.exports = router;