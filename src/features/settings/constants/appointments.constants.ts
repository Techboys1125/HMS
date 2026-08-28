export interface Holiday {
  id: string;
  name: string;
  date: string;
  type: string;
}

export const DEFAULT_HOLIDAYS: Holiday[] = [
  {
    id: "1",
    name: "New Year Day",
    date: "2026-01-01",
    type: "Hospital Closed",
  },
  {
    id: "2",
    name: "National Independence Day",
    date: "2026-07-04",
    type: "Hospital Closed",
  },
  {
    id: "3",
    name: "Labor Day",
    date: "2026-09-07",
    type: "Special Working Hours",
  },
  {
    id: "4",
    name: "Christmas Day",
    date: "2026-12-25",
    type: "Emergency OPD Only",
  },
];

export interface AppointmentStatus {
  id: string;
  label: string;
  color: string;
  visible: boolean;
}

export const DEFAULT_STATUSES: AppointmentStatus[] = [
  { id: "s1", label: "Scheduled", color: "#0D47A1", visible: true },
  { id: "s2", label: "Checked In", color: "#009688", visible: true },
  { id: "s3", label: "Waiting", color: "#F59E0B", visible: true },
  { id: "s4", label: "In Consultation", color: "#9C27B0", visible: true },
  { id: "s5", label: "Completed", color: "#66BB6A", visible: true },
  { id: "s6", label: "Cancelled", color: "#EF4444", visible: true },
  { id: "s7", label: "No Show", color: "#64748B", visible: true },
];

export const PREVIEW_TIME_SLOTS: string[] = [
  "08:00 AM",
  "08:15 AM",
  "08:30 AM",
  "08:45 AM",
  "09:00 AM",
  "09:15 AM",
  "09:30 AM",
  "09:45 AM",
  "10:00 AM",
  "10:15 AM",
  "10:30 AM",
  "10:45 AM",
  "11:00 AM",
  "11:15 AM",
  "11:30 AM",
  "11:45 AM",
];
