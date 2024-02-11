const express = require('express');
const router = express.Router();
const Submission = require('../models/submission');
const authenticateToken = require('../middleware/authentication');
const AdoptionApplication = require('../models/adoptionApplication');
const User = require('../models/userModel');


router.get('/adopterDashboard/animals', async (req, res) => {
  const { searchTerm, filterType } = req.query;

  try {
    let query = { status: 'active' };

    if (searchTerm) {
      query.animalName = { $regex: searchTerm, $options: 'i' }; // 'i' for case-insensitive
    }

    if (filterType) {
      query.animalType = filterType;
    }

    const animals = await Submission.find(query);
    res.send(animals);

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching animals', error: error.message });
  }
});

router.get('/adopterDashboard/applications/:adopterId', authenticateToken, async (req, res) => {
  try {
    const applications = await AdoptionApplication.find({ adopterId: req.params.adopterId }). populate({
      path: 'submissionId',
      populate: {
        path: 'giverId',
        model: 'User',
        select: 'username address phoneNumber'
      }
    });
    res.status(200).send(applications);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching applications', error: error.message });
  }
});

module.exports = router;