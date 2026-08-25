import { Search, X } from "lucide-react";

const RB = "'Roboto', system-ui, sans-serif";

export type PatientFilterValues = {
  searchQuery: string;
  genderFilter: string;
  statusFilter: string;
  registrationTypeFilter: string;
};

/**
 * Search + quick filter bar for the patient list.
 * Design preserved from original PatientListScreen filter section.
 */
export function PatientFilters({
  values,
  onChange,
  onReset,
  hasActiveFilters,
}: {
  values: PatientFilterValues;
  onChange: (patch: Partial<PatientFilterValues>) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}) {
  const { searchQuery, genderFilter, statusFilter, registrationTypeFilter } =
    values;

  return (
    <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Input (Search by Patient ID, Patient Name, Phone Number) */}
        <div className="relative flex-1 min-w-70">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]"
          />
          <input aria-label="Input field"
            type="text"
            value={searchQuery}
            onChange={(e) => onChange({ searchQuery: e.target.value })}
            placeholder="Search by Patient ID, Patient Name, or Phone Number..."
            className="w-full pl-10 pr-9 py-2.5 text-xs bg-[#F1F5F9]/60 border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#64748B] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
            style={{ fontFamily: RB }}
          />
          {searchQuery && (
            <button aria-label="Close"
              onClick={() => onChange({ searchQuery: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Quick Filter Selectors */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          {/* Gender Filter */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-[#F1F5F9]/60 text-xs text-[#111827]">
            <span className="text-[#64748B]">Gender:</span>
            <select aria-label="Select option"
              value={genderFilter}
              onChange={(e) => onChange({ genderFilter: e.target.value })}
              className="bg-transparent font-semibold outline-none cursor-pointer text-[#0D47A1]"
            >
              <option value="All">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-[#F1F5F9]/60 text-xs text-[#111827]">
            <span className="text-[#64748B]">Status:</span>
            <select aria-label="Select option"
              value={statusFilter}
              onChange={(e) => onChange({ statusFilter: e.target.value })}
              className="bg-transparent font-semibold outline-none cursor-pointer text-[#0D47A1]"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Admitted">Admitted</option>
              <option value="Discharged">Discharged</option>
            </select>
          </div>

          {/* Registration Type Filter */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-[#F1F5F9]/60 text-xs text-[#111827]">
            <span className="text-[#64748B]">Reg Type:</span>
            <select aria-label="Select option"
              value={registrationTypeFilter}
              onChange={(e) =>
                onChange({ registrationTypeFilter: e.target.value })
              }
              className="bg-transparent font-semibold outline-none cursor-pointer text-[#0D47A1]"
            >
              <option value="All">All Types</option>
              <option value="ONLINE">Online</option>
              <option value="WALK_IN">Walk-In</option>
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="px-2.5 py-1.5 text-xs text-[#EF4444] font-semibold hover:bg-red-50 rounded-xl transition-colors shrink-0"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
