import express from "express";
import {
  getAll,
  getExpenseCategories,
  getIncomeCategories,
} from "../controllers/category.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getAll);
router.get("/expense", protect, getExpenseCategories);
router.get("/income", protect, getIncomeCategories);

export default router;
