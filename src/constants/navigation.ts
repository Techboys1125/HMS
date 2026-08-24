import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  FileText,
  Pill,
  CreditCard,
  Building2,
  LogIn,
  UserCheck,
  BarChart2,
  Activity,
  ClipboardList,
  Receipt,
  MessageSquare,
  User,
} from "lucide-react";
import type { Role, NavGroup } from "../types/app.types";

export const PP = "'Poppins', system-ui, sans-serif";
export const RB = "'Roboto', system-ui, sans-serif";

export const ROLE_LABEL: Record<Role, string> = {
  "super-admin": "Super Admin",
  admin: "Hospital Admin",
  doctor: "Doctor",
  nurse: "Nurse",
  receptionist: "Receptionist",
  accountant: "Accountant",
  patient: "Patient",
};

export const ROLE_NAV_GROUPS: Record<Role, NavGroup[]> = {
  "super-admin": [
    {
      id: "operations",
      label: "Operations",
      items: [
        { id: "dashboard", Icon: LayoutDashboard, label: "Dashboard" },
        { id: "patients", Icon: Users, label: "Patients" },
        { id: "doctors", Icon: UserCheck, label: "Doctors" },
        { id: "appointments", Icon: Calendar, label: "Appointments" },
        { id: "reception", Icon: LogIn, label: "Reception" },
        { id: "opd", Icon: Stethoscope, label: "OPD" },
      ],
    },
    {
      id: "finance",
      label: "Finance",
      items: [{ id: "billing", Icon: CreditCard, label: "Billing" }],
    },
    {
      id: "reports",
      label: "Reports",
      items: [{ id: "reports", Icon: BarChart2, label: "Reports" }],
    },
    {
      id: "administration",
      label: "Administration",
      items: [
        {
          id: "hospital-management",
          Icon: Building2,
          label: "Hospital Management",
        },
        { id: "user-management", Icon: Users, label: "User & Role Management" },
        { id: "audit-logs", Icon: FileText, label: "Audit Logs" },
      ],
    },
  ],
  admin: [
    {
      id: "operations",
      label: "Operations",
      items: [
        { id: "dashboard", Icon: LayoutDashboard, label: "Dashboard" },
        { id: "patients", Icon: Users, label: "Patients" },
        { id: "doctors", Icon: UserCheck, label: "Doctors" },
        { id: "appointments", Icon: Calendar, label: "Appointments" },

        {
          id: "consultation",
          Icon: Stethoscope,
          label: "OPD Consultation Management",
        },
      ],
    },
    {
      id: "finance",
      label: "Finance",
      items: [{ id: "billing", Icon: CreditCard, label: "Billing" }],
    },
    {
      id: "reports",
      label: "Reports",
      items: [{ id: "reports", Icon: BarChart2, label: "Reports" }],
    },
    {
      id: "administration",
      label: "Administration",
      items: [
        { id: "user-management", Icon: Users, label: "User & Role Management" },
        { id: "audit-logs", Icon: FileText, label: "Audit Logs" },
      ],
    },
  ],
  doctor: [
    {
      id: "clinical",
      label: "Clinical",
      items: [
        { id: "dashboard", Icon: LayoutDashboard, label: "Dashboard" },
        { id: "patients", Icon: Users, label: "Patients" },
        { id: "appointments", Icon: Calendar, label: "Appointments" },
        { id: "consultation", Icon: MessageSquare, label: "Consultation" },
        {
          id: "medical-history",
          Icon: ClipboardList,
          label: "Medical Records",
        },
      ],
    },
    {
      id: "reports",
      label: "Reports",
      items: [{ id: "reports", Icon: BarChart2, label: "Reports" }],
    },
    {
      id: "account",
      label: "Account",
      items: [{ id: "profile", Icon: User, label: "My Profile" }],
    },
  ],
  nurse: [
    {
      id: "patient-care",
      label: "Patient Care",
      items: [
        { id: "dashboard", Icon: LayoutDashboard, label: "Dashboard" },
        { id: "appointments", Icon: Calendar, label: "Appointments" },
        { id: "doctors", Icon: UserCheck, label: "Doctors" },
        { id: "consultation", Icon: Stethoscope, label: "OPD Consultation" },
        { id: "vitals", Icon: Activity, label: "Vitals" },
      ],
    },
    {
      id: "account",
      label: "Account",
      items: [{ id: "profile", Icon: User, label: "My Profile" }],
    },
  ],
  receptionist: [
    {
      id: "front-desk",
      label: "Front Desk",
      items: [
        { id: "dashboard", Icon: LayoutDashboard, label: "Dashboard" },
        { id: "patients", Icon: Users, label: "Patients" },
        { id: "doctors", Icon: UserCheck, label: "Doctors" },
        { id: "appointments", Icon: Calendar, label: "Appointments" },

        { id: "billing", Icon: CreditCard, label: "Billing" },
        { id: "reports", Icon: BarChart2, label: "Reports" },
      ],
    },
    {
      id: "account",
      label: "Account",
      items: [{ id: "profile", Icon: User, label: "My Profile" }],
    },
  ],
  accountant: [
    {
      id: "finance",
      label: "Finance",
      items: [
        { id: "dashboard", Icon: LayoutDashboard, label: "Dashboard" },
        { id: "billing", Icon: CreditCard, label: "Billing" },
        { id: "doctors", Icon: UserCheck, label: "Doctors" },
        { id: "reports", Icon: BarChart2, label: "Reports" },
      ],
    },
    {
      id: "account",
      label: "Account",
      items: [{ id: "profile", Icon: User, label: "My Profile" }],
    },
  ],
  patient: [
    {
      id: "my-health",
      label: "My Health",
      items: [
        { id: "dashboard", Icon: LayoutDashboard, label: "Dashboard" },
        { id: "family-members", Icon: Users, label: "Family Members" },
        { id: "appointments", Icon: Calendar, label: "Appointments" },
        { id: "prescriptions", Icon: Pill, label: "Prescriptions" },
        { id: "bills-payments", Icon: Receipt, label: "Billing & Payments" },
        { id: "profile", Icon: User, label: "Profile" },
      ],
    },
  ],
};
