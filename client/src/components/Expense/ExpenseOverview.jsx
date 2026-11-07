import { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";

import CustomLineChart from "../Charts/CustomLineChart";
import { prepareExpenseBarChartData } from "../../utils/helper";

import React from "react";

const ExpenseOverview = ({ transactions, onAddExpense }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const result = prepareExpenseBarChartData(transactions);
    setChartData(result);

    return () => {};
  }, [transactions]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="">
          <h5 className="text-lg">Expenses Overview</h5>
          <p className="text-xs text-gray-400 mt-0.5">
            Track your spendings trends over time and gain insights into wher
            you money goes.
          </p>
        </div>

        <button className="btn-secodary" onClick={onAddExpense}>
          <LuPlus className="text-lg" />
          Add Expense
        </button>
      </div>

      <div className="mt-10">
        <CustomLineChart data={chartData} />
      </div>
    </div>
  );
};

export default ExpenseOverview;
