export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
  },
  USER: {
    GET_INFO: "/api/me",
    EDIT_ACCOUNT: "/api/me/update/",
    GHANGE_PASS: "/api/me/update/password",
  },
  DASHBOARD: {
    GET_DATA: "/api/dashboard",
  },
  INCOME: {
    ADD_INCOME: "/api/income/add",
    GET_ALL_INCOME: "/api/income/get",
    GET_BY_FILTERS: "/api/income/search/",
    GET_CHART_DATA: "api/income/get/chartData",
    DELETE_INCOME: (incomeId) => `/api/income/${incomeId}`,
    UPDATE_INCOME: (incomeId) => `/api/income/${incomeId}`,
  },
  EXPENSE: {
    ADD_EXPENSE: "/api/expense/add",
    GET_ALL_EXPENSE: "/api/expense/get",
    GET_BY_FILTERS: "/api/expense/search/",
    GET_CHART_DATA: "/api/expense/get/chartData",
    DELETE_EXPENSE: (expenseId) => `/api/expense/${expenseId}`,
    UPDATE_EXPENSE: (expenseId) => `/api/expense/${expenseId}`,
  },
  BUDGET: {
    CREATE_BUDGET: "/api/budget/create",
    GET_BUDGET_INFOS: "/api/budget/get/infos",
    GET_BUDGETS: "/api/budget/get",
    UPDATE_BUDGET: (budgetId) => `/api/budget/${budgetId}`,
    DELETE_BUDGET: (budgetId) => `/api/budget/${budgetId}`,
  },
  CATEGORY: {
    GET_EXPENSE: "/api/category/expense",
    GET_INCOME: "/api/category/income",
    GET_ALL: "/api/category",
  },
};
