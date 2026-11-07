//Create mutiple connections to the database.
import dotenv from "dotenv";
dotenv.config();
import { createPool } from "mysql2/promise";

const pool = createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool
  .query("SELECT 1")
  .then(() => console.log("Databese connected!"))
  .catch((err) => {
    console.error("DB connection faild: ", err.message);
    process.exit(1);
  });

export default pool;
