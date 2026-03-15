-- ============================================================
-- TaskFlow — MySQL Database Schema
-- Run this script to create the database and tables manually.
-- (Sequelize sync will also create them automatically on start)
-- ============================================================

-- 1. Create and select the database
CREATE DATABASE IF NOT EXISTS todo_app_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE todo_app_db;

-- 2. Users table
CREATE TABLE IF NOT EXISTS users (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100)    NOT NULL,
  email       VARCHAR(255)    NOT NULL,
  password    VARCHAR(255)    NOT NULL,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Todos table
CREATE TABLE IF NOT EXISTS todos (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  title       VARCHAR(255)    NOT NULL,
  description TEXT,
  completed   TINYINT(1)      NOT NULL DEFAULT 0,
  priority    ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
  due_date    DATE,
  category    VARCHAR(100),
  tags        JSON,
  user_id     INT UNSIGNED    NOT NULL,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  KEY idx_todos_user_id   (user_id),
  KEY idx_todos_completed (completed),
  KEY idx_todos_priority  (priority),
  KEY idx_todos_due_date  (due_date),

  CONSTRAINT fk_todos_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Optional: seed a test user  (password = "password123")
-- The hash below is bcrypt with 12 rounds for "password123"
-- ============================================================
-- INSERT INTO users (name, email, password) VALUES
-- ('Demo User', 'demo@example.com', '$2a$12$KIXwrfnV6P7NMmWbGqfxuONqnbbM6wJeKxEi/XuJjXc8JB5KcQXeW');
