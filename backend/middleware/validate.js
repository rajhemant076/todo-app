// middleware/validate.js - express-validator result handler
const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return errorResponse(res, messages[0], 422, messages);
  }
  next();
};

module.exports = { validate };
