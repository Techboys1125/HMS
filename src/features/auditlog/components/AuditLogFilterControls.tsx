import React from "react";
import { Calendar } from "lucide-react";
import type { AuditSelectOption } from "../types/auditlog.types";
import { optionLabel, optionValue, safeArray } from "../utils/auditlog.utils";

export function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-xs font-semibold text-gray-600">
      <span className="block mb-1">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full text-xs py-1.5 px-2 bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0D47A1] font-medium text-[#111827]"
      >
        {children}
      </select>
    </label>
  );
}

export function ApiFilterSelect({
  label,
  value,
  onChange,
  options,
  allLabel,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: AuditSelectOption[] | undefined;
  allLabel: string;
}) {
  return (
    <FilterSelect label={label} value={value} onChange={onChange}>
      <option value="All">{allLabel}</option>
      {safeArray(options).map((option) => {
        const optionId = optionValue(option);
        return (
          <option key={optionId} value={optionId}>
            {optionLabel(option)}
          </option>
        );
      })}
    </FilterSelect>
  );
}

export function DateCalendarPicker({
  selectedDateRange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: {
  selectedDateRange: string;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}) {
  if (selectedDateRange !== "Custom Range" && selectedDateRange !== "Custom") {
    return null;
  }

  return (
    <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] px-3 py-1.5 rounded-lg text-xs shadow-2xs">
      <Calendar size={14} className="text-[#0D47A1] shrink-0" />
      <span className="text-slate-500 font-semibold text-[11px]">From:</span>
      <input
        type="date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        className="px-2 py-1 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs font-semibold text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white"
      />
      <span className="text-slate-400 font-bold text-xs">To:</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        className="px-2 py-1 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs font-semibold text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white"
      />
    </div>
  );
}
