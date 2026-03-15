// controllers/authController.js - Authentication logic
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * POST /api/auth/signup
 * Register a new user
 */
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return errorResponse(res, 'An account with this email already exists.', 409);
    }

    // Create user (password is hashed in model hook)
    const user = await User.create({ name, email, password });

    // Generate JWT token
    const token = generateToken(user.id);

    return successResponse(
      res,
      { token, user: user.toSafeObject() },
      'Account created successfully.',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Authenticate a user and return a token
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    // Validate password
    const isValid = await user.validatePassword(password);
    if (!isValid) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    // Generate JWT token
    const token = generateToken(user.id);

    return successResponse(res, { token, user: user.toSafeObject() }, 'Login successful.');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/profile
 * Get the authenticated user's profile
 */
const getProfile = async (req, res, next) => {
  try {
    return successResponse(res, { user: req.user.toSafeObject() }, 'Profile fetched.');
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, getProfile };
