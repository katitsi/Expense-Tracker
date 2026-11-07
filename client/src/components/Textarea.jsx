import React from "react";

const Textarea = ({ label, placeholder, value, onChange, ...rest }) => {
  return (
    <>
      <label className="text-slate-800">{label}</label>
      <div className="input-box">
        <textarea
          className="w-full bg-transparent outline-none"
          rows={3}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...rest}
        />
      </div>
    </>
  );
};

export default Textarea;
