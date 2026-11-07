import * as z from "zod";

const categoryValidation = z
  .number({ error: "Expense category is required!" })
  .int()
  .positive();

const amountValidation = z
  .number({
    error: (issue) =>
      issue.input === undefined
        ? "Amount is required."
        : "Amount must be a valid number.",
  })
  .positive("Amount must be a positive number!");

const descriptionValidation = z
  .string()
  .optional()
  .nullable()
  .transform((value) => value?.trim() || "");
const paymentMethodValidation = z.enum(
  ["Card", "Cash", "Bank Transfer", "Other"],
  {
    required_error: "Please select a payment method",
    message: "Invalid payment method selected",
  }
);

const dateValidation = z
  .string({ required_error: "Date is required" })
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
  .refine(
    (date) => {
      const [year, month, day] = date.split("-").map(Number);
      const givenDate = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return givenDate <= today;
    },
    { message: "Date cannot be in the futere" }
  );

export const addExpenseSchema = z.object({
  categoryId: categoryValidation,
  amount: amountValidation,
  description: descriptionValidation,
  payment_method: paymentMethodValidation,
  date: dateValidation,
});

export const updateExpenseSchema = z.object({
  amount: amountValidation.optional(),
  description: descriptionValidation,
  payment_method: paymentMethodValidation.optional(),
  date: dateValidation.optional(),
});
