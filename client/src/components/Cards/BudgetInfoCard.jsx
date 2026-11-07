import { FiCheckCircle, FiXCircle, FiEdit2 } from "react-icons/fi";
import { LuUtensils, LuTrash2 } from "react-icons/lu";
import { BsHourglassSplit } from "react-icons/bs";
import ProgressBar from "../Budget/ProgressBar";
import { addThousandsSeparator } from "../../utils/helper";

const BudgetInfoCard = ({
  category,
  icon,
  description,
  amount,
  totalSpent,
  startDate,
  endDate,
  onDelete,
  onUpdate,
  hideDeleteBtn,
  hideUpdateBtn,
}) => {
  const isActive = (endDate) => {
    return (
      new Date(endDate).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)
    );
  };

  const getStatus = (amount, totalSpent, endDate) => {
    const success = amount - totalSpent >= 0 ? true : false;
    return !isActive(endDate) ? (success ? "success" : "fail") : "active";
  };

  const status = getStatus(amount, totalSpent, endDate);
  const remaining = amount - totalSpent;

  return (
    <>
      <div className="card">
        {/* ------ Header ------ */}
        <div className="flex items-start justify-center pb-3 mb-6 border-b  border-gray-200 ">
          {/* ----- Category Infos ----- */}
          <div className="w-15 h-15 flex items-center justify-center text-2xl text-gray-800 bg-gray-100 rounded-full p-3">
            {icon || <LuUtensils />}
          </div>

          <div className="flex-1 flex items-center pl-3 mt-2">
            <div>
              <p className="taxt-m text-gray-700 font-semibold">{category}</p>
              {description && (
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* ------ Status Badge ------ */}
            {status === "success" && (
              <div className="flex items-center gap-1.5 bg-green-100 text-success px-3 py-1.5 rounded-full text-sm font-medium">
                <FiCheckCircle size={16} /> Complited
              </div>
            )}
            {status === "fail" && (
              <div className="flex items-center gap-1.5 bg-red-100 text-error px-3 py-1.5 rounded-full text-sm font-medium">
                <FiXCircle size={16} /> Over Budget
              </div>
            )}
            {status === "active" && (
              <div className="flex items-center gap1.5 bg-emerald-100 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                <BsHourglassSplit size={16} /> Active
              </div>
            )}
            {/* ------ Buttons ------ */}
            {!hideUpdateBtn && (
              <button
                className=" p-2 text-gray-500 hover:text-secondary focus:text-secondary hover:bg-gray-200 rounded-lg transition-all cursor-pointer"
                onClick={onUpdate}
              >
                <FiEdit2 size={18} />
              </button>
            )}
            {!hideDeleteBtn && (
              <button
                className="flex p-2 text-gray-500 hover:text-red-500 focus:text-red-500 hover:bg-gray-200 rounded-lg transition-all cursor-pointer"
                onClick={onDelete}
              >
                <LuTrash2 size={18} />
              </button>
            )}{" "}
          </div>
        </div>

        {/* ------ Body ------ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-md text-gray-500">
          <div>
            <p className="mb-1">Total Budget</p>
            <p className="text-lg font-semibold text-gray-800">
              {addThousandsSeparator(amount)}€
            </p>
          </div>
          <div>
            <p className="mb-1">Total Spent</p>
            <p className="text-lg font-semibold text-gray-800">
              {addThousandsSeparator(totalSpent)}€
            </p>
          </div>
          <div>
            <p className="mb-1">Remaining</p>
            <p
              className={`text-lg font-semibold ${
                remaining >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {addThousandsSeparator(remaining.toFixed(2))}€
            </p>
          </div>
          <div>
            <p className="mb-1">Period</p>
            <p className="text-md text-gray-800 leading-tight">
              From {startDate} to {endDate}
            </p>
          </div>
        </div>
        <ProgressBar totalAmount={amount} totalSpentAmount={totalSpent} />
      </div>
    </>
  );
};

export default BudgetInfoCard;
