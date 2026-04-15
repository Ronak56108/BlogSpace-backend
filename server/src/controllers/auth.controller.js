import asyncHandler from 'express-async-handler';
import authService from '../services/auth.service.js';
import { generateTokens } from '../utils/generateToken.js';

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const { user, tokens } = await authService.registerUser({ name, email, password });

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken: tokens.accessToken,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, tokens } = await authService.loginUser(email, password);

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken: tokens.accessToken,
  });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
});

const refreshToken = asyncHandler(async (req, res) => {
  // Implementation for refresh token
  res.json({ message: 'Refresh token endpoint' });
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getUserProfile(req.user._id);
  res.json(user);
});

export default {
  register,
  login,
  logout,
  refreshToken,
  getProfile,
};