import { FileText } from "lucide-react";
import { PP, RB } from "../constants/billing.constants";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onAction?: () => void;
  actionText?: string;
}

export function BillingEmptyState({
  title = "No invoices available yet",
  description = "There are no billing records matching your search query or filter selection.",
  onAction,
  actionText = "Return to Dashboard",
}: EmptyStateProps) {
  return (
    <div className="p-8 text-center space-y-3 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm">
      <FileText size={36} className="mx-auto text-slate-300 animate-pulse" />
      <h4
        className="text-sm font-bold text-slate-700"
        style={{ fontFamily: PP }}
      >
        {title}
      </h4>
      <p
        className="text-xs text-slate-500 max-w-sm mx-auto"
        style={{ fontFamily: RB }}
      >
        {description}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900 cursor-pointer"
          style={{ fontFamily: PP }}
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export default BillingEmptyState;
