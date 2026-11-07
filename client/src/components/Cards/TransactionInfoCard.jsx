import {
  LuUtensils,
  LuTrendingUp,
  LuTrendingDown,
  LuTrash2,
} from "react-icons/lu";
import { FiEdit2 } from "react-icons/fi";

import { addThousandsSeparator } from "../../utils/helper";

const TransactionInfoCard = ({
  category,
  description,
  icon,
  date,
  amount,
  payment_method,
  type,
  onDelete,
  onUpdate,
  hideUpdateBtn,
  hideDeleteBtn,
}) => {
  const getAmountStyles = () =>
    type === "income" ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500";

  return (
    <div className="group relative flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-gray-200/60">
      {/* ------ Category icon ------ */}
      <div className="w-12 h-12 flex items-center justify-center text-2xl text-gray-800 bg-gray-100 rounded-full">
        {icon || <LuUtensils />}
      </div>
      {/* ------ Header ------ */}
      <div className="flex-1 flex items-center justify-between min-w-0">
        <div className="min-w-0">
          <p className="text-sm text-gray-700 font-medium">{category}</p>
          {description && (
            <div className="relative group w-full">
              {/* Truncated description */}
              <p className="text-xs text-gray-500 mt-0.5">
                {description.length > 30
                  ? description.slice(0, 30) + "…"
                  : description}
              </p>

              {/* ------ Tooltip ------ */}
              {description.length > 30 && (
                <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-white text-xs rounded-xl px-3 py-2 z-10 max-w-sm max-h-32 overflow-auto">
                  {description}
                </div>
              )}
            </div>
          )}
          <p className="text-xs text-gray-400 mt-1">
            {date}
            {payment_method && ` • ${payment_method}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!hideUpdateBtn && (
            <button
              className="text-gray-400 hover:text-secondary transition-color cursor-pointer"
              onClick={onUpdate}
            >
              {<FiEdit2 size={18} />}
            </button>
          )}
          {!hideDeleteBtn && (
            <button
              className="text-gray-400 hover:text-error transition-colors cursor-pointer"
              onClick={onDelete}
            >
              <LuTrash2 size={18} />
            </button>
          )}

          {/* ------ Amount Display ------ */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getAmountStyles()}`}
          >
            <h6 className="text-xs font-medium">
              {type === "income" ? "+" : "-"} {addThousandsSeparator(amount)}€
            </h6>
            {type === "income" ? <LuTrendingUp /> : <LuTrendingDown />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionInfoCard;
