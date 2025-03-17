import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import config from '../utils/config.js';

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    // Add cache control headers - moderate caching for user lists
    res.set('Cache-Control', 'public, max-age=600'); // 10 minutes
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Add cache control headers
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password });
    const newUser = await user.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name
      },
      config.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Prevent caching of authentication responses
    res.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.status(201).json({
      userId: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token: token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



// Update a user
export const updateUser = async (req, res) => {
  try {
    // If password is being updated, we need to handle it separately
    // Since the pre-save middleware won't run on findByIdAndUpdate
    if (req.body.password) {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Update user fields
      Object.keys(req.body).forEach(key => {
        user[key] = req.body[key];
      });

      // Save the user which will trigger the password hashing middleware
      const updatedUser = await user.save();
      const userResponse = updatedUser.toObject();
      delete userResponse.password;
      return res.json(userResponse);
    }

    // For non-password updates, use findByIdAndUpdate
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const removedUser = await User.findByIdAndDelete(req.params.id);
    if (!removedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User Login with JWT
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name
      },
      config.JWT_SECRET,
      { expiresIn: '24h' } // Token expires in 24 hours
    );

    // Prevent caching of authentication responses
    res.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.status(200).json({
      message: 'Login successful',
      userId: user._id,
      name: user.name,
      email: user.email,
      token: token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    // req.user will be set by the auth middleware after token verification
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // No caching for user profile
    res.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};