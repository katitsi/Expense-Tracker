import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

import DashboardLayout from "../../components/layouts/DashboardLayout";
import Modal from "../../components/Modal";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DeleteAlert from "../../components/DeleteAlert";
import SearchFilters from "../../components/SearchFilters.jsx";
import ExpenseForm from "../../components/Expense/ExpenseForm";
import ExpenseList from "../../components/Expense/ExpenseList";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import {
  addExpenseSchema,
  updateExpenseSchema,
} from "../../../../validation/expense.js";

const Expense = () => {
  const [expenseData, setExpenseData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [expenseLoading, setExpenseLoading] = useState("");
  const [chartDataLoading, setChartDataLoading] = useState(false);
  const [totalExpense, setTotalExpense] = useState("");
  const [filters, setFilters] = useState({
    categoryId: null,
    startDate: "",
    endDate: "",
  });
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openUpdateModal, setOpenUpdateModal] = useState({
    show: false,
    data: null,
  });
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  const hasFilter = Object.values(filters).some(
    (filter) => filter !== "" && filter !== null,
  );

  //API call for fetching the necessery data
  const fetchExpenseDetails = async () => {
    if (expenseLoading) return;
    setExpenseLoading(true);

    try {
      let response;
      if (hasFilter)
        response = await axiosInstance.get(API_PATHS.EXPENSE.GET_BY_FILTERS, {
          params: {
            categoryId: filters.categoryId,
            startDate: filters.startDate,
            endDate: filters.endDate,
          },
        });
      else
        response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);

      if (response.data) {
        setExpenseData(response.data.expenses);
        if (response.data.total_amount)
          setTotalExpense(response.data.total_amount);
      }
    } catch (error) {
      console.error("Something went wrong.", error);
    } finally {
      setExpenseLoading(false);
    }
  };

  const fetchChartData = async () => {
    if (chartDataLoading) return;
    setChartDataLoading(true);

    try {
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.GET_CHART_DATA,
      );
      if (response.data) setChartData(response.data.data);
    } catch (error) {
      console.error("Something went wrong.", error);
    } finally {
      setChartDataLoading(false);
    }
  };

  //API call for adding an expense
  const handleAddExpense = async (expense) => {
    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, expense);
      setOpenAddExpenseModal(false);
      toast.success("Expense added successfully!");
      fetchExpenseDetails();
      fetchChartData();
    } catch (error) {
      console.error(
        "Error adding expense:",
        error.response?.data.message || error.message,
      );
      toast.error(error?.response?.data.message);
    }
  };

  const handleUpdateExpense = async (expenseData) => {
    setExpenseLoading(true);
    try {
      const expenseId = openUpdateModal.data.expense_id;
      await axiosInstance.put(API_PATHS.EXPENSE.UPDATE_EXPENSE(expenseId), {
        amount: expenseData.amount,
        description: expenseData.description,
        payment_method: expenseData.payment_method,
        date: expenseData.date,
      });
      toast.success("Expese updated successfully!");
      setOpenUpdateModal(false);
      fetchExpenseDetails();
      fetchChartData();
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  //API call for deleting an expense.
  const handleDeleteExpense = async (expenseId) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(expenseId));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense details deleted successfully");
      fetchExpenseDetails();
      fetchChartData();
    } catch (error) {
      console.error(
        "Error deleting expense:",
        error.response?.data.message || error.message,
      );
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  useEffect(() => {
    fetchExpenseDetails();
  }, [filters]);

  return (
    <DashboardLayout activeMenu="Expenses">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="mt-2">
            <ExpenseOverview
              transactions={chartData}
              onAddExpense={() => setOpenAddExpenseModal(true)}
            />
          </div>

          <SearchFilters
            filters={filters}
            onFilterChange={setFilters}
            title="Filter Your Expenses"
            type="expense"
          />

          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            onUpdate={(expense) =>
              setOpenUpdateModal({ show: true, data: expense })
            }
            filters={hasFilter}
            total={totalExpense}
          />
        </div>

        {/* ------ Add Expense ------ */}
        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <ExpenseForm
            onSubmit={handleAddExpense}
            schema={addExpenseSchema}
            type="add"
          />
        </Modal>

        {/* ------ Update Expense ------ */}
        <Modal
          isOpen={openUpdateModal.show}
          onClose={() => setOpenUpdateModal({ show: false, data: null })}
          title="Update Expense"
        >
          <ExpenseForm
            onSubmit={handleUpdateExpense}
            schema={updateExpenseSchema}
            type="update"
            defaultData={openUpdateModal.data}
          />
        </Modal>

        {/* ------ Delete Expense ------ */}
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this expense?"
            onDelete={() => handleDeleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
