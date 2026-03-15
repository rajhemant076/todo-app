// controllers/todoController.js - Todo CRUD logic
const { Op } = require('sequelize');
const Todo = require('../models/Todo');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * GET /api/todos
 * Fetch all todos for the authenticated user with search & filter support
 */
const getTodos = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { search, status, priority, category } = req.query;

    // Build dynamic filter conditions
    const where = { user_id: userId };

    // Filter by completion status
    if (status === 'completed') where.completed = true;
    if (status === 'pending') where.completed = false;

    // Filter by priority
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      where.priority = priority;
    }

    // Filter by category
    if (category) {
      where.category = { [Op.like]: `%${category}%` };
    }

    // Search by title or description
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const todos = await Todo.findAll({
      where,
      order: [
        ['completed', 'ASC'],      // Pending first
        ['due_date', 'ASC'],       // Nearest due date first (nulls last)
        ['created_at', 'DESC'],    // Newest first as tiebreaker
      ],
    });

    // Calculate completion stats for the progress bar
    const total = await Todo.count({ where: { user_id: userId } });
    const completed = await Todo.count({ where: { user_id: userId, completed: true } });

    return successResponse(res, { todos, stats: { total, completed } }, 'Todos fetched.');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/todos
 * Create a new todo
 */
const createTodo = async (req, res, next) => {
  try {
    const { title, description, priority, due_date, category, tags } = req.body;

    const todo = await Todo.create({
      title,
      description: description || null,
      priority: priority || 'medium',
      due_date: due_date || null,
      category: category || null,
      tags: tags || [],
      user_id: req.user.id,
    });

    return successResponse(res, { todo }, 'Todo created successfully.', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/todos/:id
 * Update an existing todo (including toggling completion)
 */
const updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the todo and ensure it belongs to the current user
    const todo = await Todo.findOne({ where: { id, user_id: req.user.id } });
    if (!todo) {
      return errorResponse(res, 'Todo not found.', 404);
    }

    // Only update fields that are provided
    const { title, description, completed, priority, due_date, category, tags } = req.body;

    await todo.update({
      title: title !== undefined ? title : todo.title,
      description: description !== undefined ? description : todo.description,
      completed: completed !== undefined ? completed : todo.completed,
      priority: priority !== undefined ? priority : todo.priority,
      due_date: due_date !== undefined ? due_date : todo.due_date,
      category: category !== undefined ? category : todo.category,
      tags: tags !== undefined ? tags : todo.tags,
    });

    return successResponse(res, { todo }, 'Todo updated successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/todos/:id
 * Delete a todo
 */
const deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOne({ where: { id, user_id: req.user.id } });
    if (!todo) {
      return errorResponse(res, 'Todo not found.', 404);
    }

    await todo.destroy();

    return successResponse(res, null, 'Todo deleted successfully.');
  } catch (error) {
    next(error);
  }
};

module.exports = { getTodos, createTodo, updateTodo, deleteTodo };
