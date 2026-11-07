import bcrypt from "bcrypt";
import db from "../config/db.js";

//Fetch a user by username.
//Returns null if user does not exist
export const findUserByUsername = async (username) => {
  try {
    const [row] = await db.query(
      `SELECT user_id, username, fullname, DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at FROM users WHERE username = ?`,
      [username],
    );
    return row[0] || null;
  } catch (error) {
    console.error("findUserByUsername error ", error);
    throw error;
  }
};

//Fetch a user by ID
export const findUserById = async (id) => {
  try {
    const [row] = await db.query(
      `SELECT user_id, username, fullname, DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at FROM users WHERE user_id = ?`,
      [id],
    );
    return row[0] || null;
  } catch (error) {
    console.error("findUserById error ", error);
    throw error;
  }
};

//Validate username and password.
//Returns user data if credentials are valid, otherwise null
export const checkCredentials = async (userData) => {
  const { username, password } = userData;
  try {
    const user = await findUserByUsername(username);
    if (!user) return null;

    const [row] = await db.query(
      `SELECT password FROM users WHERE username = ?`,
      [username],
    );
    const hashedPassword = row[0].password;

    const passwordsMatch = await bcrypt.compare(password, hashedPassword);
    return passwordsMatch ? user : null;
  } catch (error) {
    console.error("checkCredentials erros: ", error);
    throw error;
  }
};

//Register a new user
//Password is hashed before being stored in the database
export const registerUserHelper = async (userData) => {
  const { username, fullname, password } = userData;

  try {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      "INSERT INTO users (username, fullname, password) VALUES (?, ?, ?)",
      [username, fullname, hashedPassword],
    );
    return { user_id: result.insertId, username, fullname };
  } catch (error) {
    console.error("Database error during registration: ", error);
    throw error;
  }
};

//Confirm that a given password matches the stored password for a user
export const confirmPassword = async (userId, password) => {
  try {
    const [row] = await db.query(
      `SELECT password FROM users WHERE user_id = ?`,
      [userId],
    );
    const hashedPassword = row[0].password;
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error("Error comparing password:", error);
    return false;
  }
};

//Update user profile fields (username and/or fullname)
export const updateUser = async (userId, userData) => {
  try {
    const { username, fullname } = userData;
    const fields = [];
    const values = [];

    if (username) {
      fields.push(" username = ? ");
      values.push(username);
    }

    if (fullname) {
      fields.push(" fullname = ?");
      values.push(fullname);
    }

    values.push(userId);

    const query = `UPDATE users SET ${fields.join(" , ")} WHERE user_id = ? `;
    const [result] = await db.query(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("updateUser error:", error);
    throw error;
  }
};

export const updatePassword = async (userId, newPassword) => {
  try {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const query = "UPDATE users SET password = ? WHERE user_id = ?";
    const [result] = await db.query(query, [hashedPassword, userId]);

    return result.affectedRows > 0;
  } catch (error) {
    console.error("updatePass error:", error);
    throw error;
  }
};
