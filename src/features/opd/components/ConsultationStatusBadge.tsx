import React from "react";
import type { ConsultationStatus } from "../types/consultation";

const PP = "'Poppins', system-ui, sans-serif";

const STATUS_CONFIG: Record<
  ConsultationStatus | string,
  { bg: string; text: string; dot: string; border: string }
> = {
  Waiting: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
    border: "border-amber-200",
  },
  Called: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    dot: "bg-indigo-600",
    border: "border-indigo-200",
  },
  "In Progress": {
    bg: "bg-teal-50",
    text: "text-[#009688]",
    dot: "bg-[#009688]",
    border: "border-teal-200",
  },
  Completed: {
    bg: "bg-green-50",
    text: "text-[#66BB6A]",
    dot: "bg-[#66BB6A]",
    border: "border-green-200",
  },
  "Follow-up Scheduled": {
    bg: "bg-blue-50",
    text: "text-[#0D47A1]",
    dot: "bg-[#0D47A1]",
    border: "border-blue-200",
  },
  Cancelled: {
    bg: "bg-red-50",
    text: "text-[#EF4444]",
    dot: "bg-[#EF4444]",
    border: "border-red-200",
  },
};

interface ConsultationStatusBadgeProps {
  status: ConsultationStatus | string;
}

export const ConsultationStatusBadge: React.FC<
  ConsultationStatusBadgeProps
> = ({ status }) => {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG["Waiting"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}
      style={{ fontFamily: PP }}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${c.dot} ${status === "In Progress" ? "animate-pulse" : ""}`}
      />
      {status}
    </span>
  );
};

export default ConsultationStatusBadge;
