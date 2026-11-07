import express from "express";

import {
  getUserInfo,
  editUserAccount,
  changePassword,
} from "../controllers/user.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getUserInfo);
router.put("/update/", protect, editUserAccount);
router.put("/update/password", protect, changePassword);

export default router;
