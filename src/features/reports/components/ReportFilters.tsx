import React from "react";
import { Filter, X } from "lucide-react";
import { RB } from "../constants/reports.constants";

export interface FilterConfig {
  key: string;
  label: string;
  type: "select" | "date" | "text";
  options?: { label: string; value: string }[];
  placeholder?: string;
}

interface ReportFiltersProps {
  filters: FilterConfig[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onReset: () => void;
}

export function ReportFilters({ filters, values, onChange, onReset }: ReportFiltersProps) {
  const hasActiveFilters = Object.values(values).some((v) => v !== "");

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#64748B]" />
          <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider" style={{ fontFamily: RB }}>
            Filters
          </span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-[#EF4444] font-medium hover:underline"
            style={{ fontFamily: RB }}
          >
            <X size={12} /> Clear All
          </button>
        )}
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        {filters.map((filter) => (
          <div key={filter.key} className="flex flex-col gap-1">
            <label className="text-[10px] font-medium text-[#94A3B8] uppercase" style={{ fontFamily: RB }}>
              {filter.label}
            </label>
            {filter.type === "select" ? (
              <select
                value={values[filter.key] || ""}
                onChange={(e) => onChange(filter.key, e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-xs text-[#111827] bg-white focus:outline-none focus:border-[#0D47A1]/40 min-w-35"
                style={{ fontFamily: RB }}
              >
                <option value="">All</option>
                {filter.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : filter.type === "date" ? (
              <input
                type="date"
                value={values[filter.key] || ""}
                onChange={(e) => onChange(filter.key, e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1]/40"
                style={{ fontFamily: RB }}
              />
            ) : (
              <input
                type="text"
                placeholder={filter.placeholder || `Search ${filter.label.toLowerCase()}...`}
                value={values[filter.key] || ""}
                onChange={(e) => onChange(filter.key, e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-xs text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0D47A1]/40 min-w-45"
                style={{ fontFamily: RB }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
