import mongoose from 'mongoose';

/**
 * User Schema Definition for Practical 7: Authentication & Middleware Pipeline
 * Subject: Advanced Web Development Frameworks (ITUE301)
 * College: CHARUSAT
 * Student: Max Patel (24IT070)
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password hash is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Helper method to return user object without password hash
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    email: this.email,
    createdAt: this.createdAt
  };
};

const User = mongoose.model('User', userSchema);

export { User };
export default User;
