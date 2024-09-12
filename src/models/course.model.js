import mongoose, { Schema } from 'mongoose';

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true
    },
    thumbanil: {
      public_id: {
        type: String,
        required: true
      },
      secure_url: {
        type: String,
        required: true
      }
    },
    price: {
      type: Number,
      default: 9.99
    },
    duration: {
      type: String,
      required: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    toolsMastery: {
      type: String,
      required: true
    },
    mentors: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);
export default Course;
