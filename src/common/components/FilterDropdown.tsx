import React from "react";

interface FilterDropdownProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[] | { label: string; value: string }[];
  icon?: React.ReactNode;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  value,
  onChange,
  options,
  icon,
}) => {
  return (
    <div className="flex items-center gap-1.5 bg-slate-50 border border-[#E5E7EB] px-3 py-1.5 rounded-xl text-xs">
      {icon}
      <span className="text-slate-500 font-medium">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent font-bold text-[#111827] outline-none cursor-pointer"
      >
        {options.map((opt, i) => {
          const optVal = typeof opt === "string" ? opt : opt.value;
          const optLabel = typeof opt === "string" ? opt : opt.label;
          return (
            <option key={i} value={optVal}>
              {optLabel}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default FilterDropdown;
