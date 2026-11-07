import {
  findUserById,
  findUserByUsername,
  updateUser,
  confirmPassword,
  updatePassword,
} from "../services/user.js";
import {
  editAccountSchema,
  backendPasswordScema,
} from "../../validation/user/update.js";

// Edit user account (username, fullname)
export const editUserAccount = async (req, res) => {
  const userId = req.user.id;

  //Validate input
  const validated = editAccountSchema.safeParse(req.body);
  if (!validated.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validated.error.flatten().fieldErrors,
    });
  }

  const { username, fullname, password } = validated.data;

  if (!username && !fullname) {
    return res.status(400).json({ message: "Nothing to update!" });
  }

  try {
    const isValid = await confirmPassword(userId, password);
    if (!isValid) {
      return res.status(400).json({ message: "Wrong password. Try again!" });
    }

    //Check username uniqueness
    if (username) {
      const existingUser = await findUserByUsername(username);
      if (existingUser && existingUser.user_id !== userId) {
        return res.status(400).json({ message: "Username is already taken." });
      }
    }

    //Update user
    const updated = await updateUser(userId, { username, fullname });
    if (!updated) {
      return res
        .status(400)
        .json({ message: "Something went wrong. Try again later." });
    }

    return res.status(200).json({
      message: "Account updated successfully",
    });
  } catch (error) {
    console.error("editUserAccount:", error);
    return res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
};

//Change user password
export const changePassword = async (req, res) => {
  const userId = req.user.id;

  const validated = backendPasswordScema.safeParse(req.body);
  if (!validated.success)
    return res.status(400).json({
      message: "Validation failed.",
      errors: validated.error.issues.map((issue) => issue.message),
    });

  const { currentPassword, newPassword } = validated.data;
  try {
    const isValid = await confirmPassword(userId, currentPassword);
    if (!isValid)
      return res.status(400).json({ message: "Wrong password. Try again!" });

    const result = await updatePassword(userId, newPassword);
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("changePass error: ", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

//Fetch user info by id
export const getUserInfo = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);

    return res.json(user);
  } catch (error) {
    console.error("Get user info error: ", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
