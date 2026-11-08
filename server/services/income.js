/*Helper functions that executes queries for the table incomes.
 *All functions expect validated data*/

import db from "../config/db.js";

//Fetch an income by incomeId, scoped to the owning user
export const findIncomeById = async (incomeId, userId) => {
  try {
    const [income] = await db.query(
      "SELECT income_id, category_id, user_id, amount, description, transaction_date FROM incomes WHERE income_id = ? AND user_id = ?",
      [incomeId, userId],
    );

    return income[0] || null;
  } catch (error) {
    console.error("findIncomeById error", error);
    throw error;
  }
};

//Get all the incomes of the given user for the last 12 months
export const getUserIncomes = async (userId) => {
  try {
    const query = `
      SELECT I.income_id, 
             I.amount, 
             I.description, 
             DATE_FORMAT(I.transaction_date, '%Y-%m-%d') AS transaction_date,C.name AS category, C.icon 
      FROM incomes I, categories C 
      WHERE I.user_id = ? 
        AND I.category_id = C.category_id 
        AND I.transaction_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      ORDER BY I.transaction_date DESC`;
    const [incomes] = await db.query(query, [userId]);

    return incomes;
  } catch (error) {
    console.error("findUserIncome error", error);
    throw error;
  }
};

//Get incomes filtered by optional parameters (category, date range)
//Return also total amount for the filtered result set
export const getIncomeDetailsByFilters = async (userId, params) => {
  try {
    const filters = [];
    const values = [userId];

    const { categoryId, startDate, endDate } = params;

    if (categoryId) {
      filters.push(" AND I.category_id = ? ");
      values.push(categoryId);
    }

    if (startDate && endDate) {
      filters.push(" AND I.transaction_date BETWEEN ? AND ? ");
      values.push(startDate, endDate);
    } else if (startDate) {
      filters.push(" AND I.transaction_date >= ? ");
      values.push(startDate);
    }

    const whereClause = filters.join(" ");

    const incomeQuery = `
      SELECT I.income_id, 
             I.amount, 
             I.description, 
             DATE_FORMAT(I.transaction_date, '%Y-%m-%d') AS transaction_date,
             C.name AS category, 
             C.icon
      FROM incomes I
      JOIN categories C ON I.category_id = C.category_id
      WHERE I.user_id = ? ${whereClause}
      ORDER BY I.transaction_date DESC
    `;

    const totalQuery = `
      SELECT COALESCE(SUM(I.amount), 0) AS total_amount
      FROM incomes I
      WHERE I.user_id = ? ${whereClause}
    `;

    const [incomes] = await db.query(incomeQuery, values);
    const [result] = await db.query(totalQuery, values);

    return {
      incomes,
      total_amount: result[0].total_amount,
    };
  } catch (error) {
    console.error("getIncomeDetailsByFilters error", error);
    throw error;
  }
};

//Get all incomes from the last 60 days
export const getUserIncomesLast60Days = async (userId) => {
  try {
    const query = `
      SELECT I.income_id, 
             I.amount, 
             I.description, DATE_FORMAT(I.transaction_date, '%Y-%m-%d') AS transaction_date, 
             C.name AS category, C.icon 
      FROM incomes I, categories C 
      WHERE I.user_id = ? 
        AND I.category_id = C.category_id 
        AND I.transaction_date >= (CURDATE() - INTERVAL 60 DAY)
      ORDER BY I.transaction_date;`;
    const [incomes] = await db.query(query, [userId]);

    return incomes;
  } catch (error) {
    console.error("getUserIncomesLast60Days error", error);
    throw error;
  }
};

//Get total income per catagory for the last 60 days
export const getIncomeByCategoryLast60Days = async (userId) => {
  try {
    const query = `
      SELECT C.name AS category, 
             COALESCE(SUM(I.amount),0) AS amount
      FROM categories C, incomes I
      WHERE C.category_id = I.category_id 
        AND I.user_id = ?  
        AND I.transaction_date >= (CURDATE() - INTERVAL 60 DAY)
      GROUP BY C.category_id
      ORDER BY amount`;

    const [incomes] = await db.query(query, [userId]);
    return incomes || null;
  } catch (error) {
    console.error("getIncomesByCategoryLast30Days error", error);
    throw error;
  }
};

//Get total income per month for the last 15 months
export const getMontlyIncome = async (userId) => {
  try {
    const query = `
      SELECT DATE_FORMAT(transaction_date, '%Y-%m') AS month,
        SUM(amount) AS total_income
      FROM incomes
      WHERE user_id = ?
        AND transaction_date >= DATE_SUB(CURDATE(), INTERVAL 15 MONTH)
      GROUP BY month
      ORDER BY month ASC`;

    const [income] = await db.query(query, [userId]);
    return income;
  } catch (error) {
    console.error("getMontlyIncome error", error);
    throw error;
  }
};

//Get the most recent incomes
export const getLatestIncomes = async (userId, limit = 5) => {
  try {
    const query = `
      SELECT I.income_id, 
             I.amount, 
             I.description, 
             DATE_FORMAT(I.transaction_date, '%Y-%m-%d') AS transaction_date, 
             C.name AS category, 
             C.icon
    FROM incomes I, categories C
    WHERE I.user_id = ? AND I.category_id = C.category_id
    ORDER BY I.transaction_date DESC
    LIMIT ?`;

    const [incomes] = await db.query(query, [userId, limit]);
    return incomes;
  } catch (error) {
    console.error("getLatestIncomes error", error);
    throw error;
  }
};

//Insert a new income for a user
export const addIncomeHelper = async (userId, data) => {
  try {
    const { categoryId, amount, description, date } = data;

    const values = [userId, categoryId, amount, date, description];
    const query = `INSERT INTO incomes(user_id,category_id,amount, transaction_date, description) 
      VALUES (?,?,?,?,?)`;

    const [result] = await db.query(query, values);

    const newIncome = {
      income_id: result.insertId,
      user_id: userId,
      category_id: categoryId,
      amount: parseFloat(amount),
      description,
      transaction_date: date,
    };
    return newIncome;
  } catch (error) {
    console.error("addIncome error", error);
    throw error;
  }
};

//Delete a user's income
export const deleteUserIncome = async (userId, incomeId) => {
  try {
    const query = "DELETE FROM incomes WHERE user_id = ? AND income_id = ?";
    const [result] = await db.query(query, [userId, incomeId]);

    return result.affectedRows > 0;
  } catch (error) {
    console.error("deleteUserIncome error,", error);
    throw error;
  }
};

//Update income
export const updateIncomeHelper = async (userId, incomeId, incomeData) => {
  try {
    const { amount, description, date } = incomeData;
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

    if (date) {
      fields.push(" transaction_date = ? ");
      values.push(date);
    }
    values.push(userId, incomeId);

    const query = `
      UPDATE incomes SET ${fields.join(" , ")} 
      WHERE user_id = ? AND income_id = ?`;
    const [result] = await db.query(query, values);

    return result.affectedRows > 0;
  } catch (error) {
    console.error("updateIncomeHelper Error", error);
    throw error;
  }
};

//Get total income for the last
export const getTotalIncome = async (userId) => {
  try {
    const query = `
       SELECT COALESCE(SUM(amount),0) AS total_income 
       FROM incomes 
       WHERE user_id = ?`;
    const [result] = await db.query(query, [userId]);

    return Number(result[0].total_income);
  } catch (error) {
    console.error("getTotalIncome error:", error);
    throw error;
  }
};

//Get total income for the last 60 days
export const getTotalIncomeLast60Days = async (userId) => {
  try {
    const query = `
      SELECT COALESCE(SUM(amount), 0) AS total 
      FROM incomes 
      WHERE user_id = ? AND transaction_date >= (CURDATE() - INTERVAL 60 DAY)`;
    const [result] = await db.query(query, [userId]);

    return Number(result[0].total);
  } catch (error) {
    console.error("getTotalIncomeLas60Days error", error);
    throw error;
  }
};
