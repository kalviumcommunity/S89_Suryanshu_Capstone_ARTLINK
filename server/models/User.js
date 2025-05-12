const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      trim: true,
   },
   email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
   },
   password: {
      type: String,
      required: function() {
         return !this.googleId; // Password is required only if googleId is not present
      },
      minlength: 6,
   },
   role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
   },
   googleId: {
      type: String,
      unique: true,
      sparse: true, // This allows null values and only enforces uniqueness for non-null values
   },
   profilePicture: {
      type: String,
      default: '',
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);