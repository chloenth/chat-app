import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { generateToken } from '../lib/utils.js';

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

export const login = (req, res) => {
  res.send('login route');
};

export const logout = (req, res) => {
  res.send('logout route');
};
