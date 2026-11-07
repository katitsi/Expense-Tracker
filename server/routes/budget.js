import {
  createBudget,
  getBudgets,
  deleteBudget,
  getInfos,
  updateBudget,
} from "../controllers/budget.js";
import express from "express";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/get", protect, getBudgets);
router.get("/get/infos", protect, getInfos);
router.put("/:id", protect, updateBudget);
router.post("/create", protect, createBudget);
router.delete("/:id", protect, deleteBudget);

export default router;
