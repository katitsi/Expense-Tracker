import { LuArrowRight } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import { format, parseISO } from "date-fns";

const RecentTransactions = ({ transactions, onSeeMore }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between ">
        <h5 className="text-lg">Recent Transactions</h5>

        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="mt-6">
        {transactions?.slice(0, 5).map((item) => (
          <TransactionInfoCard
            key={item.id}
            category={item.category}
            description={item.description}
            icon={item.icon}
            date={format(parseISO(item.transaction_date), "do MMM yyyy")}
            amount={item.amount}
            type={item.type}
            hideDeleteBtn
            hideUpdateBtn
          />
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
