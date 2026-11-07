import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import IncomeForm from "../../components/Income/IncomeForm";
import Modal from "../../components/Modal";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import {
  addIncomeSchema,
  updateIncomeSchema,
} from "../../../../validation/income";
import IncomeList from "../../components/Income/IncomeList";
import DeleteAlert from "../../components/DeleteAlert";
import SearchFilters from "../../components/SearchFilters";

const Income = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [incomeLoading, setIncomeLoading] = useState(false);
  const [chartDataLoading, setChartDataLoading] = useState(false);
  const [totalIncome, setTotalIncome] = useState("");
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
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

  const hasFilter = Object.values(filters).some(
    (filter) => filter !== "" && filter !== null,
  );

  const fetchIncomeDetails = async () => {
    if (incomeLoading) return;
    setIncomeLoading(true);
    try {
      let response;
      if (hasFilter)
        response = await axiosInstance.get(API_PATHS.INCOME.GET_BY_FILTERS, {
          params: {
            categoryId: filters.categoryId,
            startDate: filters.startDate,
            endDate: filters.endDate,
          },
        });
      else response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);

      if (response.data) {
        setIncomeData(response.data.incomes);
        if (response.data.total_amount)
          setTotalIncome(response.data.total_amount);
      }
    } catch (error) {
      console.error("Something went wrong.", error);
    } finally {
      setIncomeLoading(false);
    }
  };

  const fetchChartData = async () => {
    if (chartDataLoading) return;
    setChartDataLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.GET_CHART_DATA);
      if (response.data) setChartData(response.data.data);
    } catch (error) {
      console.error("Something went wrong.", error);
    } finally {
      setChartDataLoading(false);
    }
  };

  //API call for adding a new income
  const handleAddIncome = async (income) => {
    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, income);
      setOpenAddIncomeModal(false);
      toast.success("Income added successfully");
      fetchIncomeDetails();
      fetchChartData();
    } catch (error) {
      console.error(
        "Error adding income:",
        error.response?.data.message || error.message,
      );
      toast.error("Could not add income. Try again.");
    }
  };

  const handleUpdateIncome = async (incomeData) => {
    setIncomeLoading(true);
    try {
      const incomeId = openUpdateModal.data.income_id;
      await axiosInstance.put(API_PATHS.INCOME.UPDATE_INCOME(incomeId), {
        amount: incomeData?.amount,
        description: incomeData?.description,
        date: incomeData?.data,
      });
      toast.success("Income updated successfully!");
      setOpenUpdateModal({ show: false, data: null });
      fetchIncomeDetails();
      fetchChartData();
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  //API call for deleting an income
  const handleDeleteIncome = async (incomeId) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(incomeId));
      setOpenDeleteAlert({ show: false, date: null });
      toast.success("Income details deleted successfully");
      fetchIncomeDetails();
      fetchChartData();
    } catch (error) {
      console.error(
        "Error deleting income:",
        error.response?.data.message || error.message,
      );
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  useEffect(() => {
    fetchIncomeDetails();
  }, [filters]);

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="mt-2">
            <IncomeOverview
              data={chartData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>

          {/* Suppose the user does not select invalid values*/}
          <SearchFilters
            filters={filters}
            onFilterChange={setFilters}
            title="Filter Your Income sources"
            type="income"
          />

          <IncomeList
            transactions={incomeData}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            onUpdate={(income) =>
              setOpenUpdateModal({ show: true, data: income })
            }
            filters={hasFilter}
            total={totalIncome}
          />
        </div>

        {/* ------ Add Income ------ */}
        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <IncomeForm
            type="add"
            onSubmit={handleAddIncome}
            schema={addIncomeSchema}
          />
        </Modal>

        {/* ------ Update Income ------ */}
        <Modal
          isOpen={openUpdateModal.show}
          onClose={() => setOpenUpdateModal({ show: false, data: null })}
          title="Update Income"
        >
          <IncomeForm
            type="update"
            onSubmit={handleUpdateIncome}
            schema={updateIncomeSchema}
            defaultData={openUpdateModal.data}
          />
        </Modal>

        {/* ------ Delete Income ------ */}
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
        >
          <DeleteAlert
            content="Are you sure you want to delete this income detail?"
            onDelete={() => handleDeleteIncome(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
