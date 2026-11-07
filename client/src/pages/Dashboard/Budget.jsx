import { useState, useEffect } from "react";
import { FaSackDollar, FaClock } from "react-icons/fa6";
import { BiLineChartDown } from "react-icons/bi";
import { LuPlus } from "react-icons/lu";
import { toast } from "react-hot-toast";

import DashboardLayout from "../../components/layouts/DashboardLayout";
import InfoCard from "../../components/Cards/InfoCard";
import DeleteAlert from "../../components/DeleteAlert";
import BudgetList from "../../components/Budget/BudgetList";
import Modal from "../../components/Modal";
import {
  createBudgetSchema,
  updateBudgetSchema,
} from "../../../../validation/budget";
import BudgetForm from "../../components/Budget/BudgetForm";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { addThousandsSeparator } from "../../utils/helper";

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [infos, setInfos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState({
    show: false,
    data: null,
  });
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  const fetchAllBudgetsAndInfos = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(API_PATHS.BUDGET.GET_BUDGETS);
      if (response.data) setBudgets(response.data.budgets);

      const infoResponse = await axiosInstance.get(
        API_PATHS.BUDGET.GET_BUDGET_INFOS,
      );
      if (infoResponse.data) setInfos(infoResponse.data.infos);
    } catch (error) {
      console.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBudget = async (budget) => {
    try {
      await axiosInstance.post(API_PATHS.BUDGET.CREATE_BUDGET, budget);
      setOpenCreateModal(false);
      toast.success("Budget created successfully!");
      fetchAllBudgetsAndInfos();
    } catch (error) {
      console.error(
        "Error creating budget:",
        error.response?.data.message || error.message,
      );
      toast.error(
        error.response?.data.message || "Could not create budget. Try again.",
      );
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    try {
      await axiosInstance.delete(API_PATHS.BUDGET.DELETE_BUDGET(budgetId));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Budget deleted successfully!");
      await fetchAllBudgetsAndInfos();
    } catch (error) {
      toast.error("Failed to delete. Try again later");
    }
  };

  const handleUpdateBudget = async (budgetData) => {
    setLoading(true);
    try {
      const budgetId = openUpdateModal.data.budget_id;
      await axiosInstance.put(API_PATHS.BUDGET.UPDATE_BUDGET(budgetId), {
        amount: budgetData.amount,
        description: budgetData.description,
        startDate: budgetData.startDate,
        endDate: budgetData.endDate,
      });
      toast.success("Budget updated successfully!");
      setOpenUpdateModal({ show: false, data: null });
      fetchAllBudgetsAndInfos();
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBudgetsAndInfos();
  }, []);

  return (
    <DashboardLayout activeMenu="Budget">
      <div className="my-5 mx-auto">
        {/* ------ Header ------ */}
        <div className="flex items-center justify-between mb-5 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 ">
          <div>
            <h5 className="text-xl font-semibold text-gray-800">
              Budget Management
            </h5>
            <p className="text-sm text-gray-500">
              Track and manage your spending budgets
            </p>
          </div>

          <button
            className="btn-secodary"
            onClick={() => {
              setOpenCreateModal(true);
            }}
          >
            <LuPlus /> Create Budget
          </button>
        </div>
        {/* ------ Budget infos ------*/}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<FaSackDollar />}
            label="Total Budget Amount"
            value={addThousandsSeparator(infos.total_amount) || 0}
            color="bg-blue-700"
          />

          <InfoCard
            icon={<BiLineChartDown />}
            label="Total Spent Amount"
            value={addThousandsSeparator(infos.total_spent || 0)}
            color="bg-red-700"
          />

          <InfoCard
            icon={<FaClock />}
            label="Number of active budgets"
            value={infos.active_budgets || 0}
            color="bg-green-600"
            type="number"
          />
        </div>
        {/*------ Budget Cards ------ */}
        <div className="mt-4"></div>
        <BudgetList
          budgets={budgets}
          onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
          onUpdate={(budget) =>
            setOpenUpdateModal({ show: true, data: budget })
          }
        />

        {/* ------ Create Budget ------ */}
        <Modal
          isOpen={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          title="Create Budget"
        >
          <BudgetForm
            schema={createBudgetSchema}
            onSubmit={handleCreateBudget}
          />
        </Modal>

        {/* ------ Update Budget ------ */}
        <Modal
          isOpen={openUpdateModal.show}
          onClose={() => setOpenUpdateModal({ show: false, data: null })}
          title="Update Budget"
        >
          <BudgetForm
            type="update"
            schema={updateBudgetSchema}
            onSubmit={handleUpdateBudget}
            defaultData={openUpdateModal.data}
          />
        </Modal>

        {/* ------ Delete Budget ------ */}
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Budget"
        >
          <DeleteAlert
            content="Are you sure you want to delete this budget?"
            onDelete={() => handleDeleteBudget(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Budget;
