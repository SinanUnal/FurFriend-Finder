const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Submission = require('../models/submission');
const authenticateToken = require('../middleware/authentication');
const AdoptionApplication = require('../models/adoptionApplication');

router.get('/giverDashboard/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if(!user) return res.status(404).send({ message: 'User not found'});

    const activeSubmission = await Submission.countDocuments({ giverId: userId, status: 'active' });
    // console.log(`Active submissions for user ${userId}:`, activeSubmission);




    const pendingApprovals = await Submission.countDocuments({ giverId: userId, status: 'pending' });
    const successfulAdoption = await Submission.countDocuments({ giverId: userId, status: 'adopted' });

    res.send({
      // username: user.username,
      user,
      activeSubmission,
      pendingApprovals,
      successfulAdoption
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error retrieving data', error: error.message});
  }
});



router.post('/giverDashboard/submissions', authenticateToken, async (req, res) => {
  try {
    const { animalName, animalAge, animalType, healthInfo, imageUrl } = req.body;

    const newSubmission = new Submission({
      giverId: req.user.id,
      animalName,
      animalAge,
      animalType,
      healthInfo,
      imageUrl,
    });

    await newSubmission.save();
    res.status(201).send({ message: 'Submission successful', submission: newSubmission });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error processing submission', error: error.message });
  }
});

router.get('/giverDashboard/currentListings/:userId', authenticateToken, async (req, res) => {
  try {
    const  userId = req.params.userId;
    const submission = await Submission.find({ giverId: userId, status: 'active' });

    res.send(submission);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error retrieving submissions', error: error.message });
  }
});

router.delete('/giverDashboard/deleteListing/:listingId', authenticateToken, async (req, res) => {
  try {
    const listingId = req.params.listingId;
    await Submission.findByIdAndDelete(listingId);
    res.send({ message: 'Listing deleted successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error deleting listing', error: error.message });
  }
});


router.patch('/giverDashboard/updateListing/:listingId', async (req, res) => {
  try {
    const listingId = req.params.listingId;
    const updatedData = req.body;
    const updatedListing = await Submission.findByIdAndUpdate(listingId, updatedData);

    res.send({ message: 'Listing updated successfully', updatedListing});
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error updating listing', error: error.message});
  }
});


router.get('/giverDashboard/pendingApplications/:giverId', authenticateToken, async (req, res) => {
  try {
    const submissions = await Submission.find({ giverId: req.params.giverId });
    const submissionIds = submissions.map(submission => submission._id);

    const pendingApplications = await AdoptionApplication.find({
      submissionId: {$in: submissionIds},
      status: 'pending'
    }).populate('adopterId').populate('submissionId');

    res.send(pendingApplications);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching applications', error: error.message});
  }
});


router.patch('/giverDashboard/approveApplication/:applicationId', authenticateToken, async (req, res) => {
  try {
    const updatedApplication = await AdoptionApplication.findByIdAndUpdate(
      req.params.applicationId,
      { status: 'approved' },
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).send({ message: 'Application not found' });
    }

    res.send({ message: 'Application approved successfully', updatedApplication });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error approving application', error: error.message });
  }
});

router.patch('/giverDashboard/rejectApplication/:applicationId', authenticateToken, async (req, res) => {
  try {
    const updatedApplication = await AdoptionApplication.findByIdAndUpdate(
      req.params.applicationId,
      { status: 'rejected' },
      { new: true }
    )

    if (!updatedApplication) {
      return res.status(404).send({ message: 'Application not found' });
    }

    res.send({ message: 'Application rejected successfully', updatedApplication });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error rejecting application', error: error.message });
  }
});



router.get('/giverDashboard/approvedApplications/:giverId', async (req, res) => {
  try {
    const giverId = req.params.giverId;
    const approvedApplications = await AdoptionApplication.find({
      status: 'approved'
    })
    .populate({
      path: 'submissionId',
      match: { giverId: giverId }, 
      populate: { path: 'giverId', model: 'User' }
    })
    .populate('adopterId');

   
    const filteredApplications = approvedApplications.filter(app => app.submissionId);

    res.send(filteredApplications);
  } catch (error) {
    console.error('Error fetching approved applications', error);
    res.status(500).send({ message: 'Error fetching approved applications', error: error.message });
  }
});


module.exports = router;