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

router.patch('/adopterDashboard/addToFavorites', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { submissionId } = req.body;
  console.log('Received submissionId:', submissionId);

  try {
    const user = await User.findById(userId);
    const submission = await Submission.findById(submissionId);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    if (!submission) {
      return res.status(404).send({ message: 'Submission not found' });
    }

    if (!user.favoriteSubmissions.includes(submissionId)) {
      user.favoriteSubmissions.push(submissionId);


      await user.save();
      res.status(200).send({ message: 'Added to favorite successfully' });
    } else {
      res.status(400).send({ message: 'Already in favorites' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error updating favorites', error: error.message });
  }
});

router.delete('/adopterDashboard/removeFromFavorites', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const submissionId = req.query.submissionId;
  // const { submissionId } = req.body;

  try {
  

    const user = await User.findById(userId);

    
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
  
    

    user.favoriteSubmissions = user.favoriteSubmissions.filter(id => id).filter(id => id.toString() !== submissionId);
    await user.save();
    res.status(200).send({ message: 'Removed from favorites successfully' });
  } catch (error) {
    console.error("Error in removeFromFavorites:", error);
    res.status(500).send({ message: 'Error updating favorites', error: error.toString() });
  }
});

router.get('/adopterDashboard/favorites', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('favoriteSubmissions');
    console.log('User Favorites:', user.favoriteSubmissions);
    res.status(200).send(user.favoriteSubmissions);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching favorites', error: error.message});
  }
});


// router.get('/adopterDashboard/adoptedAnimals/:adopterId', authenticateToken, async (req, res) => {
//   try {
//     const approvedApplications = await AdoptionApplication.find({
//       adopterId: req.params.adopterId,
//       status: 'approved'
//     }).select('submissionId');

//     // Extract submission IDs
//     const submissionIds = approvedApplications.map(app => app.submissionId);

//     // Find all adopted submissions
//     const adoptedSubmissions = await Submission.find({
//       _id: { $in: submissionIds },
//       status: 'adopted'
//     }).populate('giverId');

//     res.send(adoptedSubmissions);
//   } catch (error) {
//     res.status(500).send({ message: 'Error fetching adopted animals', error: error.message });
//   }
// });



module.exports = router;