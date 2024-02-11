const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  giverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  animalName: {
    type: String,
    required: true,
    trim: true
  },
  animalAge: {
    type: Number,
    required: true
  },
  animalType: {
    type: String,
    required: true,
    enum: ['dog', 'cat', 'fish', 'bird', 'other'],
    trim: true
  },
  healthInfo: String,
  imageUrl: String,
  status: {
    type: String,
    enum: ['active', 'pending', 'adopted'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;