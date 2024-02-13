const mongoose = require('mongoose');

const adoptionApplicationSchema = new mongoose.Schema({
  adopterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission',
    required: true
  },
  age: Number,
  homeEnvironment: "String",
  petExperience: 'String',
  status: {
    type: 'String',
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const AdoptionApplication = mongoose.model('AdoptionApplication', adoptionApplicationSchema);

module.exports = AdoptionApplication;