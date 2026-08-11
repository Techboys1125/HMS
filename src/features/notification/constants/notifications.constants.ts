import type {
  UserRole,
  QuickFilterItem,
  CommunicationChannel,
  RolePreferenceMatrix,
  ReminderConfig,
  CommRule,
} from "../types/notifications.types";
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
  Mail,
  Smartphone,
} from "lucide-react";

export const PP = "Poppins, sans-serif";
export const RB = "Roboto, sans-serif";

export const ROLE_QUICK_FILTERS: Record<UserRole, QuickFilterItem[]> = {
  "Hospital Admin": [
    { id: "All", title: "All", icon: Bell },
    { id: "Unread", title: "Unread", icon: Info },
    { id: "Patients", title: "Patients", icon: Users },
    { id: "Doctors", title: "Doctors", icon: UserCheck },
    { id: "Appointments", title: "Appointments", icon: Calendar },
    { id: "Billing", title: "Billing", icon: CreditCard },
    { id: "Reports", title: "Reports", icon: FileText },
    { id: "Audit", title: "Audit", icon: Shield },
    { id: "System", title: "System", icon: Settings },
    { id: "Security", title: "Security", icon: AlertTriangle },
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

// ─── Communication Workspace Configuration Defaults ──────────────────────────

export const DEFAULT_CHANNELS: CommunicationChannel[] = [
  {
    id: "c1",
    name: "In-App Notifications",
    desc: "Real-time bell alerts & toast popups inside HMS workspace",
    enabled: true,
    isDefault: true,
    icon: Bell,
  },
  {
    id: "c2",
    name: "Email Notifications",
    desc: "HTML formatted transactional emails for appointments and billing alerts",
    enabled: true,
    isDefault: false,
    icon: Mail,
  },
  {
    id: "c3",
    name: "SMS Notifications",
    desc: "Instant SMS text messages via Twilio/SMS Gateway",
    enabled: true,
    isDefault: false,
    icon: MessageSquare,
  },
  {
    id: "c4",
    name: "Push Notifications",
    desc: "Mobile app push alerts to iOS/Android patient & doctor apps",
    enabled: true,
    isDefault: false,
    icon: Smartphone,
  },
];

export const DEFAULT_ROLE_PREFERENCES: RolePreferenceMatrix = {
  "Hospital Admin": {
    inApp: true,
    email: true,
    sms: true,
    push: true,
    critical: true,
    appointment: true,
    billing: true,
    system: true,
  },
  Doctor: {
    inApp: true,
    email: true,
    sms: false,
    push: true,
    critical: true,
    appointment: true,
    billing: false,
    system: true,
  },
  Receptionist: {
    inApp: true,
    email: false,
    sms: false,
    push: false,
    critical: true,
    appointment: true,
    billing: true,
    system: true,
  },
  Accountant: {
    inApp: true,
    email: true,
    sms: false,
    push: false,
    critical: true,
    appointment: false,
    billing: true,
    system: true,
  },
  Nurse: {
    inApp: true,
    email: false,
    sms: false,
    push: true,
    critical: true,
    appointment: true,
    billing: false,
    system: true,
  },
  "Patient Portal": {
    inApp: true,
    email: true,
    sms: true,
    push: true,
    critical: true,
    appointment: true,
    billing: true,
    system: false,
  },
};

export const DEFAULT_REMINDER_CONFIG: ReminderConfig = {
  appointmentReminderTime: "24 Hours Before",
  billingReminderTime: "3 Days",
  followupReminderTime: "1 Week",
  enableAutoReminders: true,
};

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

export const DELIVERY_ANALYTICS = [
  { channel: "In-App Bell", rate: 99.9, color: "#0D47A1" },
  { channel: "Email Notifications", rate: 99.5, color: "#009688" },
  { channel: "SMS Gateway", rate: 98.8, color: "#F59E0B" },
  { channel: "Mobile Push", rate: 97.4, color: "#EF4444" },
];

export const LIFECYCLE_STEPS = [
  { step: "1. Appt Booked", sub: "SMS & Email Sent" },
  { step: "2. 24h Reminder", sub: "Push Alert" },
  { step: "3. Check-In", sub: "Queue Token" },
  { step: "4. Consult Done", sub: "Rx Ready Alert" },
  { step: "5. Invoice Created", sub: "Email Receipt" },
  { step: "6. Payment Done", sub: "Final Confirmation" },
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
