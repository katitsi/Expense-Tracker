/*Helper functions that executes queries for the table budgets.
 *All functions expect validated data*/

import db from "../config/db.js";

//Find if a budget exist by given id.
export const findBudgetById = async (userId, budgetId) => {
  try {
    const query = `
      SELECT budget_id, 
             user_id, 
             category_id, 
             amount, 
             description,
             start_date, 
             end_date
      FROM budgets 
      WHERE user_id = ? AND budget_id = ?`;

    const [result] = await db.query(query, [userId, budgetId]);
    return result[0] || null;
  } catch (error) {
    console.error("findBudgetById error", error);
    throw error;
  }
};

//Get all budgets for a specific user along with their category details
//and calculates the total amount spent per budget within the budget period.
export const getAllBudget = async (userId) => {
  try {
    const query = `
    SELECT B.budget_id, 
           B.user_id, 
           C.name AS category, 
           C.icon,
           B.amount, 
           B.description, 
           DATE_FORMAT(B.start_date, '%Y-%m-%d') AS start_date, 
           DATE_FORMAT(B.end_date, '%Y-%m-%d') AS end_date,
           COALESCE(SUM(E.amount), 0) AS total_spent
    FROM budgets B
    JOIN categories C ON B.category_id = C.category_id
    LEFT JOIN expenses E
    ON E.user_id = B.user_id
      AND E.category_id = B.category_id
      AND E.transaction_date BETWEEN B.start_date AND B.end_date
    WHERE B.user_id = ?
    GROUP BY B.budget_id, B.user_id, C.category_id, B.start_date, B.end_date
    ORDER BY B.end_date DESC, B.start_date`;

    const [budgets] = await db.query(query, [userId]);

    return budgets || null;
  } catch (error) {
    console.error("getAllBudget error", error);
  }
};

//Get the number of active budgets, the total budget and the total spend
export const getBudgetsInfos = async (userId) => {
  try {
    const query = `
    SELECT COUNT(*) AS active_budgets,
           COALESCE(SUM(budget_amount), 0) AS total_amount,
           COALESCE(SUM(category_total_spent), 0) AS total_spent
    FROM (
      SELECT B.amount AS budget_amount,
             COALESCE(SUM(E.amount), 0) AS category_total_spent
      FROM budgets B
      LEFT JOIN expenses E
      ON E.user_id = B.user_id
        AND E.category_id = B.category_id
        AND E.transaction_date BETWEEN B.start_date AND B.end_date
      WHERE B.user_id = ?
        AND B.end_date >= CURDATE()
      GROUP BY B.budget_id
    ) AS GroupCategory`;
    const [result] = await db.query(query, userId);

    return result[0];
  } catch (error) {
    console.error("getBudgetsInfo error:", error);
    throw error;
  }
};

//Create a new budget for a user
export const addBudget = async (userId, data) => {
  try {
    const { categoryId, amount, description, startDate, endDate } = data;
    const values = [
      userId,
      categoryId,
      amount,
      description,
      startDate,
      endDate,
    ];

    const query = `INSERT INTO budgets(user_id,category_id,amount,description,start_date,end_date) 
       VALUES (?,?,?,?,?,?)`;
    const [result] = await db.query(query, values);

    const newBudget = {
      budget_id: result.insertId,
      user_id: userId,
      category_id: categoryId,
      amount: parseFloat(amount),
      start_date: startDate,
      end_date: endDate,
    };
    return newBudget;
  } catch (error) {
    console.error("newBudget error", error);
    throw error;
  }
};

export const updateBudgetHelper = async (userId, budgetId, budgetData) => {
  try {
    const { amount, description, startDate, endDate } = budgetData;
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

    if (startDate) {
      fields.push(" start_date = ? ");
      values.push(startDate);
    }

    if (endDate) {
      fields.push(" end_date = ? ");
      values.push(endDate);
    }

    values.push(userId, budgetId);

    const query = `UPDATE budgets SET ${fields.join(
      " , ",
    )} WHERE user_id = ? AND budget_id = ?`;
    const [result] = await db.query(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("updateBudget error", error);
    throw error;
  }
};

//Delete a budget belonging to a specific user.
export const removeBudget = async (userId, budgetId) => {
  try {
    const query = "DELETE FROM budgets WHERE user_id = ? AND budget_id = ? ";
    const [result] = await db.query(query, [userId, budgetId]);

    return result.affectedRows > 0;
  } catch (error) {
    console.error("deleteBudget error", error);
    throw error;
  }
};

//Check if there is a active budget on the same category for a spesific user.
//excludeBudgetId is used for updating.
export const checkForOverlappingBudget = async (
  userId,
  categoryId,
  startDate,
  endDate,
  excludeBudgetId = null,
) => {
  try {
    let query = `
      SELECT budget_id 
      FROM budgets 
      WHERE user_id = ? AND category_id = ? 
        AND start_date <= ?
        AND end_date >= ?`;

    let values = [userId, categoryId, endDate, startDate];

    if (excludeBudgetId) {
      query += ` AND budget_id != ? `;
      values.push(excludeBudgetId);
    }

    const [result] = await db.query(query, values);

    return result.length > 0;
  } catch (error) {
    console.error("checkForOverlappingBudget error", error);
    throw error;
  }
};
