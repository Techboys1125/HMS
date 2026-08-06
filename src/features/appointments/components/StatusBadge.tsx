import { PP } from "../constants/appointment.constants";

type AppointmentStatus =
  | "Booked"
  | "Scheduled"
  | "Checked-In"
  | "Waiting"
  | "Waiting for Vitals"
  | "Waiting for Doctor"
  | "Called"
  | "In Consultation"
  | "In Progress"
  | "Completed"
  | "Cancelled";

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { bg: string; text: string; dot: string; border: string }
> = {
  Booked: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    dot: "bg-slate-400",
    border: "border-slate-200",
  },
  Scheduled: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    dot: "bg-slate-400",
    border: "border-slate-200",
  },
  "Checked-In": {
    bg: "bg-blue-50",
    text: "text-[#0D47A1]",
    dot: "bg-[#0D47A1]",
    border: "border-blue-200",
  },
  Waiting: {
    bg: "bg-amber-50",
    text: "text-[#F59E0B]",
    dot: "bg-[#F59E0B]",
    border: "border-amber-200",
  },
  "Waiting for Vitals": {
    bg: "bg-blue-50",
    text: "text-[#0D47A1]",
    dot: "bg-[#0D47A1]",
    border: "border-blue-200",
  },
  "Waiting for Doctor": {
    bg: "bg-amber-50",
    text: "text-[#F59E0B]",
    dot: "bg-[#F59E0B]",
    border: "border-amber-200",
  },
  Called: {
    bg: "bg-purple-50",
    text: "text-[#7C3AED]",
    dot: "bg-[#7C3AED]",
    border: "border-purple-200",
  },
  "In Consultation": {
    bg: "bg-teal-50",
    text: "text-[#009688]",
    dot: "bg-[#009688]",
    border: "border-teal-200",
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
  Cancelled: {
    bg: "bg-red-50",
    text: "text-[#EF4444]",
    dot: "bg-[#EF4444]",
    border: "border-red-200",
  },
};

export function StatusBadge({
  status,
}: {
  status: AppointmentStatus | string;
}) {
  const c =
    STATUS_CONFIG[status as AppointmentStatus] || STATUS_CONFIG["Booked"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}
      style={{ fontFamily: PP }}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}
