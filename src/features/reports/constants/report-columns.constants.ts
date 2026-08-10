import type { TableColumn } from "../components/ReportTable";

export const APPOINTMENT_REPORT_COLUMNS: TableColumn[] = [
  { key: "id", label: "Appointment ID", sortable: true },
  { key: "patientName", label: "Patient Name", sortable: true },
  { key: "mrn", label: "MRN", sortable: true },
  { key: "doctorName", label: "Doctor", sortable: true },
  { key: "department", label: "Department", sortable: true },
  { key: "appointmentDate", label: "Date", sortable: true },
  { key: "appointmentTime", label: "Time", sortable: true },
  { key: "visitType", label: "Visit Type" },
  { key: "status", label: "Status" },
];

export const REVENUE_REPORT_COLUMNS: TableColumn[] = [
  { key: "id", label: "Invoice ID", sortable: true },
  { key: "patientName", label: "Patient", sortable: true },
  { key: "mrn", label: "MRN" },
  { key: "doctorName", label: "Doctor", sortable: true },
  { key: "department", label: "Department" },
  { key: "invoiceDate", label: "Date", sortable: true },
  { key: "invoiceAmount", label: "Amount", sortable: true, render: (v) => `$${Number(v).toLocaleString()}` },
  { key: "collectedAmount", label: "Collected", render: (v) => `$${Number(v).toLocaleString()}` },
  { key: "outstandingAmount", label: "Outstanding", render: (v) => `$${Number(v).toLocaleString()}` },
  { key: "paymentMethod", label: "Method" },
  { key: "paymentStatus", label: "Status" },
];

export const PATIENT_REPORT_COLUMNS: TableColumn[] = [
  { key: "mrn", label: "MRN", sortable: true },
  { key: "patientName", label: "Patient Name", sortable: true },
  { key: "age", label: "Age", sortable: true },
  { key: "gender", label: "Gender" },
  { key: "mobile", label: "Mobile" },
  { key: "department", label: "Department", sortable: true },
  { key: "doctorName", label: "Doctor", sortable: true },
  { key: "registrationDate", label: "Registered", sortable: true },
  { key: "lastVisit", label: "Last Visit", sortable: true },
  { key: "visitType", label: "Visit Type" },
  { key: "status", label: "Status" },
];

export const DOCTOR_REPORT_COLUMNS: TableColumn[] = [
  { key: "doctorId", label: "Doctor ID", sortable: true },
  { key: "doctorName", label: "Doctor Name", sortable: true },
  { key: "department", label: "Department", sortable: true },
  { key: "appointments", label: "Appointments", sortable: true },
  { key: "completed", label: "Completed", sortable: true },
  { key: "pending", label: "Pending", sortable: true },
  { key: "cancelled", label: "Cancelled", sortable: true },
  { key: "followup", label: "Follow-up", sortable: true },
  { key: "avgTimeMinutes", label: "Avg Time", render: (v) => `${v} min` },
  { key: "patientRating", label: "Rating", render: (v) => `⭐ ${v}` },
];

export const BILLING_REPORT_COLUMNS: TableColumn[] = [
  { key: "invoiceId", label: "Invoice ID", sortable: true },
  { key: "patientName", label: "Patient", sortable: true },
  { key: "mrn", label: "MRN" },
  { key: "doctorName", label: "Doctor", sortable: true },
  { key: "department", label: "Department" },
  { key: "invoiceDate", label: "Date", sortable: true },
  { key: "invoiceAmount", label: "Amount", sortable: true, render: (v) => `$${Number(v).toLocaleString()}` },
  { key: "collectedAmount", label: "Collected", render: (v) => `$${Number(v).toLocaleString()}` },
  { key: "outstandingAmount", label: "Outstanding", render: (v) => `$${Number(v).toLocaleString()}` },
  { key: "paymentMethod", label: "Method" },
  { key: "paymentStatus", label: "Status" },
];

export const KPI_REVENUE_COLUMNS: TableColumn[] = [
  { key: "invoiceId", label: "Invoice ID", sortable: true },
  { key: "patientName", label: "Patient", sortable: true },
  { key: "mrn", label: "MRN" },
  { key: "doctorName", label: "Doctor", sortable: true },
  { key: "department", label: "Department" },
  { key: "invoiceDate", label: "Date", sortable: true },
  { key: "paymentMethod", label: "Method" },
  { key: "invoiceAmount", label: "Amount", render: (v) => `$${Number(v).toLocaleString()}` },
  { key: "collectedAmount", label: "Collected", render: (v) => `$${Number(v).toLocaleString()}` },
  { key: "invoiceStatus", label: "Status" },
];

export const KPI_APPOINTMENT_COLUMNS: TableColumn[] = [
  { key: "appointmentId", label: "Appointment ID", sortable: true },
  { key: "patientName", label: "Patient", sortable: true },
  { key: "mrn", label: "MRN" },
  { key: "doctorName", label: "Doctor", sortable: true },
  { key: "department", label: "Department" },
  { key: "visitType", label: "Visit Type" },
  { key: "appointmentTime", label: "Time" },
  { key: "tokenNumber", label: "Token" },
  { key: "appointmentStatus", label: "Status" },
];

export const KPI_PATIENT_COLUMNS: TableColumn[] = [
  { key: "patientId", label: "Patient ID", sortable: true },
  { key: "patientName", label: "Patient", sortable: true },
  { key: "mrn", label: "MRN" },
  { key: "gender", label: "Gender" },
  { key: "age", label: "Age", sortable: true },
  { key: "registrationDate", label: "Registered", sortable: true },
  { key: "registeredBy", label: "Registered By" },
  { key: "visitType", label: "Visit Type" },
];

export const KPI_CONSULTATION_COLUMNS: TableColumn[] = [
  { key: "consultationId", label: "Consultation ID", sortable: true },
  { key: "patientName", label: "Patient", sortable: true },
  { key: "doctorName", label: "Doctor", sortable: true },
  { key: "department", label: "Department" },
  { key: "consultationTime", label: "Time" },
  { key: "durationMinutes", label: "Duration", render: (v) => `${v} min` },
  { key: "status", label: "Status" },
];

export const KPI_PENDING_PAYMENT_COLUMNS: TableColumn[] = [
  { key: "invoiceId", label: "Invoice ID", sortable: true },
  { key: "patientName", label: "Patient", sortable: true },
  { key: "doctorName", label: "Doctor", sortable: true },
  { key: "department", label: "Department" },
  { key: "pendingAmount", label: "Pending Amount", render: (v) => `$${Number(v).toLocaleString()}` },
  { key: "dueDate", label: "Due Date", sortable: true },
  { key: "status", label: "Status" },
];
