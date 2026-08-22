import React from "react";
import { Search } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

interface PrescriptionFiltersProps {
  role: "patient" | "doctor" | "admin";
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  selectedDept?: string;
  setSelectedDept?: (val: string) => void;
  dateRange?: string;
  setDateRange?: (val: string) => void;
  onReset: () => void;
  onApply?: () => void;
}

export const PrescriptionFilters: React.FC<PrescriptionFiltersProps> = ({
  role,
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  selectedDept = "All",
  setSelectedDept,
  dateRange = "All",
  setDateRange,
  onReset,
  onApply,
}) => {
  if (role === "patient") {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 relative">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Prescription ID, Doctor, Department, Diagnosis or Medicine name..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0D47A1] focus:bg-white transition-colors text-[#111827]"
              style={{ fontFamily: RB }}
            />
          </div>
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0D47A1] focus:bg-white text-slate-700 font-medium"
              style={{ fontFamily: RB }}
            >
              <option value="All">All Statuses</option>
              <option value="Issued">Issued</option>
              <option value="Completed">Completed</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span
            className="text-[11px] text-[#64748B]"
            style={{ fontFamily: RB }}
          >
            Use the search box or status filter to find specific prescriptions.
          </span>
          <button
            onClick={onReset}
            className="px-3.5 py-1.5 text-xs text-[#0D47A1] hover:bg-blue-50 rounded-xl font-semibold transition-colors"
            style={{ fontFamily: PP }}
          >
            Clear Filters
          </button>
        </div>
      </div>
    );
  }

  // Doctor or Admin Filters
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
        <div className="md:col-span-2 relative">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Prescription ID, Patient Name, MRN, or Consultation ID…"
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0D47A1] focus:bg-white transition-colors text-[#111827]"
            style={{ fontFamily: RB }}
          />
        </div>
        <div>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept?.(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0D47A1] focus:bg-white text-slate-700 font-medium"
            style={{ fontFamily: RB }}
          >
            <option value="All">All Departments</option>
            <option value="Cardiology">Cardiology</option>
            <option value="General Medicine">General Medicine</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Neurology">Neurology</option>
          </select>
        </div>
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0D47A1] focus:bg-white text-slate-700 font-medium"
            style={{ fontFamily: RB }}
          >
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Issued">Issued</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span
            className="text-xs text-slate-400 font-medium"
            style={{ fontFamily: RB }}
          >
            Date Range:
          </span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange?.(e.target.value)}
            className="px-2.5 py-1 text-xs bg-slate-50 border border-gray-200 rounded-lg outline-none text-slate-600 font-medium"
            style={{ fontFamily: RB }}
          >
            <option value="All">All Time</option>
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg font-medium transition-colors"
            style={{ fontFamily: RB }}
          >
            Reset Filters
          </button>
          <button
            onClick={onApply}
            className="px-4 py-1.5 text-xs bg-[#0D47A1] text-white rounded-lg font-semibold hover:bg-[#0c3d8a] transition-colors"
            style={{ fontFamily: PP }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionFilters;
