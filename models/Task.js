import mongoose from 'mongoose';

/**
 * Task Schema Definition for Practical 5
 * Subject: Advanced Web Development Frameworks (ITUE301)
 * College: CHARUSAT
 * Student: Max Patel (24IT070)
 */
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'],
      message: 'Priority must be either low, medium, or high'
    },
    default: 'medium'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
});

// Pre-save hook to trim whitespace from the title as required
taskSchema.pre('save', function (next) {
  if (typeof this.title === 'string') {
    this.title = this.title.trim();
  }
  if (typeof next === 'function') {
    next();
  }
});

const Task = mongoose.model('Task', taskSchema);

export { Task };
export default Task;
