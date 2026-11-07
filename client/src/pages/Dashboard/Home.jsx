import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import { IoMdCard } from "react-icons/io";

import DashboardLayout from "../../components/layouts/DashboardLayout";
import InfoCard from "../../components/Cards/InfoCard.jsx";
import RecentTransactions from "../../components/Dashboard/RecentTransactions.jsx";
import ExpenseTransactions from "../../components/Dashboard/ExpenseTransactions.jsx";
import Last30DaysExpenses from "../../components/Dashboard/Last30DaysExpenses.jsx";
import RecentIncome from "../../components/Dashboard/RecentIncome.jsx";
import RecentIncomeWithChart from "../../components/Dashboard/RecentIncomeWithChart.jsx";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import { addThousandsSeparator } from "../../utils/helper.js";
import FinanceOverview from "../../components/Dashboard/FinanceOverview.jsx";

const Home = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);

      if (response.data) setDashboardData(response.data);
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={addThousandsSeparator(dashboardData?.totalBalance) || 0}
            color="bg-secondary"
          />

          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={addThousandsSeparator(dashboardData?.totalIncome) || 0}
            color="bg-primary"
          />

          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expenses"
            value={addThousandsSeparator(dashboardData?.totalExpense) || 0}
            color="bg-red-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <RecentTransactions
            transactions={dashboardData?.recentTransactions}
            onSeeMore={() => navigate("/expense")}
          />

          <FinanceOverview
            totalBalance={dashboardData?.totalBalance || 0}
            totalIncome={dashboardData?.totalIncome || 0}
            totalExpense={dashboardData?.totalExpense || 0}
          />

          <ExpenseTransactions
            transactions={dashboardData?.last30DaysExpenses?.transactions || []}
            onSeeMore={() => navigate("/expense")}
          />

          <Last30DaysExpenses
            data={dashboardData?.last30DaysExpenses?.byCategory || []}
          />

          <RecentIncomeWithChart
            data={dashboardData?.last60DaysIncomes?.byCategory || []}
            totalIncome={dashboardData?.last60DaysIncomes?.total || 0}
          />

          <RecentIncome
            transactions={dashboardData?.last60DaysIncomes?.transactions || []}
            onSeeMore={() => navigate("/income")}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
