import React from "react";
import { Shield, Building, Filter } from "lucide-react";
import SearchInput from "../../../common/components/SearchInput";
import FilterDropdown from "../../../common/components/FilterDropdown";

interface UserFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  roleFilter: string;
  setRoleFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  deptFilter: string;
  setDeptFilter: (val: string) => void;
  departments: string[];
  onResetFilters: () => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  deptFilter,
  setDeptFilter,
  departments,
  onResetFilters,
}) => {
  const roleOptions = [
    "All",
    "Super Admin",
    "Hospital Admin",
    "Doctor",
    "Receptionist",
    "Nurse",
    "Accountant",
    "Patient",
  ];

  const statusOptions = ["All", "Active", "Inactive", "Pending", "Suspended"];
  const departmentOptions = ["All", ...departments];

  return (
    <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by User Name, Employee ID, Email, Username..."
        />

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <FilterDropdown
            label="Role"
            value={roleFilter}
            onChange={setRoleFilter}
            options={roleOptions}
            icon={<Shield size={13} className="text-slate-400" />}
          />

          <FilterDropdown
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            icon={<Filter size={13} className="text-slate-400" />}
          />

          <FilterDropdown
            label="Dept"
            value={deptFilter}
            onChange={setDeptFilter}
            options={departmentOptions}
            icon={<Building size={13} className="text-slate-400" />}
          />

          <button
            onClick={onResetFilters}
            className="px-3.5 py-2 rounded-xl text-red-500 hover:bg-red-50 font-bold transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserFilters;
