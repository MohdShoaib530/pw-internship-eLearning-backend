import User from '../models/user.model.js';
import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';

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
    throw next(new ApiError('User registration failed', 500));
  }

  const createdUser = await User.findOne({ email });
  if (!createdUser) {
    throw next(new ApiError('Ussr registration failed', 500));
  }

  try {
    const emailVerificationToken = await user.generateEmailVerificationToken();
    console.log('emailVerificationToken', emailVerificationToken);
    await user.save({ validateBeforeSave: false });
  } catch (error) {
    throw next(new ApiError('User registration failed', 500));
  }

  res.status(200).json({
    status: 'success',
    message: 'User registered successfully'
  });
});
