import mongoose from 'mongoose';


const mentorSchema = new mongoose.Schema(
  {
    mentorRole: {
      type: String
    },
    teachingExperience: {
      type: String
    },
    workExperience: {
      type: String
    },
    previousCompanies: {
      type: String
    }
  },
  { timestamps: true }
);

const Mentor = mongoose.model('Mentor', mentorSchema);

export default Mentor;
