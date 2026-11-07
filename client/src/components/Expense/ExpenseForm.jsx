import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import CategoryDropdown from "../CategoryDropDown";
import Input from "../Input";
import Textarea from "../Textarea";
import Select from "react-select";
import { customStyles } from "../../utils/helper";

const paymentMethods = [
  {
    value: "Card",
    label: "Card",
  },
  {
    value: "Cash",
    label: "Cash",
  },
  {
    value: "Bank Transfer",
    label: "Bank Transfer",
  },
  {
    value: "Other",
    label: "Other",
  },
];

const ExpenseForm = ({ schema, onSubmit, type = "add", defaultData }) => {
  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { payment_method: "" },
  });

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
        description: defaultData.description,
        payment_method: defaultData.payment_method,
        date: defaultData.transaction_date,
      });
  }, [defaultData, type, reset]);

  return (
    <div>
      {type === "add" && (
        <>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <CategoryDropdown
                options={categories}
                placeholder={"Select an Expense Category"}
                label="Expense Category"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <div className="text-red-500 text-xs mt-0">
            {errors?.categoryId && <p>{errors?.categoryId.message}</p>}
          </div>
        </>
      )}
      {type === "update" && defaultData && (
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 flex items-center justify-center text-xl bg-gray-100 rounded-full">
            {defaultData.icon}
          </div>
          <p className="font-semibold text-gray-700">{defaultData.category}</p>
        </div>
      )}

      <Input
        placeholder="0.00"
        type="number"
        label="Expense Amount (€)"
        {...register("amount", { valueAsNumber: true })}
      />
      <div className="text-red-500 text-xs mt-0">
        {errors?.amount && <p>{errors?.amount?.message}</p>}
      </div>

      <label className=" text-slate-800">Payment Method</label>
      <Controller
        name="payment_method"
        control={control}
        render={({ field }) => (
          <Select
            options={paymentMethods}
            placeholder="Select a Payment Method"
            value={paymentMethods.find(
              (option) => option.value === field.value
            )}
            onChange={(option) => field.onChange(option.value)}
            styles={customStyles}
            isSearchable={false}
          />
        )}
      />

      <Textarea
        label="Notes (Optional)"
        placeholder="Notes for this expense..."
        {...register("description")}
      />
      <div className="text-red-500 text-xs mt-0">
        {errors?.description && <p>{errors?.description.message}</p>}
      </div>

      <Input placeholder="" type="date" label="Date" {...register("date")} />
      <div className="text-red-500 text-xs mt-0">
        {errors?.date && <p>{errors?.date.message}</p>}
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="btn-secodary btn-secodary-fill"
          onClick={handleSubmit(onSubmit)}
        >
          {type === "add" ? "Add Expense" : "Update Expense"}
        </button>
      </div>
    </div>
  );
};

export default ExpenseForm;
