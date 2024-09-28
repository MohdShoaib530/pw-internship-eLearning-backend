import mongoose, { Schema } from 'mongoose';

const progressSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  chaptersCompleted: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Lesson'
    }
  ],
  quizzesCompleted: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Quiz'
    }
  ],
  progressPercentage: {
    type: Number,
    default: 0 // Percentage of the course completed
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  }
});

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;
