import CustomPieChart from "../Charts/CustomPieChart.jsx";

const COLORS = [
  "var(--color-secondary-light)",
  "var(--color-red-500)",
  "var(--color-primary-light)",
];

const FinanceOverview = ({ totalBalance, totalIncome, totalExpense }) => {
  const balanceData = [
    { name: "Total Balance", amount: totalBalance },
    { name: "Total Expense", amount: totalExpense },
    { name: "Total Income", amount: totalIncome },
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h5 className="text-lg">Financial Overview</h5>
      </div>

      <CustomPieChart
        data={balanceData}
        label="Total Balance"
        totalAmount={`${totalBalance}€`}
        colors={COLORS}
        showTextArchor
      />
    </div>
  );
};

export default FinanceOverview;
