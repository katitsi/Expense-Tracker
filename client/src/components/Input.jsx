import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ type, label, placeholder, value, onChange, ref, ...rest }) => {
  const [showPassword, setShowPassword] = useState(false);
  const finalType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <label className=" text-slate-800">{label}</label>
      <div className="input-box">
        <input
          ref={ref}
          type={finalType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e)}
          {...rest}
          className="w-full bg-transparent outline-none"
        />

        {/* ------ Icon for showing or not password ------ */}
        {type === "password" && (
          <>
            {showPassword ? (
              <FaRegEye
                size={22}
                className="text-primary-light cursor-pointer"
                onClick={() => toggleShowPassword()}
              />
            ) : (
              <FaRegEyeSlash
                size={22}
                className="text-slate-400 cursor-pointer"
                onClick={() => toggleShowPassword()}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Input;
