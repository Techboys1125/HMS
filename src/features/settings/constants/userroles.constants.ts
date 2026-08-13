export interface RoleItem {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  modules: string[];
  permissionLevel:
    | "Full Access"
    | "High Access"
    | "Medium Access"
    | "Limited Access"
    | "Self Service";
  status: "Active" | "Inactive";
  lastUpdated: string;
  isSystem: boolean;
  defaultDashboard: string;
  createdDate: string;
}

export interface RolePermission {
  view: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean;
}

export type PermissionState = Record<
  string,
  Record<string, RolePermission>
>;

export interface ModuleAccessRule {
  module: string;
  allowed: string[];
  blocked: string[];
  summary: string;
}

export const ROLES: RoleItem[] = [
  {
    id: "r1",
    name: "Super Admin",
    description:
      "Master system controller with unrestricted access across all hospital nodes & server configs.",
    usersCount: 3,
    modules: [
      "Dashboard",
      "Patients",
      "Doctors",
      "Appointments",
      "Consultation",
      "Billing",
      "Reports",
      "Audit Logs",
      "Notifications",
      "Settings",
      "My Profile",
    ],
    permissionLevel: "Full Access",
    status: "Active",
    lastUpdated: "Today, 08:30 AM",
    isSystem: true,
    defaultDashboard: "Super Admin Dashboard",
    createdDate: "01 Jan 2020",
  },
  {
    id: "r2",
    name: "Hospital Admin",
    description:
      "Full administrative control over hospital operations, staff assignments, and configurations.",
    usersCount: 8,
    modules: [
      "Dashboard",
      "Patients",
      "Doctors",
      "Appointments",
      "Consultation",
      "Billing",
      "Reports",
      "Audit Logs",
      "Notifications",
      "Settings",
      "My Profile",
    ],
    permissionLevel: "Full Access",
    status: "Active",
    lastUpdated: "Yesterday, 14:20",
    isSystem: true,
    defaultDashboard: "Hospital Admin Dashboard",
    createdDate: "15 Jan 2020",
  },
  {
    id: "r3",
    name: "Doctor (Physician / Specialist)",
    description:
      "Access clinical modules, OPD consultations, e-prescriptions, and patient medical histories.",
    usersCount: 145,
    modules: [
      "Dashboard",
      "Appointments",
      "Consultation",
      "Prescriptions",
      "Reports",
      "Notifications",
      "My Profile",
    ],
    permissionLevel: "High Access",
    status: "Active",
    lastUpdated: "2 days ago",
    isSystem: true,
    defaultDashboard: "Doctor Clinical Dashboard",
    createdDate: "15 Jan 2020",
  },
  {
    id: "r4",
    name: "Receptionist (Front Desk)",
    description:
      "Manage patient registration, check-ins, queue management, and initial bill collection.",
    usersCount: 24,
    modules: [
      "Dashboard",
      "Patients",
      "Appointments",
      "Reception Queue",
      "Billing (Collect)",
      "Notifications",
      "My Profile",
    ],
    permissionLevel: "Medium Access",
    status: "Active",
    lastUpdated: "3 days ago",
    isSystem: true,
    defaultDashboard: "Reception Dashboard",
    createdDate: "20 Feb 2020",
  },
  {
    id: "r5",
    name: "Accountant / Billing Admin",
    description:
      "Manage financial ledgers, invoice generation, payment processing, tax rates, and revenue reports.",
    usersCount: 12,
    modules: [
      "Dashboard",
      "Billing",
      "Payments",
      "Financial Reports",
      "Notifications",
      "My Profile",
    ],
    permissionLevel: "High Access",
    status: "Active",
    lastUpdated: "Yesterday, 11:00",
    isSystem: true,
    defaultDashboard: "Accountant Dashboard",
    createdDate: "01 Mar 2020",
  },
  {
    id: "r6",
    name: "Nurse (Patient Care)",
    description:
      "Record patient vitals, triage OPD queue, manage bed allocations, and assist consultations.",
    usersCount: 68,
    modules: [
      "Dashboard",
      "Appointments",
      "Consultation (Assisting)",
      "Vitals Record",
      "Notifications",
      "My Profile",
    ],
    permissionLevel: "Medium Access",
    status: "Active",
    lastUpdated: "5 days ago",
    isSystem: true,
    defaultDashboard: "Nurse Dashboard",
    createdDate: "10 Mar 2020",
  },
  {
    id: "r7",
    name: "Patient Portal User",
    description:
      "Access personal health records, prescription downloads, appointment bookings, and my bills.",
    usersCount: 14820,
    modules: [
      "Dashboard",
      "My Appointments",
      "My Prescriptions",
      "My Bills",
      "Notifications",
      "My Profile",
    ],
    permissionLevel: "Self Service",
    status: "Active",
    lastUpdated: "Continuous",
    isSystem: true,
    defaultDashboard: "Patient Personal Portal",
    createdDate: "01 Apr 2020",
  },
];

export const MATRIX_MODULES = [
  "Dashboard",
  "Patients",
  "Doctors",
  "Appointments",
  "Consultation",
  "Billing",
  "Reports",
  "Audit Logs",
  "Notifications",
  "Settings",
  "My Profile",
];

export const MATRIX_ROLES = [
  "Hospital Admin",
  "Doctor",
  "Receptionist",
  "Accountant",
  "Nurse",
  "Patient Portal",
];

export const INITIAL_PERMISSIONS: PermissionState = {
  "Hospital Admin": {
    Dashboard: { view: true, edit: true, delete: true, approve: true },
    Patients: { view: true, edit: true, delete: true, approve: true },
    Doctors: { view: true, edit: true, delete: true, approve: true },
    Appointments: { view: true, edit: true, delete: true, approve: true },
    Consultation: { view: true, edit: true, delete: true, approve: true },
    Billing: { view: true, edit: true, delete: true, approve: true },
    Reports: { view: true, edit: true, delete: true, approve: true },
    "Audit Logs": { view: true, edit: false, delete: false, approve: true },
    Notifications: { view: true, edit: true, delete: true, approve: true },
    Settings: { view: true, edit: true, delete: true, approve: true },
    "My Profile": { view: true, edit: true, delete: false, approve: true },
  },
  Doctor: {
    Dashboard: { view: true, edit: false, delete: false, approve: false },
    Patients: { view: true, edit: true, delete: false, approve: true },
    Doctors: { view: true, edit: false, delete: false, approve: false },
    Appointments: { view: true, edit: true, delete: false, approve: true },
    Consultation: { view: true, edit: true, delete: false, approve: true },
    Billing: { view: false, edit: false, delete: false, approve: false },
    Reports: { view: true, edit: false, delete: false, approve: false },
    "Audit Logs": { view: false, edit: false, delete: false, approve: false },
    Notifications: { view: true, edit: false, delete: false, approve: false },
    Settings: { view: false, edit: false, delete: false, approve: false },
    "My Profile": { view: true, edit: true, delete: false, approve: false },
  },
  Receptionist: {
    Dashboard: { view: true, edit: false, delete: false, approve: false },
    Patients: { view: true, edit: true, delete: false, approve: false },
    Doctors: { view: true, edit: false, delete: false, approve: false },
    Appointments: { view: true, edit: true, delete: true, approve: true },
    Consultation: { view: false, edit: false, delete: false, approve: false },
    Billing: { view: true, edit: true, delete: false, approve: false },
    Reports: { view: false, edit: false, delete: false, approve: false },
    "Audit Logs": { view: false, edit: false, delete: false, approve: false },
    Notifications: { view: true, edit: false, delete: false, approve: false },
    Settings: { view: false, edit: false, delete: false, approve: false },
    "My Profile": { view: true, edit: true, delete: false, approve: false },
  },
  Accountant: {
    Dashboard: { view: true, edit: false, delete: false, approve: false },
    Patients: { view: true, edit: false, delete: false, approve: false },
    Doctors: { view: false, edit: false, delete: false, approve: false },
    Appointments: { view: false, edit: false, delete: false, approve: false },
    Consultation: { view: false, edit: false, delete: false, approve: false },
    Billing: { view: true, edit: true, delete: true, approve: true },
    Reports: { view: true, edit: true, delete: false, approve: true },
    "Audit Logs": { view: false, edit: false, delete: false, approve: false },
    Notifications: { view: true, edit: false, delete: false, approve: false },
    Settings: { view: false, edit: false, delete: false, approve: false },
    "My Profile": { view: true, edit: true, delete: false, approve: false },
  },
  Nurse: {
    Dashboard: { view: true, edit: false, delete: false, approve: false },
    Patients: { view: true, edit: true, delete: false, approve: false },
    Doctors: { view: true, edit: false, delete: false, approve: false },
    Appointments: { view: true, edit: false, delete: false, approve: false },
    Consultation: { view: true, edit: true, delete: false, approve: false },
    Billing: { view: false, edit: false, delete: false, approve: false },
    Reports: { view: false, edit: false, delete: false, approve: false },
    "Audit Logs": { view: false, edit: false, delete: false, approve: false },
    Notifications: { view: true, edit: false, delete: false, approve: false },
    Settings: { view: false, edit: false, delete: false, approve: false },
    "My Profile": { view: true, edit: true, delete: false, approve: false },
  },
  "Patient Portal": {
    Dashboard: { view: true, edit: false, delete: false, approve: false },
    Patients: { view: false, edit: false, delete: false, approve: false },
    Doctors: { view: true, edit: false, delete: false, approve: false },
    Appointments: { view: true, edit: true, delete: true, approve: false },
    Consultation: { view: false, edit: false, delete: false, approve: false },
    Billing: { view: true, edit: false, delete: false, approve: false },
    Reports: { view: false, edit: false, delete: false, approve: false },
    "Audit Logs": { view: false, edit: false, delete: false, approve: false },
    Notifications: { view: true, edit: false, delete: false, approve: false },
    Settings: { view: false, edit: false, delete: false, approve: false },
    "My Profile": { view: true, edit: true, delete: false, approve: false },
  },
};

export const MODULE_ACCESS_OVERVIEW: ModuleAccessRule[] = [
  {
    module: "Billing & Financials",
    allowed: ["Hospital Admin", "Accountant", "Receptionist (Collect Only)"],
    blocked: ["Doctor", "Nurse", "Patient Portal"],
    summary: "Strict financial ledger controls & invoice creation",
  },
  {
    module: "Clinical Consultations",
    allowed: ["Hospital Admin", "Doctor", "Nurse (Assisting)"],
    blocked: ["Accountant", "Receptionist", "Patient Portal"],
    summary: "HIPAA protected EMR & e-prescription entry",
  },
  {
    module: "Audit Logs & Governance",
    allowed: ["Super Admin", "Hospital Admin"],
    blocked: ["Doctor", "Nurse", "Accountant", "Receptionist"],
    summary: "Immutable system access activity tracking",
  },
  {
    module: "Patient Personal Portal",
    allowed: ["Patient Portal User", "Hospital Admin"],
    blocked: ["Other External Roles"],
    summary: "Personal health record view & appointment booking",
  },
];
