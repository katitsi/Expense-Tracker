import React from "react";

const ProgressBar = ({ totalAmount, totalSpentAmount }) => {
  const getProgressPercentage = (amount, spent) => {
    return (spent / amount) * 100;
  };

  const getProgressBarColor = (amount, spent) => {
    const progress = getProgressPercentage(amount, spent);
    if (progress <= 65) return "bg-green-500";
    if (progress <= 85) return "bg-orange-500";
    return "bg-red-500";
  };

  const getPercentageColor = (amount, spent) => {
    const progress = getProgressPercentage(amount, spent);
    if (progress <= 65) return "text-green-500";
    if (progress <= 85) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div>
      {/* ----- Header ----- */}
      <div className="flex justify-between mb-2">
        <span className="text-base-light text-sm">Budget used</span>
        <span
          className={`${getPercentageColor(
            totalAmount,
            totalSpentAmount,
          )} font-semibold`}
        >
          {getProgressPercentage(totalAmount, totalSpentAmount).toFixed(2)}%
        </span>
      </div>

      {/* ------ Bar ------ */}
      <div className="w-full bg-gray-200 rounded-full h-3.5">
        <div
          className={`h-3.5 rounded-full transition-all ${getProgressBarColor(
            totalAmount,
            totalSpentAmount,
          )}`}
          style={{
            width: `${Math.min(
              getProgressPercentage(totalAmount, totalSpentAmount),
              100,
            )}%`,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
