import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import mongoose, { Schema } from 'mongoose';

import envVar from '../config/config.js';

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
      select: false,
      RegExp: [
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
      ]
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
    emailVerificationToken: String,
    emailVerificationTokenExpiry: Date
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12); // 12 saltrounds(a random value) that determines the cost factor
  next();
});
userSchema.methods = {
  generateEmailVerificationToken: function () {
    const verificationToken = crypto.randomBytes(20).toString('hex'); // crypto for secure communication

    this.emailVerificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    this.emailVerificationTokenExpiry = Date.now() + 15 * 60 * 1000;
    return verificationToken;
  },
  generateAuthToken: function () {
    const accessToken = jwt.sign(
      {
        _id: this._id,
        role: this.role,
        email: this.email
      },
      envVar.accessTokenSecret,
      {
        expiresIn: '1d'
      }
    );
    const refreshToken = jwt.sign(
      {
        _id: this._id
      },
      envVar.refreshTokenSecret,
      {
        expiresIn: '15m'
      }
    );
    return { accessToken, refreshToken };
  }
};
const User = mongoose.model('User', userSchema);
export default User;
