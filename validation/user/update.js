import z from "zod";
import { passwordField } from "./fields.js";

export const editAccountSchema = z
  .object({
    username: z
      .string()
      .trim()
      .regex(
        /^[A-Za-z0-9_]+$/,
        "Username can only contain letters, numbers and underscores",
      )
      .min(3, "User name should be at least 3 characters.")
      .max(50, "User name cannon be more than 50 characters")
      .optional()
      .or(z.literal("")),

    fullname: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(50, "Name is too long.")
      .optional()
      .or(z.literal("")),

    password: z
      .string()
      .min(1, "Password is required to save changes")
      .refine((val) => {
        if (val.length < 6) return false;
        if (val.length > 50) return false;
        if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(val)) return false;
        return true;
      }, "Incorrect password"),
  })
  .refine((data) => data.username || data.fullname, {
    message: "You must update at least one of username or name",
    path: ["password"],
  });

const passwordBase = z.object({
  currentPassword: z
    .string()
    .min(1, "Password is required to save changes")
    .refine((val) => {
      if (val.length < 6) return false;
      if (val.length > 50) return false;
      if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(val)) return false;
      return true;
    }, "Incorrect password"),
  newPassword: passwordField,
  confirmPassword: z.string().min(6, "Please confirm your password!"),
});

const differentFromCurrent = [
  (data) => data.currentPassword !== data.newPassword,
  {
    message: "New password must be different from current password!",
    path: ["newPassword"],
  },
];

export const newPasswordSchema = passwordBase
  .refine(...differentFromCurrent)
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match!",
    path: ["confirmPassword"],
  });

export const backendPasswordScema = passwordBase
  .pick({
    currentPassword: true,
    newPassword: true,
  })
  .refine(...differentFromCurrent);
