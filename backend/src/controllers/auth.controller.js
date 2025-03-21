import bcrypt from 'bcryptjs';

import User from '../models/user.model.js';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

// sign up
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // check if password is less than 6 characters
    const trimmedPassword = password.trim();
    if (trimmedPassword.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters' });
    }

    const isValidPassword =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(trimmedPassword);
    if (!isValidPassword) {
      return res.status(400).json({
        message:
          'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
      });
    }

    // check if user is already existed with the email, since email must be unique
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(trimmedPassword, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // generate jwt token
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        avatar: newUser.avatar,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error in signup controller', error.message);
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

// login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // generate token and attach it in cookie
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error('Error in login controller: ', error.message);
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

// logout
export const logout = (req, res) => {
  try {
    res.cookie('jwt', '', {
      maxAge: 0,
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error in logout controller: ', error.message);
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

// update profile
export const updateProfile = async (req, res) => {
  try {
    // const { avatar } = req.body;
    const userId = req.user._id;

    // Check if a file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Avatar is required' });
    }

    // Upload file to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: 'chatApp-avatars',
    });

    const user = await User.findById(userId);
    if (user && user.avatar) {
      deleteImage(user.avatar);
    }

    user.avatar = uploadResponse.secure_url;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error('Error in update profile controller: ', error.message);
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

// delete image from cloudinary
const deleteImage = async (imageUrl) => {
  if (!imageUrl) return;

  try {
    // Extract public ID from the URL
    const parts = imageUrl.split('/');
    const publicIdWithExtension = parts.slice(-2).join('/'); // folder/filename.jpg
    const publicId = publicIdWithExtension.split('.')[0]; // Remove file extension

    // Delete the image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    console.log('Delete result:', result);
    return result;
  } catch (error) {
    console.error('Error deleting image:', error);
    return null;
  }
};

// check auth
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error('Error in checkAuth controller: ', error.message);
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};
