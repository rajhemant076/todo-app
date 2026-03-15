// models/Todo.js - Sequelize Todo model
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Todo = sequelize.define(
  'Todo',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      allowNull: false,
      defaultValue: 'medium',
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    tableName: 'todos',
  }
);

// Define associations
User.hasMany(Todo, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Todo.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Todo;
