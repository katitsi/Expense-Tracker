import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import CategoryDropdown from "../CategoryDropDown";
import Input from "../Input";
import Textarea from "../Textarea";

const IncomeForm = ({ schema, onSubmit, type = "add", defaultData }) => {
  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), mode: "onChange" });

  const fetchIncomeCategories = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance(API_PATHS.CATEGORY.GET_INCOME);
      if (response.data) setCategories(response.data);
    } catch (error) {
      console.log("Failed to fetch categories.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomeCategories();
    return () => {};
  }, []);

  useEffect(() => {
    if (type === "update" && defaultData)
      reset({
        amount: defaultData.amount,
        description: defaultData.description,
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
                placeholder={"Select an Income Source"}
                label="Income Source"
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
        label="Income Source Amount (€)"
        {...register("amount", { valueAsNumber: true })}
      />
      <div className="text-error text-xs mt-0">
        {errors?.amount && <p>{errors?.amount?.message}</p>}
      </div>

      <Textarea
        label="Notes (optional)"
        placeholder="Notes for this income..."
        {...register("description")}
      />
      <div className="text-error text-xs mt-0">
        {errors?.description && <p>{errors?.description.message}</p>}
      </div>

      <Input placeholder="" type="date" label="Date" {...register("date")} />
      <div className="text-error text-xs mt-0">
        {errors?.date && <p>{errors?.date.message}</p>}
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="btn-secodary btn-secodary-fill"
          onClick={handleSubmit(onSubmit)}
        >
          {type === "add" ? "Add Income" : "Update Income"}
        </button>
      </div>
    </div>
  );
};

export default IncomeForm;
