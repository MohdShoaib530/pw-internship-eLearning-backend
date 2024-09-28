import mongoose, { Schema } from 'mongoose';

const quizSchema = new Schema(
  {
    quizName: {
      type: String,
      required: true,
      trim: true
    },
    quizDescription: {
      type: String,
      required: true,
      trim: true
    },
    lesson: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson'
    },
    questions: [
      {
        question: {
          type: String,
          required: true,
          trim: true
        },
        options: [
          {
            option: {
              type: String,
              required: true,
              trim: true
            },
            isAnswer: {
              type: Boolean,
              default: false
            }
          }
        ]
      }
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
