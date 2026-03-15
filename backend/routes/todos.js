// routes/todos.js - Todo CRUD routes (all protected)
const express = require('express');
const { body } = require('express-validator');
const { getTodos, createTodo, updateTodo, deleteTodo } = require('../controllers/todoController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Validation for creating a todo
const createValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required.')
    .isLength({ max: 255 }).withMessage('Title must not exceed 255 characters.'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high.'),
  body('due_date')
    .optional({ nullable: true })
    .isDate().withMessage('Due date must be a valid date (YYYY-MM-DD).'),
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array.'),
];

// Validation for updating a todo
const updateValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty.')
    .isLength({ max: 255 }).withMessage('Title must not exceed 255 characters.'),
  body('completed')
    .optional()
    .isBoolean().withMessage('Completed must be a boolean.'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high.'),
  body('due_date')
    .optional({ nullable: true })
    .isDate().withMessage('Due date must be a valid date (YYYY-MM-DD).'),
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array.'),
];

// @route   GET  /api/todos
router.get('/', getTodos);

// @route   POST /api/todos
router.post('/', createValidation, validate, createTodo);

// @route   PUT  /api/todos/:id
router.put('/:id', updateValidation, validate, updateTodo);

// @route   DELETE /api/todos/:id
router.delete('/:id', deleteTodo);

module.exports = router;
