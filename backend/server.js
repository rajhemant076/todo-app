// server.js - Express app entry point
require('dotenv').config();
console.log('DB_USER:', process.env.DB_USER);
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

// Import error handling middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import models to ensure they are registered with Sequelize
require('./models/User');
require('./models/Todo');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Todo API is running 🚀', timestamp: new Date() });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use(notFound);

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Database Sync & Server Start ────────────────────────────────────────────
const startServer = async () => {
  try {
    // Sync all models with the database (alter: true updates columns safely)
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized successfully.');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
