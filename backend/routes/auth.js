// routes/auth.js - Authentication routes with input validation
const express = require('express');
const { body } = require('express-validator');
const { signup, login, getProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

// Validation rules for signup
const signupValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters.'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email.'),
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
];

// Validation rules for login
const loginValidation = [
  body('email').trim().notEmpty().withMessage('Email is required.').isEmail().withMessage('Invalid email.'),
  body('password').notEmpty().withMessage('Password is required.'),
];

// @route   POST /api/auth/signup
router.post('/signup', signupValidation, validate, signup);

// @route   POST /api/auth/login
router.post('/login', loginValidation, validate, login);

// @route   GET /api/auth/profile (protected)
router.get('/profile', authenticate, getProfile);

module.exports = router;
