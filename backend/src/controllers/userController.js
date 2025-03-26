import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import config from '../utils/config.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from '../utils/authUtils.js';

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

    // Generate tokens
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // Save refresh token to database
    await User.findByIdAndUpdate(
      newUser._id,
      { $push: { refreshTokens: { token: refreshToken } } }
    );

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // secure in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Prevent caching of authentication responses
    res.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.status(201).json({
      userId: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token: accessToken
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

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to database
    await User.findByIdAndUpdate(
      user._id,
      { $push: { refreshTokens: { token: refreshToken } } }
    );

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // secure in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Prevent caching of authentication responses
    res.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.status(200).json({
      message: 'Login successful',
      userId: user._id,
      name: user.name,
      email: user.email,
      token: accessToken
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

// Refresh token endpoint
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    // Verify the refresh token
    const { valid, expired, id } = verifyRefreshToken(refreshToken);

    if (!valid) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    if (expired) {
      return res.status(401).json({ message: 'Refresh token expired' });
    }

    // Find the user with this refresh token
    const user = await User.findOne({
      _id: id,
      'refreshTokens.token': refreshToken
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found or token revoked' });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Remove old refresh token and add new one
    await User.findByIdAndUpdate(user._id, {
      $pull: { refreshTokens: { token: refreshToken } },
      $push: { refreshTokens: { token: newRefreshToken } }
    });

    // Set new refresh token in cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Prevent caching
    res.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');

    // Return new access token
    res.json({
      message: 'Token refreshed successfully',
      token: newAccessToken
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout user
export const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      // Find user with this token and remove it
      await User.updateOne(
        { 'refreshTokens.token': refreshToken },
        { $pull: { refreshTokens: { token: refreshToken } } }
      );

      // Clear the cookie
      res.clearCookie('refreshToken');
    }

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};