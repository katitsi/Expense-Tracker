import { useState, useEffect } from "react";
import CustomPieChart from "../Charts/CustomPieChart";

const COLORS = [
  "var(--color-emerald-800)",
  "var(--color-indigo-800)",
  "var(--color-emerald-600)",
  "var(--color-indigo-600)",
  "var(--color-green-800)",
  "var(--color-blue-800)",
  "var(--color-green-600)",
  "var(--color-blue-600)",
  "var(--color-emerald-400)",
  "var(--color-indigo-400)",
  "var(--color-emerald-200)",
  "var(--color-indigo-200)",
  "var(--color-green-400)",
  "var(--color-blue-400)",
];

const RecentIncomeWithChart = ({ data, totalIncome }) => {
  const [chartData, setChartData] = useState([]);

  const prepareChartData = () => {
    const dataArr = data?.map((item) => ({
      name: item?.category,
      amount: Number(item?.amount),
    }));

    setChartData(dataArr);
  };

  useEffect(() => {
    prepareChartData();

    return () => {};
  }, [data]);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5">
        <h5 className="text-lg">Last 60 Days Income</h5>
      </div>

      <CustomPieChart
        data={chartData}
        label="Total Income"
        totalAmount={`${totalIncome}€`}
        showTextArchor
        colors={COLORS}
      />
    </div>
  );
};

export default RecentIncomeWithChart;
