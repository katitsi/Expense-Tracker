import z from "zod";

const categoryIdValidation = z
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

const dateFormatValidation = (fieldName) =>
  z
    .string({ required_error: `Select the ${fieldName}` })
    .min(1, `${fieldName} is required`)
    .refine((date) => {
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      if (!regex.test(date)) return false;
      const selectedDate = new Date(date);
      return !isNaN(selectedDate.getTime());
    }, "Invalid date format (YYYY-MM-DD)");

const dateRangeRefinement = {
  endAfterStart: (data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end >= start;
  },
  maxOneYear: (data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return daysDiff <= 365;
  },
};

export const createBudgetSchema = z
  .object({
    categoryId: categoryIdValidation,
    amount: amountValidation,
    description: descriptionValidation,
    startDate: dateFormatValidation("Start date").refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, "Start date cannot be in the past"),
    endDate: dateFormatValidation("End date"),
  })
  .refine(dateRangeRefinement.endAfterStart, {
    message: "End date must be on or after the start date",
    path: ["endDate"],
  })
  .refine(dateRangeRefinement.maxOneYear, {
    message: "Budget period cannot exceed 1 year",
    path: ["endDate"],
  });

export const updateBudgetSchema = z
  .object({
    amount: amountValidation.optional(),
    description: descriptionValidation,
    startDate: dateFormatValidation("Start date").optional(),
    endDate: dateFormatValidation("End date").optional(),
  })
  .refine(dateRangeRefinement.endAfterStart, {
    message: "End date must be on or after the start date",
    path: ["endDate"],
  })
  .refine(dateRangeRefinement.maxOneYear, {
    message: "Budget period cannot exceed 1 year",
    path: ["endDate"],
  });
