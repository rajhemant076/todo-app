// middleware/errorHandler.js - Global error handling middleware
const { errorResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.stack || err.message);

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map((e) => e.message);
    return errorResponse(res, 'Validation error', 400, messages);
  }

  // Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    return errorResponse(res, 'A record with this value already exists.', 409);
  }

  // Sequelize foreign key errors
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return errorResponse(res, 'Referenced record does not exist.', 400);
  }

  // Default server error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return errorResponse(res, message, statusCode);
};

// Handle 404 routes
const notFound = (req, res) => {
  return errorResponse(res, `Route ${req.originalUrl} not found.`, 404);
};

module.exports = { errorHandler, notFound };
