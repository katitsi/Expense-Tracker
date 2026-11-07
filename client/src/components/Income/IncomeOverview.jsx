import { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";

import CustomBarChart from "../Charts/CustomBarChart";
import CustomLineChart from "../Charts/CustomLineChart";
import { prepareIncomeBarChartData } from "../../utils/helper";

const IncomeOverview = ({ data, onAddIncome }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const result = prepareIncomeBarChartData(data);
    setChartData(result);

    return () => {};
  }, [data]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-lg">Income Overview</h5>
          <p className="text-xs text-gray-400 mt-0.5">
            Track your earnings over time and analyze your income trends
          </p>
        </div>

        <button className="btn-secodary" onClick={onAddIncome}>
          <LuPlus className="text-lg" />
          Add Income
        </button>
      </div>

      <div className="mt-10">
        <CustomLineChart type="income" Xaxis="month" data={chartData} />
      </div>
    </div>
  );
};

export default IncomeOverview;
