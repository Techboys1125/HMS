import { PP, STATUS_CONFIG } from "../constants/appointment.constants";

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
