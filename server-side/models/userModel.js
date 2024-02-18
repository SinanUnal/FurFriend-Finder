const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: true,
    validate: {
      validator: function (password) {
        // Password should be at least 6 characters
        if (password.length < 6) {
          return false;
        }

        // Password should contain at least one uppercase letter
        if (!/[A-Z]/.test(password)) {
          return false;
        }

        // Password should contain at least one lowercase letter
        if (!/[a-z]/.test(password)) {
          return false;
        }

        // Password should contain at least one digit (number)
        if (!/\d/.test(password)) {
          return false;
        }

        // Password should contain at least one special character
        if (!/[!@#$%^&*]/.test(password)) {
          return false;
        }

        return true; // Password meets all criteria
      },
      message: 'Password does not meet complexity requirements.',
    },
   },
  age: { type: Number, required: true},
  address: { type: String, required: true},
  phoneNumber: { type: String, required: true},
  userType: { type: String, required: true, enum: ['adopter', 'giver'] },
  favoriteSubmissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission'
  }],
  profilePicture: { type: String, default: '' }
  // activeSubmission: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

