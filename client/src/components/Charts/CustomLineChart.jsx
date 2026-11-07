import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { addThousandsSeparator } from "../../utils/helper";

const CustomLineChart = ({ data, type = "expense", Xaxis = "category" }) => {
  const CustomTootip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
          {type === "expense" && (
            <>
              <p className="text-xs font-semibold text-primary-dark mb-1">
                {payload[0].payload?.category}
              </p>
              <p className="text-sm text-gray-600">
                Total Spent:{" "}
                <span className="text-sm font-medium text-gray-900">
                  {addThousandsSeparator(payload[0].payload?.spent)}€
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Total transactions:{" "}
                <span className="text-sm font-medium text-gray-900">
                  {payload[0].payload?.transactions}
                </span>
              </p>
            </>
          )}

          {type === "income" && (
            <>
              <p className="text-xs font-semibold text-primary-dark mb-1">
                {payload[0].payload?.month}
              </p>
              <p className="text-sm text-gray-600">
                Amount:{" "}
                <span className="text-sm font-medium text-gray-900">
                  {addThousandsSeparator(payload[0].payload?.amount)}€
                </span>
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#016630" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#016630" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="none" />
          <XAxis
            dataKey={Xaxis}
            tick={{ fontSize: 12, fill: "#555" }}
            stroke="none"
          />
          <YAxis tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
          <Tooltip content={<CustomTootip />} />

          <Area
            type="monotone"
            dataKey={type === "expense" ? "spent" : "amount"}
            stroke="#016630"
            fill="url(#incomeGradient)"
            strokeWidth={3}
            dot={{ r: 3, fill: "#a4f4cf" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;
