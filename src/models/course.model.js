import mongoose, { model, Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

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
      required: true,
      trim: true
    },
    lectures: [
      {
        title: String,
        description: String,
        lecture: {
          public_id: {
            type: String,
            required: true
          },
          secure_url: {
            type: String,
            required: true
          }
        }
      }
    ],
    numberOfLectures: {
      type: Number,
      default: 0
    },
    thumbnail: {
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
      type: String,
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
    mentor: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);
mongoose.plugin(mongooseAggregatePaginate);
const Course = model('Course', courseSchema);

export default Course;
