import React from "react";
import CustomBarChart from "../Charts/CustomBarChart.jsx";

const Last30DaysExpenses = ({ data }) => {
  return (
    <div className="card col-span-1">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 30 Days Expenses</h5>
      </div>

      <CustomBarChart data={data} xaxis="category" />
    </div>
  );
};

export default Last30DaysExpenses;
