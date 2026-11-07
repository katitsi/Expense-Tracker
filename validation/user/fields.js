import z from "zod";

export const usernameField = z
  .string({ required_error: "Username is required." })
  .trim()
  .regex(
    /^[A-Za-z0-9_]+$/,
    "Username can only contain letters, numbers and underscores"
  )
  .min(3, "User name should be at least 3 characters.")
  .max(50, "User name cannon be more than 50 characters.");

export const passwordField = z
  .string({ required_error: "Password is required." })
  .min(6, "Password must be at least 6 characters.")
  .max(50, "Password should not be larger that 50 characters.")
  .regex(/[A-Za-z]/, "Password must contain at least one letter.")
  .regex(/[0-9]/, "Password must contain at least a number.");

export const fullnameField = z
  .string({ required_error: "Please enter your name." })
  .min(2, "Name must be at least 2 characters.")
  .max(50, "Name is too long.");
