import type { AppStatus } from "../types/app.types";

export const STATUS_CONFIG: Record<
  string,
  { bg: string; text: string; dot: string; label: string }
> = {
  scheduled: {
    bg: "bg-slate-50",
    text: "text-slate-600",
    dot: "bg-slate-400",
    label: "Scheduled",
  },
  "checked-in": {
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
    label: "Checked In",
  },
  waiting: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
    label: "Waiting",
  },
  "in-progress": {
    bg: "bg-teal-50",
    text: "text-teal-700",
    dot: "bg-teal-500",
    label: "In Progress",
  },
  completed: {
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-500",
    label: "Completed",
  },
  cancelled: {
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-400",
    label: "Cancelled",
  },
};
