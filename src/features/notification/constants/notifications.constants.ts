import type { UserRole, QuickFilterItem, CommRule } from "../types/notifications.types";
import {
  Bell,
  Info,
  Calendar,
  Users,
  UserCheck,
  CreditCard,
  FileText,
  Settings,
  AlertTriangle,
  MessageSquare,
  Pill,
  Clock,
  Activity,
  Shield,
  Receipt,
  DollarSign,
  Megaphone,
} from "lucide-react";

export const PP = "Poppins, sans-serif";
export const RB = "Roboto, sans-serif";

export const ROLE_QUICK_FILTERS: Record<UserRole, QuickFilterItem[]> = {
  "Hospital Admin": [
    { id: "All", title: "All Roles", icon: Bell },
    { id: "Unread", title: "Unread", icon: Info },
    { id: "Appointments", title: "Appointments", icon: Calendar },
    { id: "Patients", title: "Patients", icon: Users },
    { id: "Doctors", title: "Doctors", icon: UserCheck },
    { id: "Queue", title: "Queue", icon: Clock },
    { id: "Vitals", title: "Vitals", icon: Activity },
    { id: "Consultations", title: "Consultations", icon: MessageSquare },
    { id: "Prescriptions", title: "Prescriptions", icon: Pill },
    { id: "Billing", title: "Billing", icon: CreditCard },
    { id: "Invoices", title: "Invoices", icon: Receipt },
    { id: "Payments", title: "Payments", icon: DollarSign },
    { id: "Reports", title: "Reports", icon: FileText },
    { id: "Audit", title: "Audit", icon: Shield },
    { id: "System", title: "System", icon: Settings },
    { id: "Security", title: "Security", icon: AlertTriangle },
    { id: "Announcements", title: "Announcements", icon: Megaphone },
  ],
  Doctor: [
    { id: "All", title: "All", icon: Bell },
    { id: "Unread", title: "Unread", icon: Info },
    { id: "Appointments", title: "Appointments", icon: Calendar },
    { id: "Patients", title: "Patients", icon: Users },
    { id: "Consultations", title: "Consultations", icon: MessageSquare },
    { id: "Prescriptions", title: "Prescriptions", icon: Pill },
    { id: "Schedule", title: "Schedule", icon: Clock },
  ],
  Receptionist: [
    { id: "All", title: "All", icon: Bell },
    { id: "Unread", title: "Unread", icon: Info },
    { id: "Appointments", title: "Appointments", icon: Calendar },
    { id: "Patients", title: "Patients", icon: Users },
    { id: "Registration", title: "Registration", icon: UserCheck },
    { id: "Queue", title: "Queue", icon: Clock },
    { id: "Billing", title: "Billing", icon: CreditCard },
  ],
  Accountant: [
    { id: "All", title: "All", icon: Bell },
    { id: "Unread", title: "Unread", icon: Info },
    { id: "Billing", title: "Billing", icon: CreditCard },
    { id: "Payments", title: "Payments", icon: DollarSign },
    { id: "Revenue", title: "Revenue", icon: FileText },
    { id: "Invoices", title: "Invoices", icon: Receipt },
    { id: "Reports", title: "Reports", icon: FileText },
  ],
  Nurse: [
    { id: "All", title: "All", icon: Bell },
    { id: "Unread", title: "Unread", icon: Info },
    { id: "Appointments", title: "Appointments", icon: Calendar },
    { id: "Patients", title: "Patients", icon: Users },
    { id: "Vitals", title: "Vitals", icon: Activity },
    { id: "Clinical Alerts", title: "Clinical Alerts", icon: AlertTriangle },
  ],
  "Patient Portal": [
    { id: "All", title: "All", icon: Bell },
    { id: "Unread", title: "Unread", icon: Info },
    { id: "Appointments", title: "Appointments", icon: Calendar },
    { id: "Prescriptions", title: "Prescriptions", icon: Pill },
    { id: "Invoices", title: "Invoices", icon: Receipt },
    { id: "Announcements", title: "Announcements", icon: Megaphone },
  ],
};

export const ALL_ROLES: UserRole[] = [
  "Hospital Admin",
  "Doctor",
  "Receptionist",
  "Accountant",
  "Nurse",
  "Patient Portal",
];

export const DEFAULT_COMM_RULES: CommRule[] = [
  {
    label: "Send Appointment Confirmation Automatically",
    sub: "Triggers immediately upon booking confirmation",
    key: "autoApptConfirmation",
  },
  {
    label: "Send Invoice Immediately After Payment",
    sub: "Dispatches PDF invoice receipt via email & SMS",
    key: "instantInvoiceAfterPay",
  },
  {
    label: "Send Prescription Notification",
    sub: "Alerts patient as soon as doctor signs e-prescription",
    key: "prescriptionNotif",
  },
  {
    label: "Send System Maintenance Alerts",
    sub: "Broadcasts scheduled downtime alerts to all staff",
    key: "systemMaintenanceAlerts",
  },
  {
    label: "Send Critical Security & Audit Alerts",
    sub: "Dispatches emergency SMS alerts to Super Admin",
    key: "criticalSecurityAlerts",
  },
];

export const PREFERENCE_COLUMNS: { key: string; label: string }[] = [
  { key: "inApp", label: "In-App" },
  { key: "email", label: "Email" },
  { key: "sms", label: "SMS" },
  { key: "push", label: "Push" },
  { key: "critical", label: "Critical Alerts" },
  { key: "appointment", label: "Appt Alerts" },
  { key: "billing", label: "Billing Alerts" },
  { key: "system", label: "System Alerts" },
];
