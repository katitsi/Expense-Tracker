import {
  addExpenseSchema,
  updateExpenseSchema,
} from "../../validation/expense.js";
import { findCategoryById } from "../services/category.js";
import {
  addExpenseHelper,
  getUserExpenses,
  deleteUserExpense,
  getExpenseSummaryByCategory,
  findExpenseByCategoryAndDate,
  findExpenseById,
  updateExpenseHelper,
  getExpenseDetailsByFilters,
} from "../services/expense.js";

//Add a new expense entry
export const addExpense = async (req, res) => {
  const userId = req.user.id;

  const validated = addExpenseSchema.safeParse(req.body);
  if (!validated.success)
    return res.status(400).json({
      message: "Validation failed.",
      errors: validated.error.issues.map((issue) => issue.message),
    });

  try {
    const category = await findCategoryById(validated.data.categoryId);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    if (category.type !== "expense")
      return res.status(400).json({
        message: "This category cannot be used for expense",
      });

    const expense = await findExpenseByCategoryAndDate(
      userId,
      validated.data.categoryId,
      validated.data.date,
    );
    if (expense)
      return res.status(400).json({
        message: "You alrady have an expense for this category at this date",
      });

    const newExpense = await addExpenseHelper(userId, validated.data);
    return res.status(200).json({
      expense: {
        ...newExpense,
        category_name: category.name,
        category_icon: category.icon,
      },
    });
  } catch (error) {
    console.error("addExpense error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

//Get all expenses for the authenticated user
export const getAllExpenses = async (req, res) => {
  const userId = req.user.id;

  try {
    const expenses = await getUserExpenses(userId);
    res.json({ expenses });
  } catch (error) {
    console.error("getAllIncomes error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

//Delete an expense by id
export const deleteExpense = async (req, res) => {
  const userId = req.user.id;
  const expenseId = req.params.id;

  try {
    const result = await deleteUserExpense(userId, expenseId);
    if (!result) return res.status(404).json({ message: "Expense not found" });

    return res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("deleteExpense error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

//Update an existing expense
export const updateExpense = async (req, res) => {
  const userId = req.user.id;
  const expenseId = req.params.id;

  if (!req.body) return res.status(400).json({ message: "Nothind to update!" });

  const validated = updateExpenseSchema.safeParse(req.body);
  if (!validated.success)
    return res.status(400).json({
      message: "Validation failed.",
      errors: validated.error.issues.map((issue) => issue.message),
    });

  const expenseData = validated.data;
  try {
    const expense = await findExpenseById(expenseId, userId);
    if (!expense)
      return res.status(400).json({ message: "No such expense to update" });

    const result = await updateExpenseHelper(userId, expenseId, expenseData);
    if (!result)
      return res
        .status(400)
        .json({ message: "Somithing went wrong. Try again later" });
    return res.status(201).json({ message: "Expense updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try later" });
  }
};

//Get expenses group by category for chating
export const getChartData = async (req, res) => {
  const userId = req.user.id;

  try {
    const data = await getExpenseSummaryByCategory(userId);
    res.json({ data });
  } catch (error) {
    console.error("getChartData error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

//Get expenses filtered by category, date range
//Suppose that the user always gives correct data
export const getExpenseByFilters = async (req, res) => {
  const userId = req.user.id;
  const params = req.query;

  try {
    const data = await getExpenseDetailsByFilters(userId, params);

    res.json({
      expenses: data.expenses,
      total_amount: data.total_amount,
    });
  } catch (error) {
    console.error("getExpenseByFilters error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
