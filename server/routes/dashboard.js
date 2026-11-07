import express from "express";
import protect from "../middleware/auth.js";
import getDashboardData from "../controllers/dashboard.js";

const router = express.Router();

router.get("/", protect, getDashboardData);

export default router;
