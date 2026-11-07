-- Databese set up for Expense Tracker

CREATE DATABASE IF NOT EXISTS expense_tracker;
USE expense_tracker;

DROP TABLE IF EXISTS budgets;
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS incomes;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

SOURCE schema.sql;
SOURCE seed.sql;
SOURCE sample_data.sql;

SELECT 'Database setup completed successfully' AS Status;

