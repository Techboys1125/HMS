import { RotateCcw } from "lucide-react";
import { RB } from "../constants/billing.constants";

interface FiltersProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
  methodFilter: string;
  onMethodChange: (method: string) => void;
  deptFilter: string;
  onDeptChange: (dept: string) => void;
  onReset: () => void;
  departmentOptions?: Array<{ value: string; label: string }>;
}

export function BillingFilters({
  statusFilter,
  onStatusChange,
  methodFilter,
  onMethodChange,
  deptFilter,
  onDeptChange,
  onReset,
  departmentOptions = [],
}: FiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {/* Status Filter */}
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className="px-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 text-xs text-[#111827] font-medium focus:outline-none focus:border-[#0D47A1]"
        style={{ fontFamily: RB }}
      >
        <option value="All">All Payment Statuses</option>
        <option value="Pending">Pending</option>
        <option value="Partially Paid">Partially Paid</option>
        <option value="Paid">Paid</option>
        <option value="Cancelled">Cancelled</option>
        <option value="Refunded">Refunded</option>
      </select>

      {/* Payment Method Filter */}
      <select
        value={methodFilter}
        onChange={(e) => onMethodChange(e.target.value)}
        className="px-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 text-xs text-[#111827] font-medium focus:outline-none focus:border-[#0D47A1]"
        style={{ fontFamily: RB }}
      >
        <option value="All">All Payment Methods</option>
        <option value="Cash">Cash</option>
        <option value="Card">Card</option>
        <option value="UPI">UPI</option>
        <option value="Bank Transfer">Bank Transfer</option>
      </select>

      {/* Department Filter */}
      <select
        value={deptFilter}
        onChange={(e) => onDeptChange(e.target.value)}
        className="px-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 text-xs text-[#111827] font-medium focus:outline-none focus:border-[#0D47A1]"
        style={{ fontFamily: RB }}
      >
        <option value="All">All Departments</option>
        {departmentOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Reset Filters */}
      <button
        onClick={onReset}
        className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-100 text-xs font-semibold text-[#64748B] hover:bg-slate-200 transition-colors"
        style={{ fontFamily: RB }}
        title="Reset Filters"
      >
        <RotateCcw size={13} />
        <span>Reset</span>
      </button>
    </div>
  );
}

export default BillingFilters;
