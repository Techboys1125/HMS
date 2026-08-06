import React from "react";
import { Search, RotateCcw, Filter, X } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

interface ConsultationToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  // Filters
  filterDate?: string;
  onDateChange?: (val: string) => void;
  filterDoctor?: string;
  onDoctorChange?: (val: string) => void;
  filterDepartment?: string;
  onDepartmentChange?: (val: string) => void;
  filterStatus?: string;
  onStatusChange?: (val: string) => void;
  filterVisitType?: string;
  onVisitTypeChange?: (val: string) => void;
  // Actions
  onReset: () => void;
  onApply?: () => void;
  resultCount: number;
}

export const ConsultationToolbar: React.FC<ConsultationToolbarProps> = ({
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
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by Patient Name, MRN, Consultation ID or Mobile Number..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] transition-all"
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

      {/* Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2 border-t border-gray-100">
        {onDateChange && filterDate !== undefined && (
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
        )}

        {onDoctorChange && filterDoctor !== undefined && (
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
              <option value="All">All Doctors</option>
              <option value="Dr. Arjun Mehta">
                Dr. Arjun Mehta (Logged in)
              </option>
              <option value="Dr. Priya Sharma">Dr. Priya Sharma</option>
              <option value="Dr. Rajesh Kapoor">Dr. Rajesh Kapoor</option>
            </select>
          </div>
        )}

        {onDepartmentChange && filterDepartment !== undefined && (
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
              <option value="All">All Departments</option>
              <option value="Cardiology">Cardiology</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Neurology">Neurology</option>
            </select>
          </div>
        )}

        {onStatusChange && filterStatus !== undefined && (
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
              <option value="All">All Statuses</option>
              <option value="Waiting">Waiting</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Follow-up Scheduled">Follow-up Scheduled</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        )}

        {onVisitTypeChange && filterVisitType !== undefined && (
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

      {/* Summary count and actions */}
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

export default ConsultationToolbar;
