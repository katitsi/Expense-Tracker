/*Helper functions that executes queries for the table expenses.
 *All functions expect validated data*/

import db from "../config/db.js";

//Fetch an expense by expenseId, scoped to the owning user
export const findExpenseById = async (expenseId, userId) => {
  try {
    const query = `
    SELECT expense_id, 
           category_id, 
           user_id, 
           amount, 
           description, 
           transaction_date 
    FROM expenses 
    WHERE expense_id = ? AND user_id = ?`;
    const [expense] = await db.query(query, [expenseId, userId]);

    return expense[0] || null;
  } catch (error) {
    console.error("findExpenseById error", error);
    throw error;
  }
};

//Get all expenses for the last 12 months
export const getUserExpenses = async (userId) => {
  try {
    const query = `
    SELECT E.expense_id, 
           E.amount, 
           E.description, 
           E.payment_method, 
           DATE_FORMAT(E.transaction_date, '%Y-%m-%d') AS transaction_date,
           C.name AS category, 
           C.icon 
    FROM expenses E, categories C 
    WHERE E.user_id = ? AND E.category_id = C.category_id AND E.transaction_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
    ORDER BY E.transaction_date DESC`;
    const [expenses] = await db.query(query, [userId]);

    return expenses || null;
  } catch (error) {
    console.error("getUserExpenses error", error);
    throw error;
  }
};

//Get expenses filtered by optional parameters (category, date range)
//Return also total amount for the filtered result set
export const getExpenseDetailsByFilters = async (userId, params) => {
  try {
    const filters = [];
    const values = [userId];

    const { categoryId, startDate, endDate } = params;

    if (categoryId) {
      filters.push(" AND E.category_id = ? ");
      values.push(categoryId);
    }

    if (startDate && endDate) {
      filters.push(" AND E.transaction_date BETWEEN ? AND ? ");
      values.push(startDate, endDate);
    } else if (startDate) {
      filters.push(" AND E.transaction_date >= ? ");
      values.push(startDate);
    }

    const whereClause = filters.join(" ");

    const expenseQuery = `
      SELECT E.expense_id, 
             E.amount, 
             E.description, 
             DATE_FORMAT(E.transaction_date, '%Y-%m-%d') AS transaction_date,
             E.payment_method,
             C.name AS category, 
             C.icon
      FROM expenses E
      JOIN categories C ON E.category_id = C.category_id
      WHERE E.user_id = ? ${whereClause}
      ORDER BY E.transaction_date DESC
    `;

    const totalQuery = `
      SELECT COALESCE(SUM(E.amount), 0) AS total_amount
      FROM expenses E
      WHERE E.user_id = ? ${whereClause}
    `;

    const [expenses] = await db.query(expenseQuery, values);
    const [result] = await db.query(totalQuery, values);

    return {
      expenses,
      total_amount: result[0].total_amount,
    };
  } catch (error) {
    console.error("getExpenseDetailsByFilters error", error);
    throw error;
  }
};

//Get total expenses grouped by category for the last 12 months
export const getExpenseSummaryByCategory = async (userId) => {
  try {
    const query = `
        SELECT C.name AS category, 
               SUM(E.amount) AS total_spent, 
               COUNT(*) AS transactions
        FROM expenses E, categories C 
        WHERE E.user_id = ? 
          AND E.category_id = C.category_id 
          AND E.transaction_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
        GROUP BY C.category_id, C.name
        ORDER BY C.name`;

    const [expenses] = await db.query(query, [userId]);
    return expenses;
  } catch (error) {
    console.error("getExpensesByCategory error:", error);
    throw error;
  }
};

//Get all expenses from the last 30 days
export const getUserExpensesLast30Days = async (userId) => {
  try {
    const query = `
      SELECT E.expense_id, 
             E.amount, 
             E.description, 
             E.payment_method, 
             DATE_FORMAT(E.transaction_date, '%Y-%m-%d') AS transaction_date,
             C.name AS category, 
             C.icon 
      FROM expenses E, categories C 
      WHERE E.user_id = ? AND E.category_id = C.category_id AND E.transaction_date >= (CURDATE() - INTERVAL 30 DAY)
      ORDER BY E.transaction_date;`;
    const [expenses] = await db.query(query, [userId]);

    return expenses || null;
  } catch (error) {
    console.error("getUserExpensesLast30Days error", error);
    throw error;
  }
};

//Get total expense per category for the last 30 days
export const getExpensesByCategoryLast30Days = async (userId) => {
  try {
    const query = `
    SELECT C.name AS category, 
           COALESCE(SUM(E.amount),0) AS amount
    FROM categories C, expenses E
    WHERE C.category_id = E.category_id 
          AND E.user_id = ? 
          AND E.transaction_date >= (CURDATE() - INTERVAL 30 DAY)
    GROUP BY C.category_id
    ORDER BY amount`;

    const [expenses] = await db.query(query, [userId]);

    return expenses || null;
  } catch (error) {
    console.error("getExpensesByCategoryLast30Days error", error);
    throw error;
  }
};

//Get most recent expenses
export const getLatestExpenses = async (userId, limit = 5) => {
  try {
    const query = `
    SELECT E.expense_id, 
           E.amount, 
           E.description, 
           E.payment_method, 
           DATE_FORMAT(E.transaction_date, '%Y-%m-%d') AS transaction_date, 
           C.name AS category, 
           C.icon
    FROM expenses E, categories C
    WHERE E.user_id = ? AND E.category_id = C.category_id
    ORDER BY E.transaction_date DESC
    LIMIT ?`;

    const [expenses] = await db.query(query, [userId, limit]);
    return expenses;
  } catch (error) {
    console.error("getLatestExpenses error", error);
    throw error;
  }
};

//Check if an expense already exists for a given category and date
export const findExpenseByCategoryAndDate = async (
  userId,
  categoryId,
  date,
) => {
  try {
    const query = `
      SELECT expense_id 
      FROM expenses 
      WHERE user_id = ? AND category_id = ? AND transaction_date = ?`;
    const [result] = await db.query(query, [userId, categoryId, date]);

    return result[0] || null;
  } catch (error) {
    console.error("checkCategoryAndDate error", error);
  }
};

//Insert a new expense
export const addExpenseHelper = async (userId, data) => {
  try {
    const { categoryId, amount, description, payment_method, date } = data;
    const values = [
      userId,
      categoryId,
      amount,
      description,
      payment_method,
      date,
    ];

    const query = `
      INSERT INTO expenses(user_id,category_id,amount, description, payment_method,transaction_date) 
      VALUES (?,?,?,?,?,?)`;

    const [result] = await db.query(query, values);

    const newExpense = {
      expense_id: result.insertId,
      user_id: userId,
      category_id: categoryId,
      amount: parseFloat(amount),
      description,
      payment_method,
      transaction_date: date,
    };
    return newExpense;
  } catch (error) {
    console.error("addExpenseHelper error", error);
    throw error;
  }
};

//Update an expense
export const updateExpenseHelper = async (userId, expenseId, expenseData) => {
  try {
    const { amount, description, payment_method, date } = expenseData;
    const fields = [];
    const values = [];

    if (amount) {
      fields.push(" amount = ? ");
      values.push(amount);
    }

    if (description) {
      fields.push(" description = ? ");
      values.push(description);
    }

    if (payment_method) {
      fields.push(" payment_method = ? ");
      values.push(payment_method);
    }

    if (date) {
      fields.push(" transaction_date = ? ");
      values.push(date);
    }
    values.push(userId, expenseId);

    const query = `UPDATE expenses SET ${fields.join(
      " , ",
    )} WHERE user_id = ? AND expense_id = ?`;
    const [result] = await db.query(query, values);

    return result.affectedRows > 0;
  } catch (error) {
    console.error("updateExpenseHelper Error", error);
    throw error;
  }
};

//Delete an expense belonging to the user
export const deleteUserExpense = async (userId, expenseId) => {
  try {
    const query = `
      DELETE FROM expenses 
      WHERE user_id = ? AND expense_id = ?`;
    const [result] = await db.query(query, [userId, expenseId]);

    return result.affectedRows > 0;
  } catch (error) {
    console.error("deleteUserExpense error,", error);
    throw error;
  }
};

//Get total amount
export const getTotalExpense = async (userId) => {
  try {
    const query = `
      SELECT COALESCE(SUM(amount),0) AS total_expense 
      FROM expenses 
      WHERE user_id = ?`;
    const [result] = await db.query(query, [userId]);

    return Number(result[0].total_expense);
  } catch (error) {
    console.error("getTotalExpense error:", error);
    throw error;
  }
};

//Get total expenses for the last 30 days
export const getTotalExpenseLast30Days = async (userId) => {
  try {
    const query = `
      SELECT COALESCE(SUM(amount), 0) AS total 
      FROM expenses 
      WHERE user_id = ? AND transaction_date >= (CURDATE() - INTERVAL 30 DAY)`;
    const [result] = await db.query(query, [userId]);

    return Number(result[0].total);
  } catch (error) {
    console.error("getTotalExpenseLas30Days error", error);
    throw error;
  }
};
