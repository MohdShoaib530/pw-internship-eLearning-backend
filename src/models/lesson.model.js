import mongoose, { Schema } from 'mongoose';

const lessonSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: trusted
    },
    description: {
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
    quiz: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz'
    },
    studyMaterials: [
      {
        title: String,
        material: {
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
    ]
  },
  { timestamps: true }
);

const Lesson = mongoose.model('Lesson', lessonSchema);
export default Lesson;
