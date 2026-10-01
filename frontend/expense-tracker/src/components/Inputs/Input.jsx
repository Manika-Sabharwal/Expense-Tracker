import React, { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

const Input = ({ value, onChange, placeholder, label, type }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <label className="text-[13px] text-slate-800">{label}</label>

      <div className="input-box">
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-black placeholder:text-slate-400"
          value={value}
          onChange={(e) => onChange(e)}
        />

        {type == "password" &&
          (showPassword ? (
            <LuEye
              size={22}
              className="text-primary cursor-pointer"
              onClick={() => toggleShowPassword()}
            />
          ) : (
            <LuEyeOff
              size={22}
              className="text-slate-400 cursor-pointer"
              onClick={() => toggleShowPassword()}
            />
          ))}
      </div>
    </div>
  );
};

export default Input;