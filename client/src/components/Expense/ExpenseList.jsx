import TransactionInfoCard from "../Cards/TransactionInfoCard";
import { format, parseISO } from "date-fns";
import { addThousandsSeparator } from "../../utils/helper";
import { LuSearch } from "react-icons/lu";

const ExpenseList = ({ transactions, onDelete, onUpdate, filters, total }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Expense</h5>
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
        {transactions?.map((expense) => (
          <TransactionInfoCard
            key={expense.expense_id}
            category={expense.category}
            icon={expense.icon}
            description={expense.description}
            date={format(parseISO(expense.transaction_date), "do MMM yyy")}
            amount={expense.amount}
            payment_method={expense.payment_method}
            type="expense"
            onDelete={() => onDelete(expense.expense_id)}
            onUpdate={() => onUpdate(expense)}
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;
