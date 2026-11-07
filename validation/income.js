import * as z from "zod";

const categoryValidation = z
  .number({ error: "Income source is required!" })
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

const dateValidation = z
  .string({ required_error: "Date is required." })
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
  .refine(
    (date) => {
      const [year, month, day] = date.split("-").map(Number);
      const givenDate = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return givenDate <= today;
    },
    { message: "Date cannot be in the future!" }
  );

export const addIncomeSchema = z.object({
  categoryId: categoryValidation,
  amount: amountValidation,
  description: descriptionValidation,
  date: dateValidation,
});

export const updateIncomeSchema = z.object({
  amount: amountValidation.optional(),
  description: descriptionValidation.optional(),
  date: dateValidation.optional(),
});
