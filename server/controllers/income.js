import {
  addIncomeSchema,
  updateIncomeSchema,
} from "../../validation/income.js";
import { findCategoryById } from "../services/category.js";
import {
  addIncomeHelper,
  getUserIncomes,
  deleteUserIncome,
  getMontlyIncome,
  updateIncomeHelper,
  findIncomeById,
  getIncomeDetailsByFilters,
} from "../services/income.js";

//Add a new income
export const addIncome = async (req, res) => {
  const userId = req.user.id;

  const validated = addIncomeSchema.safeParse(req.body);
  if (!validated.success)
    return res.status(400).json({
      message: "Validation failed.",
      errors: validated.error.issues.map((issue) => issue.message),
    });

  try {
    const category = await findCategoryById(validated.data.categoryId);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    if (category.type !== "income")
      return res.status(400).json({
        message: "This category cannot be used for income",
      });

    const newIncome = await addIncomeHelper(userId, validated.data);
    if (newIncome)
      return res.status(200).json({
        income: { ...newIncome, name: category.name, icon: category.icon },
      });
  } catch (error) {
    console.error("addIncome error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

//Get all incomes for the authenticated user
export const getAllIncomes = async (req, res) => {
  const userId = req.user.id;

  try {
    const incomes = await getUserIncomes(userId);
    res.status(200).json({ incomes });
  } catch (error) {
    console.error("getAllIncomes error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Delete a user's income by id
export const deleteIncome = async (req, res) => {
  const userId = req.user.id;
  const incomeId = req.params.id;

  try {
    const result = await deleteUserIncome(userId, incomeId);
    if (!result) return res.status(404).json({ message: "Income not found" });

    return res.status(200).json({ message: "Income successfuly deleted" });
  } catch (error) {
    console.error("deleteIncome error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

//Update an existing income
export const updateIncome = async (req, res) => {
  const userId = req.user.id;
  const incomeId = req.params.id;

  if (!req.body) return res.status(400).json({ message: "Nothind to update!" });

  const validated = updateIncomeSchema.safeParse(req.body);
  if (!validated.success)
    return res.status(400).json({
      message: "Validation failed.",
      errors: validated.error.issues.map((issue) => issue.message),
    });

  const incomeData = validated.data;
  try {
    const income = findIncomeById(incomeId, userId);
    if (!income)
      return res.status(400).json({ message: "No such income to update" });

    const result = await updateIncomeHelper(userId, incomeId, incomeData);
    if (!result)
      return res
        .status(400)
        .json({ message: "Somithing went wrong. Try again later" });
    return res.status(201).json({ message: "Income updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try later" });
  }
};

//Get monthly income data for charting
export const getChartData = async (req, res) => {
  const userId = req.user.id;

  try {
    const data = await getMontlyIncome(userId);
    res.json({ data });
  } catch (error) {
    console.error("getChartData error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

//Get income based on filters (category, date range)
//Suppose that the user always gives correct data
export const getIncomeByFilters = async (req, res) => {
  const userId = req.user.id;
  const params = req.query;

  try {
    const data = await getIncomeDetailsByFilters(userId, params);

    res.json({
      incomes: data.incomes,
      total_amount: data.total_amount,
    });
  } catch (error) {
    console.error("getIncomeByFilters error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
