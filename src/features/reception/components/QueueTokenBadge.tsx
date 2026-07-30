import React from "react";
import type { QueueStatus } from "../types/reception.types";
import { Clock, UserCheck, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface QueueTokenBadgeProps {
  status: QueueStatus;
  tokenNumber?: string;
  size?: "sm" | "md" | "lg";
}

export const QueueTokenBadge: React.FC<QueueTokenBadgeProps> = ({
  status,
  tokenNumber,
  size = "md",
}) => {
  const getBadgeStyle = () => {
    switch (status) {
      case "WAITING":
      case "CHECKED_IN":
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <Clock size={12} className="text-amber-500 shrink-0" />,
          label: "Waiting",
        };
      case "IN_CONSULTATION":
        return {
          bg: "bg-blue-50 text-[#0D47A1] border-blue-200 animate-pulse",
          icon: <UserCheck size={12} className="text-[#0D47A1] shrink-0" />,
          label: "In Consultation",
        };
      case "COMPLETED":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />,
          label: "Completed",
        };
      case "CANCELLED":
        return {
          bg: "bg-rose-50 text-rose-700 border-rose-200",
          icon: <XCircle size={12} className="text-rose-500 shrink-0" />,
          label: "Cancelled",
        };
      case "NO_SHOW":
        return {
          bg: "bg-slate-100 text-slate-600 border-slate-300",
          icon: <AlertTriangle size={12} className="text-slate-400 shrink-0" />,
          label: "No Show",
        };
      default:
        return {
          bg: "bg-gray-100 text-gray-700 border-gray-200",
          icon: <Clock size={12} className="text-gray-500 shrink-0" />,
          label: status,
        };
    }
  };

  const style = getBadgeStyle();
  const paddingClass = size === "sm" ? "px-2 py-0.5 text-[10px]" : size === "lg" ? "px-3.5 py-1.5 text-xs" : "px-2.5 py-1 text-[11px]";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold border rounded-full ${style.bg} ${paddingClass}`}
    >
      {style.icon}
      <span>{tokenNumber ? `${tokenNumber} (${style.label})` : style.label}</span>
    </span>
  );
};
