import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Schema } from 'mongoose';

import envVar from '../configs/config.js';

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
    subscriptions: {
      subscriptionId: String,
      status: {
        type: String,
        default: 'inactive'
      },
      subscribedOn: {
        type: Date,
        default: Date.now()
      }
    },
    emailVerificationstatus: {
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

// Hashes password before saving to the database
userSchema.pre('save', async function (next) {
  // If password is not modified then do not hash it
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods = {
  comparePassword: async function (password) {
    return await bcrypt.compare(password, this.password);
  },

  // will generate a jwt token with user id with payload
  generateAccessToken: function () {
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
        role: this.role,
        subscription: this.subscription
      },
      envVar.accessTokenSecret,
      {
        expiresIn: envVar.accessTokenExpiry
      }
    );
  },

  generateRefreshToken: function () {
    return jwt.sign(
      {
        _id: this._id
      },
      envVar.refreshTokenSecret,
      {
        expiresIn: envVar.refreshTokenExpiry
      }
    );
  },

  generatePasswordResetToken: function () {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.forgotPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    this.forgotPasswordTokenExpiry = Date.now() + 15 * 60 * 1000;
    return resetToken;
  },

  emailChangeTokenGenerate: function () {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.emailChangeToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    this.emailChangeTokenExpiry = Date.now() + 15 * 60 * 1000;

    return resetToken;
  },

  generateUserStatusToken: function () {
    const StatusToken = crypto.randomBytes(20).toString('hex');

    this.emailVerificationToken = crypto
      .createHash('sha256')
      .update(StatusToken)
      .digest('hex');

    this.emailVerificationTokenExpiry = Date.now() + 15 * 60 * 1000;
    return StatusToken;
  }
};

const User = mongoose.model('User', userSchema);

export default User;
