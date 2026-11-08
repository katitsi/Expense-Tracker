# Expense Tracker

A full-stack personal finance web app for tracking income and expenses, setting per-category budgets, and seeing where your money goes through an interactive dashboard.

## Features

- **Authentication**: Register and login with JWT authentication, passwords are hashed using bcrypt
- **Dashboard**: overview of financial activity, recent transactions and charts
- **Income Management**: add, edit, delete, search and review income records
- **Expense Management**: add, edit, delete, filter and review expense records
- **Budget Management**: create, edit and delete category-based budgets
- **Account**: update account details and change password
- **Data visualization**: charts for income and expenses, including category and time-based summaries


<img width="1915" height="928" alt="Στιγμιότυπο οθόνης 2026-11-08 151712" src="https://github.com/user-attachments/assets/dbd943f0-1056-45c3-88d2-b804e48d094c" />
<img width="1917" height="931" alt="Στιγμιότυπο οθόνης 2026-11-08 151206" src="https://github.com/user-attachments/assets/adf5b1f6-a1c1-4e12-aa2e-2b852676a340" />
<img width="1917" height="927" alt="Στιγμιότυπο οθόνης 2026-11-08 151525" src="https://github.com/user-attachments/assets/a74b2ff8-4c68-45f7-bea9-a4a33af8ba2a" />
<img width="1917" height="933" alt="Στιγμιότυπο οθόνης 2026-11-08 151336" src="https://github.com/user-attachments/assets/09fa8349-0146-46a7-9c08-1dd6f8f868eb" />
<img width="1917" height="935" alt="Στιγμιότυπο οθόνης 2026-11-08 151313" src="https://github.com/user-attachments/assets/6a6954fb-cf50-44f8-b74c-107f014cef2e" />


## Tech Stack

**Frontend**
- React 19 
- Vite 7
- Tailwind CSS 4
- Axios
- React Router 7
- React Hook Form
- Recharts 
**Backend**
- Node.js
- Express 5
- JSON Web Tokens (jsonwebtoken)
- bcrypt
- mysql2 (MySQL)                               
**Validation**
- Zod 4 (shared between client and server)                                         
**Database**
- MySQL 8 (InnoDB)                                                                 

## Installation

### Prerequisites

- Node.js 20+ and npm
- MySQL 8.0+

### 1. Clone the repository

```bash
git clone https://github.com/katitsi/Expense-Tracker.git
cd Expense-Tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the Database

```bash
cd database
mysql -u root -p < setUp.sql
cd ..
```

> Run this from inside `database/`

### 4. Configure environment variables

Create `server/.env` locally:

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
- There is no validation on the filters (correct date range)

##

This project is based on the [Build a Full-Stack MERN Expense Tracker](https://www.youtube.com/watch?v=PQnbtnsYUho) tutorial by **Time To Program**.

This project differs from it in the following ways:

- **Database**: MySQL - relational schema
- **Budgets** (new): per-category spending limits with overlap detection and spending progress
- **Search** (new): filter by category and date range
- **Account Management** (new): edit profile and change password
- **Shared Validation**: Zod schemas used by both client and server
- **Editing transactions**
- **Predefined categories**
