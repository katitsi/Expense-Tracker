import { useState, useEffect } from "react";
import { LuSearch, LuChevronDown, LuChevronUp, LuX } from "react-icons/lu";

import Input from "./Input";
import CategoryDropdown from "./CategoryDropDown";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const SearchFilters = ({ filters, onFilterChange, title, type }) => {
  const [showFilters, setShowFIlters] = useState(false);
  const [categories, setCategories] = useState(null);

  const fetchCategories = async () => {
    try {
      let response;
      if (type === "income")
        response = await axiosInstance.get(API_PATHS.CATEGORY.GET_INCOME);
      else if (type === "expense")
        response = await axiosInstance.get(API_PATHS.CATEGORY.GET_EXPENSE);

      if (response.data) setCategories(response.data);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    return () => {};
  }, []);

  const handleFilterChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const clearFilters = () => {
    const clearedFilters = { categoryId: null, startDate: "", endDate: "" };
    onFilterChange(clearedFilters);
  };

  const activeFilterCount = Object.values(filters || {}).filter(
    (value) => value !== "" && value !== null,
  ).length;
  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className="card">
      {/* ------ Filter Toggle Button ------ */}
      <div className="flex items-center justify-between">
        <h5 className="text-lg">{title}</h5>
        <button
          className="btn-secodary relative group"
          onClick={() => setShowFIlters(!showFilters)}
        >
          <LuSearch className="text-lg" />
          <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
          {showFilters ? (
            <LuChevronUp className="text-lg" />
          ) : (
            <LuChevronDown className="text-lg" />
          )}

          {hasActiveFilters && !showFilters && (
            <span className=" absolute right-3 w-5 h-5 flex items-center justify-center text-[11px] font-semibold text-white bg-secondary rounded-full group-hover:bg-indigo-200 group-hover:text-secondary group-focus:bg-indigo-200 group-focus:text-secondary transition-colors">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
      {/* ------ Filters Panel ------ */}
      {showFilters && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start justify-center">
            {/* ------ Category ------ */}
            <div>
              <CategoryDropdown
                options={categories}
                placeholder="Select a Category"
                label="Category"
                value={filters?.categoryId ?? null}
                onChange={(value) => handleFilterChange("categoryId", value)}
              />
            </div>
            {/* ------ Date Range ------ */}
            <div>
              <Input
                type="date"
                label="From:"
                value={filters?.startDate || ""}
                onChange={(e) =>
                  handleFilterChange("startDate", e.target.value)
                }
              />
            </div>

            <div>
              <Input
                type="date"
                label="To:"
                value={filters?.endDate || ""}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
              />
            </div>
          </div>

          {/* ------ Clear Button ------ */}
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors flex items-center justify-center gap-2"
            >
              <LuX className="text-lg" />
              Clear Filters
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchFilters;
