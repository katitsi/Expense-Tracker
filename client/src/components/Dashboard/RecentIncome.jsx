import React from "react";
import { LuArrowRight } from "react-icons/lu";
import { format, parseISO } from "date-fns";
import TransactionInfoCard from "../Cards/TransactionInfoCard";

const RecentIncome = ({ transactions, onSeeMore }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Income</h5>

        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="mt-6">
        {transactions?.slice(0, 5)?.map((item) => (
          <TransactionInfoCard
            key={item.income_id}
            category={item.category}
            description={item.description}
            icon={item.icon}
            date={format(parseISO(item.transaction_date), "do MMM yyyy")}
            amount={item.amount}
            type="income"
            hideDeleteBtn
            hideUpdateBtn
          />
        ))}
      </div>
    </div>
  );
};

export default RecentIncome;
