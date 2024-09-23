import bcrypt from 'bcrypt';

import envVar from '../config/config.js';
import User from '../models/user.model.js';
import ApiError from '../utils/apiError.js';
import apiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import sendEamil from '../utils/sendEmail.js';

const cookieOptions = {
  secure: process.env.NOEE_ENV === 'production' ? true : false,
  httpOnly: true
};

export const registerUser = asyncHandler(async (req, res, next) => {
  const { fullName, email, password } = req.body;
  if ([fullName, email, password].some((field) => field.trim() === '')) {
    return next(new ApiError('All fields are required', 400));
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ApiError('User already exists', 400));
  }

  const user = await User.create({
    fullName,
    email,
    password,
    avatar: {
      public_id: email,
      secure_url:
        'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg'
    },
    coverImage: {
      public_id: email,
      secure_url:
        'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg'
    }
  });
  if (!user) {
    throw next(new ApiError('something went wrong while creating user', 500));
  }

  const createdUser = await User.findOne({ email });
  if (!createdUser) {
    throw next(
      new ApiError(
        'user registration failed, please try again after sometimes',
        500
      )
    );
  }

  try {
    const emailVerificationToken = await user.generateEmailVerificationToken();
    await user.save({ validateBeforeSave: false });
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpiry = undefined;

    const emailVerificationTokenUrl = `${envVar.frontendUrl}/confirm-status/${emailVerificationToken}`;
    const subject = 'confirm user status';
    const message = `You can confirm your email by clicking <a href=${emailVerificationTokenUrl} target='_balnk'>Reset your password <a>\n  If this link does not for some reason then copy paste this link in a new tab ${emailVerificationTokenUrl}`;
    const emailSend = await sendEamil(subject, message, email);
    if (!emailSend) {
      throw next(
        new ApiError(
          'Error while sending email to the  user so try again ',
          500
        )
      );
    }
    res
      .status(200)
      .json(
        new apiResponse(
          200,
          createdUser,
          'user created and email sent successfully'
        )
      );
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    throw next(
      new ApiError('Error while sending email to the  user so try again ', 500)
    );
  }
});

export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if ([email, password].some((field) => field.trim() === '')) {
    throw next(new ApiError('all fields are required', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw next(new ApiError('User does not exists with given email id', 400));
  }

  console.log('hi', user);
  const isPassword = await bcrypt.compare(user.password, password);
  console.log('ispassword', isPassword);
  if (!isPassword) {
    throw next(new ApiError('Invalid  password', 400));
  }
  console.log('hello');
  const { accessToken, refreshToken } = await user.generateAuthToken();
  console.log('tokens', accessToken, refreshToken);
});
