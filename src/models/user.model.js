import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'username is required!'],
      minlength: [5, 'username should be atleast 5 characters'],
      maxlenght: [20, 'username should be atmost 20 characters'],
      lowercase: true,
      trim: true
    },
    email: {
      type: String,
      required: [true, 'email is required!'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'password is required!'],
      minlength: [8, 'password should be atleast 8 characters'],
      maxlenght: [20, 'password should be atmost 20 characters'],
      trim: true,
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'mentor'],
      default: 'user'
    },
    courseEnrolled: [
      {
        courseId: {
          type: Schema.Types.ObjectId,
          ref: 'Course'
        },
        enrolledOn: {
          type: Date,
          default: Date.now()
        }
      }
    ],
    subscriptions: [
      {
        subscriptionId: String,
        status: {
          type: String,
          enum: ['active', 'inactive'],
          default: 'inactive'
        },
        subscribedOn: {
          type: Date,
          default: Date.now()
        }
      }
    ],
    EmailVerificationstatus: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive'
    },
    avatar: {
      public_id: {
        type: String
      },
      secure_url: {
        type: String
      }
    },
    coverImage: {
      public_id: {
        type: String
      },
      secure_url: {
        type: String
      }
    },
    profileDate: {
      type: Schema.Types.Mixed
    },
    refreshToken: {
      type: String,
      select: false
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    emailChangeToken: String,
    emailChangeTokenExpiry: Date,
    userStatusToken: String,
    userStatusTokenExpiry: Date
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
