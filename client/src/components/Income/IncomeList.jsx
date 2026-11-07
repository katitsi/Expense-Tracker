import TransactionInfoCard from "../Cards/TransactionInfoCard";
import { format, parseISO } from "date-fns";
import { LuSearch } from "react-icons/lu";
import { addThousandsSeparator } from "../../utils/helper";

const IncomeList = ({ transactions, onDelete, onUpdate, filters, total }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Income Sources</h5>
        {filters && (
          <p className="text-md font-semibold text-secondary">
            Total: {addThousandsSeparator(total)}€
          </p>
        )}
      </div>

      {transactions.length === 0 && filters && (
        <div className="flex flex-col justify-center items-center h-64 text-gray-500">
          <LuSearch className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-lg text-center">
            No results found. Try adjusting your filters.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2">
        {transactions?.map((income) => (
          <TransactionInfoCard
            key={income.income_id}
            category={income.category}
            icon={income.icon}
            description={income.description}
            date={format(parseISO(income.transaction_date), "do MMM yyyy")}
            amount={income.amount}
            type="income"
            onDelete={() => onDelete(income.income_id)}
            onUpdate={() => onUpdate(income)}
          />
        ))}
      </div>
    </div>
  );
};

export default IncomeList;
