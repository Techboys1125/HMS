import type { FilterConfig } from "../components/ReportFilters";

export const APPOINTMENT_REPORT_FILTERS: FilterConfig[] = [
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Completed", value: "Completed" },
      { label: "Scheduled", value: "Scheduled" },
      { label: "Waiting", value: "Waiting" },
      { label: "Cancelled", value: "Cancelled" },
      { label: "No Show", value: "No Show" },
    ],
  },
  {
    key: "visitType",
    label: "Visit Type",
    type: "select",
    options: [
      { label: "New Visit", value: "New Visit" },
      { label: "Follow-up", value: "Follow-up" },
      { label: "Walk-in", value: "Walk-in" },
      { label: "Emergency", value: "Emergency" },
    ],
  },
  { key: "department", label: "Department", type: "select", options: [
    { label: "Cardiology", value: "Cardiology" },
    { label: "Neurology", value: "Neurology" },
    { label: "General Medicine", value: "General Medicine" },
    { label: "Orthopedics", value: "Orthopedics" },
    { label: "Gynecology", value: "Gynecology" },
  ]},
  { key: "doctor", label: "Doctor", type: "text", placeholder: "Search doctor..." },
  { key: "dateFrom", label: "From Date", type: "date" },
  { key: "dateTo", label: "To Date", type: "date" },
];

export const REVENUE_REPORT_FILTERS: FilterConfig[] = [
  {
    key: "paymentStatus",
    label: "Payment Status",
    type: "select",
    options: [
      { label: "Paid", value: "Paid" },
      { label: "Partially Paid", value: "Partially Paid" },
      { label: "Pending", value: "Pending" },
      { label: "Cancelled", value: "Cancelled" },
    ],
  },
  {
    key: "paymentMethod",
    label: "Payment Method",
    type: "select",
    options: [
      { label: "Cash", value: "Cash" },
      { label: "Card", value: "Card" },
      { label: "UPI", value: "UPI" },
      { label: "Bank Transfer", value: "Bank Transfer" },
    ],
  },
  { key: "department", label: "Department", type: "select", options: [
    { label: "Cardiology", value: "Cardiology" },
    { label: "Neurology", value: "Neurology" },
    { label: "General Medicine", value: "General Medicine" },
    { label: "Orthopedics", value: "Orthopedics" },
    { label: "Gynecology", value: "Gynecology" },
  ]},
  { key: "doctor", label: "Doctor", type: "text", placeholder: "Search doctor..." },
  { key: "dateFrom", label: "From Date", type: "date" },
  { key: "dateTo", label: "To Date", type: "date" },
];

export const PATIENT_REPORT_FILTERS: FilterConfig[] = [
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "Active" },
      { label: "Completed", value: "Completed" },
      { label: "Pending Follow-up", value: "Pending Follow-up" },
    ],
  },
  {
    key: "visitType",
    label: "Visit Type",
    type: "select",
    options: [
      { label: "New Visit", value: "New Visit" },
      { label: "Follow-up", value: "Follow-up" },
      { label: "Walk-in", value: "Walk-in" },
      { label: "Emergency", value: "Emergency" },
    ],
  },
  {
    key: "gender",
    label: "Gender",
    type: "select",
    options: [
      { label: "Male", value: "Male" },
      { label: "Female", value: "Female" },
      { label: "Other", value: "Other" },
    ],
  },
  { key: "department", label: "Department", type: "select", options: [
    { label: "Cardiology", value: "Cardiology" },
    { label: "Neurology", value: "Neurology" },
    { label: "General Medicine", value: "General Medicine" },
    { label: "Orthopedics", value: "Orthopedics" },
    { label: "Gynecology", value: "Gynecology" },
  ]},
  { key: "doctor", label: "Doctor", type: "text", placeholder: "Search doctor..." },
  { key: "dateFrom", label: "From Date", type: "date" },
  { key: "dateTo", label: "To Date", type: "date" },
];

export const DOCTOR_REPORT_FILTERS: FilterConfig[] = [
  { key: "department", label: "Department", type: "select", options: [
    { label: "Cardiology", value: "Cardiology" },
    { label: "Neurology", value: "Neurology" },
    { label: "General Medicine", value: "General Medicine" },
    { label: "Orthopedics", value: "Orthopedics" },
    { label: "Pediatrics", value: "Pediatrics" },
    { label: "ENT", value: "ENT" },
  ]},
  { key: "doctor", label: "Doctor", type: "text", placeholder: "Search doctor..." },
  { key: "dateFrom", label: "From Date", type: "date" },
  { key: "dateTo", label: "To Date", type: "date" },
];

export const BILLING_REPORT_FILTERS: FilterConfig[] = [
  {
    key: "paymentStatus",
    label: "Payment Status",
    type: "select",
    options: [
      { label: "Paid", value: "Paid" },
      { label: "Pending", value: "Pending" },
      { label: "Partially Paid", value: "Partially Paid" },
      { label: "Cancelled", value: "Cancelled" },
    ],
  },
  {
    key: "paymentMethod",
    label: "Payment Method",
    type: "select",
    options: [
      { label: "Cash", value: "Cash" },
      { label: "Card", value: "Card" },
      { label: "UPI", value: "UPI" },
      { label: "Bank Transfer", value: "Bank Transfer" },
    ],
  },
  { key: "department", label: "Department", type: "select", options: [
    { label: "Cardiology", value: "Cardiology" },
    { label: "Neurology", value: "Neurology" },
    { label: "General Medicine", value: "General Medicine" },
    { label: "Orthopedics", value: "Orthopedics" },
    { label: "Pediatrics", value: "Pediatrics" },
  ]},
  { key: "doctor", label: "Doctor", type: "text", placeholder: "Search doctor..." },
  { key: "dateFrom", label: "From Date", type: "date" },
  { key: "dateTo", label: "To Date", type: "date" },
];
