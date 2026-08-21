import React from "react";
import type { ConsultationStatus } from "../types/consultation";
import { appointmentStatusMap } from "../types/consultation";

const PP = "'Poppins', system-ui, sans-serif";

const STATUS_CONFIG: Record<
  ConsultationStatus | string,
  { bg: string; text: string; dot: string; border: string }
> = {
  BOOKED: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    dot: "bg-slate-500",
    border: "border-slate-300",
  },
  WAITING: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
    border: "border-amber-200",
  },
  WAITING_FOR_VITALS: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-500",
    border: "border-orange-200",
  },
  WAITING_FOR_DOCTOR: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    dot: "bg-sky-500",
    border: "border-sky-200",
  },
  WAITING_FOR_DOCTOR_CALL: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    dot: "bg-sky-500",
    border: "border-sky-200",
  },
  CALLED: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    dot: "bg-violet-500",
    border: "border-violet-200",
  },
  IN_CONSULTATION: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
    border: "border-blue-200",
  },
  COMPLETED: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    border: "border-emerald-200",
  },
  CONSULTATION_COMPLETED: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    border: "border-emerald-200",
  },
  FINALIZED: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    border: "border-emerald-200",
  },
  READY_FOR_BILLING: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    border: "border-emerald-200",
  },
  BILLING_PENDING: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
    border: "border-amber-200",
  },
  CANCELLED: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-500",
    border: "border-rose-200",
  },
  NO_SHOW: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    dot: "bg-gray-400",
    border: "border-gray-300",
  },
  FOLLOW_UP_SCHEDULED: {
    bg: "bg-fuchsia-50",
    text: "text-fuchsia-700",
    dot: "bg-fuchsia-500",
    border: "border-fuchsia-200",
  },
};

export interface StatusChipProps {
  status: ConsultationStatus | string;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG["WAITING_FOR_VITALS"];
  const label = appointmentStatusMap[status as ConsultationStatus] || status;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}
      style={{ fontFamily: PP }}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${c.dot} ${status === "IN_CONSULTATION" ? "animate-pulse" : ""}`}
      />
      {label}
    </span>
  );
};

export const ConsultationStatusBadge = StatusChip;

export default StatusChip;
