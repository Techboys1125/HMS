import React from "react";
import type { ReceptionFilters } from "../types/reception.types";
import { Search, Filter, RotateCcw, Calendar, Building, User } from "lucide-react";

interface ReceptionSearchFiltersProps {
  filters: ReceptionFilters;
  onFilterChange: (newFilters: ReceptionFilters) => void;
  departments?: Array<{ id: string | number; name: string }>;
  doctors?: Array<{ id: string | number; name: string }>;
}

export const ReceptionSearchFilters: React.FC<ReceptionSearchFiltersProps> = ({
  filters,
  onFilterChange,
  departments = [
    { id: "1", name: "Cardiology" },
    { id: "2", name: "General Medicine" },
    { id: "3", name: "Pediatrics" },
    { id: "4", name: "Neurology" },
  ],
  doctors = [
    { id: "1", name: "Dr. Alexander Fleming" },
    { id: "2", name: "Dr. Sarah Jenkins" },
    { id: "3", name: "Dr. Michael Chen" },
  ],
}) => {
  const handleReset = () => {
    onFilterChange({
      searchQuery: "",
      queueStatus: "ALL",
      billingStatus: "ALL",
      departmentId: "ALL",
      doctorId: "ALL",
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Search Bar */}
        <div className="lg:col-span-2 relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Patient Name, MRN, Mobile, Token..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0D47A1] focus:bg-white transition-colors"
          />
        </div>

        {/* Date Filter */}
        <div className="relative">
          <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="date"
            value={filters.date}
            onChange={(e) => onFilterChange({ ...filters, date: e.target.value })}
            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-[#0D47A1] focus:bg-white"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={filters.queueStatus}
            onChange={(e) => onFilterChange({ ...filters, queueStatus: e.target.value })}
            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-[#0D47A1] focus:bg-white appearance-none cursor-pointer"
          >
            <option value="ALL">All Queue Statuses</option>
            <option value="WAITING">Waiting</option>
            <option value="WAITING_FOR_VITALS">Waiting for Vitals</option>
            <option value="WAITING_FOR_DOCTOR_CALL">Ready for Doctor</option>
            <option value="CALLED">Called</option>
            <option value="IN_CONSULTATION">In Consultation</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="NO_SHOW">No Show</option>
          </select>
        </div>

        {/* Department Filter */}
        <div className="relative">
          <Building size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={filters.departmentId}
            onChange={(e) => onFilterChange({ ...filters, departmentId: e.target.value })}
            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-[#0D47A1] focus:bg-white appearance-none cursor-pointer"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Doctor Filter */}
        <div className="relative">
          <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={filters.doctorId}
            onChange={(e) => onFilterChange({ ...filters, doctorId: e.target.value })}
            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-[#0D47A1] focus:bg-white appearance-none cursor-pointer"
          >
            <option value="ALL">All Doctors</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reset Filter Button */}
      {(filters.searchQuery ||
        filters.queueStatus !== "ALL" ||
        filters.billingStatus !== "ALL" ||
        filters.departmentId !== "ALL" ||
        filters.doctorId !== "ALL") && (
        <div className="flex justify-end pt-1">
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-slate-500 hover:text-[#0D47A1] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw size={13} /> Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
