import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import Textarea from "../Textarea.jsx";
import Input from "../Input.jsx";
import CategoryDropdown from "../CategoryDropDown.jsx";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const BudgetForm = ({ schema, onSubmit, type = "create", defaultData }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), mode: "onChange" });

  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchExpenseCategories = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(API_PATHS.CATEGORY.GET_EXPENSE);
      if (response.data) setCategories(response.data);
    } catch (error) {
      console.log("Failed to fetch categories.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenseCategories();
    return () => {};
  }, []);

  useEffect(() => {
    if (type === "update" && defaultData)
      reset({
        amount: defaultData.amount,
        description: defaultData.description || "",
        startDate: defaultData.start_date,
        endDate: defaultData.end_date,
      });
  }, [defaultData, type, reset]);

  return (
    <div>
      {type === "create" && (
        <>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <CategoryDropdown
                options={categories}
                placeholder={"Select a category"}
                label="Budget Category"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <div className="text-error text-xs mt-0">
            {errors?.categoryId && <p>{errors?.categoryId.message}</p>}
          </div>
        </>
      )}

      {type === "update" && defaultData && (
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 flex items-center justify-center text-xl bg-gray-100 rounded-full">
            {defaultData.icon}
          </div>
          <p className="font-semibold text-base">{defaultData.category}</p>
        </div>
      )}

      <Input
        placeholder="0.00"
        type="number"
        label="Budget Amount (€)"
        {...register("amount", { valueAsNumber: true })}
      />
      <div className="text-error text-xs mt-0">
        {errors?.amount && <p>{errors?.amount?.message}</p>}
      </div>

      <Textarea
        label="Notes (Optional)"
        placeholder="Notes for this budget..."
        {...register("description")}
      />
      <div className="text-error text-xs mt-0">
        {errors?.description && <p>{errors?.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Input
            placeholder=""
            type="date"
            label="From:"
            {...register("startDate")}
          />
          <div className="text-error text-xs mt-0">
            {errors?.startDate && <p>{errors?.startDate.message}</p>}
          </div>
        </div>
        <div>
          <Input
            placeholder=""
            type="date"
            label="To:"
            {...register("endDate")}
          />
          <div className="text-error text-xs mt-0">
            {errors?.endDate && <p>{errors?.endDate.message}</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="btn-secodary btn-secodary-fill"
          onClick={handleSubmit(onSubmit)}
        >
          {type === "create" ? "Create Budget" : "Update Budget"}
        </button>
      </div>
    </div>
  );
};

export default BudgetForm;
