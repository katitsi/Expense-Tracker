import Select from "react-select";
import { customStyles } from "../utils/helper";

const CategoryDropdown = ({
  options = [],
  value,
  onChange,
  label = "Category",
  placeholder,
}) => {
  //Transform option into react-select format
  const selectOptions = options?.map((option) => ({
    value: option.category_id,
    label: (
      <div className="flex items-center">
        <p className="text-md">
          {option?.icon} <span>{option?.name}</span>
        </p>
      </div>
    ),
    raw: option,
  }));

  const selectedOption =
    selectOptions?.find((option) => option.value === value) || null;

  return (
    <div>
      <label className=" text-slate-800">{label}</label>
      <Select
        options={selectOptions}
        value={selectedOption}
        onChange={(option) => {
          onChange(option ? option?.value : null);
        }}
        placeholder={placeholder}
        isSearchable={false}
        styles={customStyles}
      />
    </div>
  );
};

export default CategoryDropdown;
