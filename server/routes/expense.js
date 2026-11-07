import express from "express";

import {
  addExpense,
  getAllExpenses,
  deleteExpense,
  updateExpense,
  getChartData,
  getExpenseByFilters,
} from "../controllers/expense.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/add", protect, addExpense);
router.delete("/:id", protect, deleteExpense);
router.put("/:id", protect, updateExpense);
router.get("/get", protect, getAllExpenses);
router.get("/get/chartData", protect, getChartData);
router.get("/search/", protect, getExpenseByFilters);

export default router;
