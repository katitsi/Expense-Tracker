import BudgetInfoCard from "../Cards/BudgetInfoCard";
import { format, parseISO } from "date-fns";

const BudgetList = ({ budgets, onDelete, onUpdate }) => {
  return (
    <div className="grid grid-cols-1">
      {budgets?.map((budget) => (
        <div key={budget.budget_id} className="mb-4">
          <BudgetInfoCard
            category={budget.category}
            icon={budget.icon}
            description={budget.description}
            amount={budget.amount}
            totalSpent={budget.total_spent}
            startDate={format(parseISO(budget.start_date), "dd MMM yyy")}
            endDate={format(parseISO(budget.end_date), "dd MMM yyy")}
            onDelete={() => onDelete(budget.budget_id)}
            onUpdate={() => onUpdate(budget)}
          />
        </div>
      ))}
    </div>
  );
};

export default BudgetList;
