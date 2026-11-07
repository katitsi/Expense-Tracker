import jwt from "jsonwebtoken";
import * as zod from "zod";

import loginSchema from "../../validation/user/login.js";
import registerSchema from "../../validation/user/register.js";
import { checkCredentials, registerUserHelper } from "../services/user.js";

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing");
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

//Register a new user to the app
//Check if the given username exist in the databese
export const registerUser = async (req, res) => {
  const validated = registerSchema.safeParse(req.body);

  if (!validated.success)
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: validated.error.issues.map((issue) => issue.message),
    });

  try {
    const newUser = await registerUserHelper(validated.data);

    return res.status(201).json({
      success: true,
      user: {
        id: newUser.user_id,
        username: newUser.username,
        fullname: newUser.fullname,
        created_at: new Date(),
      },
      token: generateToken(newUser.user_id),
    });
  } catch (err) {
    if (err?.code == "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "User with this username already exists!",
      });
    }
    console.error("Register error: ", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const loginUser = async (req, res) => {
  const validated = loginSchema.safeParse(req.body);

  if (!validated.success)
    return res.status(400).json({
      success: false,
      message: "Wrong username or password!",
    });

  try {
    const user = await checkCredentials(validated.data);
    if (!user)
      return res.status(400).json({
        success: false,
        message: "Wrong username or password!",
      });

    return res.status(200).json({
      success: true,
      user: {
        id: user.user_id,
        username: user.username,
        fullname: user.fullname,
        created_at: user.created_at,
      },
      token: generateToken(user.user_id),
    });
  } catch (error) {
    console.error("Login error: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
