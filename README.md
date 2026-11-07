# Expense Tracker

A full-stack personal finance web app for tracking income and expenses, setting per-category budgets, and seeing where your money goes through an interactive dashboard.

## Features

- **Authentication**: Register and login with JWT authentication, passwords are hashed using bcrypt
- **Income and Expences**: Create, Edit, Delete and Update transactions. Every transaction has a category, an amount, a date an optional description and for expenses a payment method
- **Search**: Filter transaction by category and date range
- **Budgets**: Set a budget per expense category for a date range and see the progress of your budgeting
- **Dashboard**: See the total balance, income and expences for the last 12 months
- **Account**: Change username,name and password

## Tech Stack

|            | Technologies                                                                       |
| ---------- | ---------------------------------------------------------------------------------- |
| Frontend   | React 19, Vite 7, Tailwind CSS 4, Axios, React Router 7, React Hook Form, Recharts |
| Backend    | Node.js, Express 5, JSON Web Tokens, bcrypt, mysql2                                |
| Validation | Zod 4 (shared between client and server)                                           |
| Database   | MySQL 8 (InnoDB)                                                                   |

## Installation

### Prerequisites

- Node.js 20+ and npm
- MySQL 8.0+

### 1. Clone and Install

```bash
git clone <repo-url>
cd Expense-Tracker
npm install
```

### 2. Create the Database

```bash
cd database
mysql -u root -p < setUp.sql
cd ..
```

> Run this from inside `database/`

### 3. Configure the Server

Create `server/.env`:

```bash
PORT=8000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=expense_tracker
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password

JWT_SECRET=a_long_random_string
```

### 4. Run

```bash
npm run dev -w server
npm run dev -w client
```

## Know Limitations

- The JWT is kept in `localStorage` so an XSS attack can expose it. A production version would use `httpOnly`, `secure` and `sameSite` cookie with short-lived access tokens and refresh tokens
- Tokens are not revoked after logging out or changing the password
- No rate limit on login and register endpoints
- The API base URL is hardcoded on the client, should come from an environment variable
- There is no validation on the filters

##

This project is based on the [Build a Full-Stack MERN Expense Tracker](https://www.youtube.com/watch?v=PQnbtnsYUho) tutorial by **Time To Program**.

This project differs from it in the following ways:

- **Database**: MySQL - relational schema
- **Budgets** (new): per-category spending limits with overlap detection and spending progress
- **Search** (new): filter by category and date range
- **Account Management** (new): edit profile and change password
- **Shared Validation**: Zod schemas used by both client and server
- **Predefined categories**
