import {
  getAllBudget,
  removeBudget,
  addBudget,
  checkForOverlappingBudget,
  getBudgetsInfos,
  findBudgetById,
  updateBudgetHelper,
} from "../services/budget.js";
import {
  createBudgetSchema,
  updateBudgetSchema,
} from "../../validation/budget.js";
import { findCategoryById } from "../services/category.js";

//Get all budgets for the authenticated user
export const getBudgets = async (req, res) => {
  const userId = req.user.id;

  try {
    const budgets = await getAllBudget(userId);
    if (budgets) return res.json({ budgets });
  } catch (error) {
    console.error("getBudgets error", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

//Get summarized budgets infos
export const getInfos = async (req, res) => {
  const userId = req.user.id;

  try {
    const infos = await getBudgetsInfos(userId);
    if (infos) return res.json({ infos });
  } catch (error) {
    console.error("getInfos error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

//Create a new budget
export const createBudget = async (req, res) => {
  const userId = req.user.id;

  const validated = createBudgetSchema.safeParse(req.body);
  if (!validated.success)
    return res.status(400).json({
      message: "Validation failed.",
      errors: validated.error.issues.map((issue) => issue.message),
    });

  const { categoryId, startDate, endDate } = validated.data;

  try {
    const category = await findCategoryById(categoryId);
    if (!category || category.type !== "expense")
      return res.status(404).json({ message: "Select a valid category" });

    //Prevent duplicate budgets for same category and start date
    const budget = await checkForOverlappingBudget(
      userId,
      categoryId,
      startDate,
      endDate,
    );
    if (budget)
      return res.status(400).json({
        message: "You already have an active budget for this category!",
      });

    const newBudget = await addBudget(userId, validated.data);

    return res.status(200).json({
      budget: {
        ...newBudget,
        category_name: category.name,
        category_icon: category.icon,
      },
      message: "Budget created successfully",
    });
  } catch (error) {
    console.error("createBudget error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

//Delete a budget by id
export const deleteBudget = async (req, res) => {
  const userId = req.user.id;
  const budgetId = req.params.id;

  try {
    const result = await removeBudget(userId, budgetId);
    if (!result) return res.status(404).json({ message: "Budget not found" });
    return res.status(200).json({ message: "Budget deleted successfully" });
  } catch (error) {
    console.error("deleteBudget error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

//Update an existing budget
export const updateBudget = async (req, res) => {
  const userId = req.user.id;
  const budgetId = req.params.id;

  if (!req.body) return res.status(400).json({ message: "Nothing to update!" });

  const validated = updateBudgetSchema.safeParse(req.body);
  if (!validated.success)
    return res.status(400).json({
      message: "Validation failed.",
      errors: validated.error.issues.map((issue) => issue.message),
    });

  const budgetData = validated.data;
  const { startDate, endDate } = validated.data;

  try {
    const budget = await findBudgetById(userId, budgetId);
    if (!budget)
      return res.status(400).json({ message: "No such budget to update" });

    const categoryId = budget.category_id;

    const ovellapBudget = await checkForOverlappingBudget(
      userId,
      categoryId,
      startDate,
      endDate,
      budgetId,
    );

    if (ovellapBudget)
      return res
        .status(400)
        .json({ message: "You already have an budget at this period!" });

    const result = await updateBudgetHelper(userId, budgetId, budgetData);
    if (!result)
      return res
        .status(400)
        .json({ message: "Something went wrong. Try again later" });

    return res.status(201).json({ message: "Budget updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try later" });
  }
};
