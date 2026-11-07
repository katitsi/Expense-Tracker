import { format, parseISO } from "date-fns";

export const getInitials = (name) => {
  if (!name) return "";

  const words = name.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) initials += words[i][0];

  return initials.toUpperCase();
};

export const addThousandsSeparator = (value) => {
  if (value === null || isNaN(value)) return "";

  const [integerPart, fractionalPart] = value.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return fractionalPart
    ? `${formattedInteger},${fractionalPart}`
    : formattedInteger;
};

export const prepareExpenseBarChartData = (data = []) => {
  const chartData = data.map((item) => ({
    category: item?.category,
    spent: item?.total_spent,
    transactions: item?.transactions,
  }));

  return chartData;
};

export const prepareIncomeBarChartData = (data = []) => {
  const chartData = data.map((item) => ({
    month: format(parseISO(item?.month + "-01"), "MMM yyyy"),
    amount: Number(item?.total_income),
  }));

  return chartData;
};

//styles for CategoryDropdown compoment
export const customStyles = {
  control: (base, state) => ({
    ...base,
    height: 45,
    marginTop: "0.25rem",
    marginBottom: "1rem",
    borderRadius: "0.25rem",
    border: "1px solid var(--color-primary-light)",
    backgroundColor: "white",
    transition: "all 200ms ease-in-out",
    cursor: "pointer",
    fontSize: "0.875rem",
    "&:hover": {
      border: "1px solid var(--color-primary)",
    },

    ...(state.isFocused && {
      border: "1px solid var(--color-primary-dark)",
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    }),
  }),

  valueContainer: (base) => ({
    ...base,
    padding: "0 0.75rem",
  }),

  singleValue: (base) => ({
    ...base,
    color: "#000000",
    fontSize: "0.875rem", // text-sm
  }),

  placeholder: (base) => ({
    ...base,
    color: "var(--color-base-light)",
  }),

  indicatorsContainer: (base) => ({
    ...base,
    paddingRight: "0.75rem",
  }),

  dropdownIndicator: (base) => ({
    ...base,
    color: "var(--color-primary-light)",
    "&:hover": {
      color: "var(--color-primary)",
    },
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  menu: (base) => ({
    ...base,
    overflow: "hidden",
    fontSize: "0.875rem",
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "var(--color-primary)"
      : state.isFocused
        ? "var(--color-emerald-100)"
        : "white",
    fontWeight: state.isSelected ? "500" : "400",
    cursor: "pointer",
  }),
};
