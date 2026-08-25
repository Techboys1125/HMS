import { Search } from "lucide-react";

export interface NotificationFilterBarProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onResetFilters: () => void;
}

export function NotificationFilterBar({
  searchQuery,
  onSearchQueryChange,
  priorityFilter,
  onPriorityFilterChange,
  statusFilter,
  onStatusFilterChange,
  onResetFilters,
}: NotificationFilterBarProps) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input aria-label="Input field"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Search notifications by title, content, or module..."
            className="w-full rounded-xl border border-[#E5E7EB] pl-10 pr-4 py-2 text-xs focus:border-[#0D47A1] focus:outline-none focus:ring-1 focus:ring-[#0D47A1]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1 text-xs">
            <span className="text-[#64748B]">Priority:</span>
            <select aria-label="Select option"
              value={priorityFilter}
              onChange={(e) => onPriorityFilterChange(e.target.value)}
              className="rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1]"
            >
              <option value="All">All Priorities</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-[#64748B]">Status:</span>
            <select aria-label="Select option"
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1]"
            >
              <option value="All">All Statuses</option>
              <option value="Unread">Unread</option>
              <option value="Read">Read</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <button
            onClick={onResetFilters}
            className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-[#64748B] hover:bg-slate-50 transition"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
