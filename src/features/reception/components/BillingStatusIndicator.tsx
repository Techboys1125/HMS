import React from "react";
import type { BillingStatus } from "../types/reception.types";
import { CheckCircle2, AlertCircle, Clock, ShieldCheck, RefreshCw } from "lucide-react";

interface BillingStatusIndicatorProps {
  status: BillingStatus;
  amount?: number;
  showAmount?: boolean;
}

export const BillingStatusIndicator: React.FC<BillingStatusIndicatorProps> = ({
  status,
  amount,
  showAmount = true,
}) => {
  const getStyle = () => {
    switch (status) {
      case "PAID":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />,
          label: "Paid",
        };
      case "PENDING":
        return {
          bg: "bg-amber-50 text-amber-800 border-amber-300 font-bold",
          icon: <AlertCircle size={12} className="text-amber-600 shrink-0" />,
          label: "Pending",
        };
      case "PARTIAL":
        return {
          bg: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <Clock size={12} className="text-blue-500 shrink-0" />,
          label: "Partial",
        };
      case "EXEMPT":
        return {
          bg: "bg-purple-50 text-purple-700 border-purple-200",
          icon: <ShieldCheck size={12} className="text-purple-600 shrink-0" />,
          label: "Exempt",
        };
      case "REFUNDED":
        return {
          bg: "bg-gray-100 text-gray-600 border-gray-300",
          icon: <RefreshCw size={12} className="text-gray-500 shrink-0" />,
          label: "Refunded",
        };
      default:
        return {
          bg: "bg-gray-50 text-gray-700 border-gray-200",
          icon: <CheckCircle2 size={12} className="text-gray-400 shrink-0" />,
          label: status,
        };
    }
  };

  const style = getStyle();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${style.bg}`}
    >
      {style.icon}
      <span>
        {style.label}
        {showAmount && amount !== undefined && ` (₹${amount})`}
      </span>
    </span>
  );
};
