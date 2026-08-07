import { Search } from "lucide-react";
import { RB } from "../constants/billing.constants";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function BillingSearchBar({
  value,
  onChange,
  placeholder = "Search by Invoice ID, Patient Name, MRN, or Mobile Number...",
}: SearchBarProps) {
  return (
    <div className="flex-1 relative">
      <Search
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        size={16}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
        style={{ fontFamily: RB }}
      />
    </div>
  );
}

export default BillingSearchBar;
