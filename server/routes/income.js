import express from "express";

import {
  addIncome,
  deleteIncome,
  getAllIncomes,
  getChartData,
  updateIncome,
  getIncomeByFilters,
} from "../controllers/income.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.delete("/:id", protect, deleteIncome);
router.post("/add", protect, addIncome);
router.put("/:id", protect, updateIncome);
router.get("/get", protect, getAllIncomes);
router.get("/search/", protect, getIncomeByFilters);
router.get("/get/chartData", protect, getChartData);

export default router;
