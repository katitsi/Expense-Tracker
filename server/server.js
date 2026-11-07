import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";

import db from "./config/db.js";
import auth from "./routes/auth.js";
import user from "./routes/user.js";
import income from "./routes/income.js";
import expense from "./routes/expense.js";
import category from "./routes/category.js";
import dashboard from "./routes/dashboard.js";
import budget from "./routes/budget.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/api/auth", auth);
app.use("/api/me", user);
app.use("/api/budget", budget);
app.use("/api/income", income);
app.use("/api/expense", expense);
app.use("/api/category", category);
app.use("/api/dashboard", dashboard);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
