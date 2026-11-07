import {
  getLatestIncomes,
  getTotalIncome,
  getTotalIncomeLast60Days,
  getUserIncomesLast60Days,
  getIncomeByCategoryLast60Days,
} from "../services/income.js";
import {
  getLatestExpenses,
  getTotalExpense,
  getTotalExpenseLast30Days,
  getUserExpensesLast30Days,
  getExpensesByCategoryLast30Days,
} from "../services/expense.js";

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    //Get total income & expense
    const totalIncome = await getTotalIncome(userId);
    const totalExpense = await getTotalExpense(userId);

    //Get income transactions and total income in the last 60 days
    const last60DaysIncomeTransactions = await getUserIncomesLast60Days(userId);
    const last60DaysIncome = await getTotalIncomeLast60Days(userId);
    const incomeByCategory = await getIncomeByCategoryLast60Days(userId);

    //Get expense transactions and total expense in the last 30 days
    const last30DaysExpenseTransactions =
      await getUserExpensesLast30Days(userId);
    const last30DaysExpense = await getTotalExpenseLast30Days(userId);
    const expensesByCategory = await getExpensesByCategoryLast30Days(userId);

    //Fetch the last 5 transactions from incomes and expenses
    const latestIncome = await getLatestIncomes(userId);
    const latestExpenses = await getLatestExpenses(userId);
    const latestTransactions = [
      ...latestIncome.map((t) => ({ ...t, type: "income" })),
      ...latestExpenses.map((t) => ({ ...t, type: "expense" })),
    ]
      .sort((a, b) => {
        return b.transaction_date.localeCompare(a.transaction_date);
      })
      .slice(0, 5);

    res.json({
      totalBalance: Number((totalIncome - totalExpense).toFixed(2)),
      totalIncome,
      totalExpense,
      last30DaysExpenses: {
        total: last30DaysExpense,
        transactions: last30DaysExpenseTransactions,
        byCategory: expensesByCategory,
      },
      last60DaysIncomes: {
        total: last60DaysIncome,
        transactions: last60DaysIncomeTransactions,
        byCategory: incomeByCategory,
      },
      recentTransactions: latestTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.error("Dashboard error: ", error);
  }
};

export default getDashboardData;
