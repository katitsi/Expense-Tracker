import { getAllCategories, getCategoriesByType } from "../services/category.js";

export const getAll = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error("getAll categories error", error);
    res.status(500).json({ message: "Failed to load categories" });
  }
};

export const getExpenseCategories = async (req, res) => {
  try {
    const categories = await getCategoriesByType("expense");
    res.status(200).json(categories);
  } catch (error) {
    console.error("getExpenseCategories categories error", error);
    res.status(500).json({ message: "Failed to load expense categories" });
  }
};

export const getIncomeCategories = async (req, res) => {
  try {
    const categories = await getCategoriesByType("income");
    res.status(200).json(categories);
  } catch (error) {
    console.error("getIncomeCategories categories error", error);
    res.status(500).json({ message: "Failed to load income categories" });
  }
};
