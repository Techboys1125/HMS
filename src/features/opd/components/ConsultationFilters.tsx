import React from "react";
import { Search, RotateCcw, Filter, X } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export interface ConsultationFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  filterDate: string;
  onDateChange: (val: string) => void;
  filterDoctor: string;
  onDoctorChange: (val: string) => void;
  filterDepartment: string;
  onDepartmentChange: (val: string) => void;
  filterStatus: string;
  onStatusChange: (val: string) => void;
  filterVisitType: string;
  onVisitTypeChange: (val: string) => void;
  onReset: () => void;
  onApply?: () => void;
  resultCount: number;
  placeholder?: string;
  showStatusFilter?: boolean;
  showVisitTypeFilter?: boolean;
  showDoctorFilter?: boolean;
  showDepartmentFilter?: boolean;
  doctorOptions?: Array<{ value: string; label: string }>;
  departmentOptions?: Array<{ value: string; label: string }>;
}

export const ConsultationFilters: React.FC<ConsultationFiltersProps> = ({
  searchQuery,
  onSearchChange,
  filterDate,
  onDateChange,
  filterDoctor,
  onDoctorChange,
  filterDepartment,
  onDepartmentChange,
  filterStatus,
  onStatusChange,
  filterVisitType,
  onVisitTypeChange,
  onReset,
  onApply,
  resultCount,
  placeholder = "Search by Patient Name, MRN, Consultation ID or Mobile Number...",
  showStatusFilter = true,
  showVisitTypeFilter = true,
  showDoctorFilter = true,
  showDepartmentFilter = true,
  doctorOptions = [{ value: "All", label: "All Doctors" }],
  departmentOptions = [{ value: "All", label: "All Departments" }],
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-4">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] transition-colors"
          style={{ fontFamily: RB }}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2 border-t border-gray-100">
        <div>
          <label
            className="block text-[11px] font-semibold text-[#64748B] mb-1"
            style={{ fontFamily: PP }}
          >
            Date
          </label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1]"
            style={{ fontFamily: RB }}
          />
        </div>

        {showDoctorFilter && (
          <div>
            <label
              className="block text-[11px] font-semibold text-[#64748B] mb-1"
              style={{ fontFamily: PP }}
            >
              Doctor
            </label>
            <select
              value={filterDoctor}
              onChange={(e) => onDoctorChange(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1]"
              style={{ fontFamily: RB }}
            >
              {doctorOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {showDepartmentFilter && (
          <div>
            <label
              className="block text-[11px] font-semibold text-[#64748B] mb-1"
              style={{ fontFamily: PP }}
            >
              Department
            </label>
            <select
              value={filterDepartment}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1]"
              style={{ fontFamily: RB }}
            >
              {departmentOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {showStatusFilter && (
          <div>
            <label
              className="block text-[11px] font-semibold text-[#64748B] mb-1"
              style={{ fontFamily: PP }}
            >
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1]"
              style={{ fontFamily: RB }}
            >
              <option value="All">All Doctor Statuses</option>
              <option value="WAITING_FOR_DOCTOR">Waiting for Doctor</option>
              <option value="CALLED">Called</option>
              <option value="IN_CONSULTATION">In Consultation</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        )}

        {showVisitTypeFilter && (
          <div>
            <label
              className="block text-[11px] font-semibold text-[#64748B] mb-1"
              style={{ fontFamily: PP }}
            >
              Visit Type
            </label>
            <select
              value={filterVisitType}
              onChange={(e) => onVisitTypeChange(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1]"
              style={{ fontFamily: RB }}
            >
              <option value="All">All Visit Types</option>
              <option value="First Visit">First Visit</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Walk-In">Walk-In</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
          Showing{" "}
          <span className="font-semibold text-[#111827]">{resultCount}</span>{" "}
          consultations
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:text-[#111827] hover:bg-slate-50 transition-colors"
            style={{ fontFamily: PP }}
          >
            <RotateCcw size={13} />
            Reset Filters
          </button>
          {onApply && (
            <button
              onClick={onApply}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#009688] text-xs font-semibold text-white hover:bg-[#00827a] transition-colors"
              style={{ fontFamily: PP }}
            >
              <Filter size={13} />
              Apply Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationFilters;
