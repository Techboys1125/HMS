import { useState, useEffect } from "react";
import safeHandsLogo from "./assets/safehandshospital_logo.webp";
import { LoginPage, useAuthStore } from "./features/auth/index";
import {
  PatientProfileScreen,
  EditPatientScreen,
  MedicalHistoryScreen,
  PatientVisitHistoryScreen,
  PatientSearchScreen,
  PatientTimelineScreen,
  PatientAppointmentsScreen,
  PatientMedicalRecordsScreen,
  PatientPrescriptionsScreen,
  PatientPrescriptionDetailsScreen,
  PatientProfileCenterScreen,
  RegisterPatientScreen,
  ReceptionPatientProfileScreen,
  FamilyMembersManagement,
  type FamilyMember,
} from "./features/patients";
import { patientsApi } from "./features/patients/api/patient.api";
import { UserManagementCenterScreen } from "./features/users";
import { DoctorManagementCenterScreen } from "./features/doctors";
import {
  AppointmentManagementCenterScreen,
  BookAppointmentScreen,
  QueueManagementScreen,
} from "./features/appointments";
import {
  DoctorAppointmentsScreen,
  DoctorPrescriptionsScreen,
  DoctorPrescriptionDetailsScreen,
  DoctorEditPrescriptionScreen,
  DoctorPrescriptionPrintPreviewScreen,
  DoctorPrescriptionHistoryScreen,
} from "./features/doctors";
import {
  OpdConsultationCenterScreen,
  StartOpdConsultationWorkspaceScreen,
  ConsultationDetailsScreen,
  EditConsultationScreen,
  ConsultationHistoryScreen,
  OpdConsultationMonitoringCenterScreen,
  AdminConsultationDetailsScreen,
} from "./features/opd";
import { RecordPatientVitalsScreen } from "./features/vitals";
import {
  BillingDashboardScreen,
  CreateInvoiceWorkspaceScreen,
  CollectPaymentWorkspaceScreen,
  InvoiceDetailsScreen,
  InvoicePrintPreviewScreen,
  PaymentHistoryScreen,
  DailyBillingReportScreen,
  ReceptionistPaymentCollectionScreen,
  PatientMyBillsScreen,
} from "./BillingManagement";
import {
  ReportsDashboardScreen,
  DailyAppointmentReportScreen,
  DailyRevenueReportScreen,
  PatientReportScreen,
  DoctorReportScreen,
  BillingReportScreen,
  DashboardKpiDetailScreen,
  DoctorReportsDashboardScreen,
  DoctorDailyAppointmentReportScreen,
  DoctorPatientReportScreen,
  DoctorDoctorReportScreen,
  DoctorDashboardKpiDetailScreen,
  ReceptionistReportsDashboardScreen,
  ReceptionistDailyAppointmentReportScreen,
  ReceptionistPatientReportScreen,
  ReceptionistDashboardKpiDetailScreen,
  AccountantReportsDashboardScreen,
  AccountantDailyRevenueReportScreen,
  AccountantBillingReportScreen,
  AccountantDashboardKpiDetailScreen,
} from "./ReportsManagement";
import AuditLogsManagementScreen from "./AuditLogsManagement";
import { NotificationCenterManagement } from "./NotificationCenterManagement";
import { MyProfileManagement } from "./MyProfileManagement";
import { SettingsWorkspace } from "./SettingsWorkspace";
import {
  SuperAdminDashboard,
  HospitalAdminDashboard,
  DoctorDashboard,
  ReceptionDashboard,
  NurseDashboard,
  AccountantDashboard,
  PatientDashboard,
} from "./features/dashboard";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  FileText,
  Pill,
  CreditCard,
  Settings,
  Bell,
  Search,
  Receipt,
  Clock,
  Activity,
  ChevronRight,
  User,
  Check,
  Building2,
  ChevronDown,
  LogOut,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Zap,
  Download,
  UserCheck,
  LogIn,
  BarChart2,
  DollarSign,
  MessageSquare,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

// ─── Types ─────────────────────────────────────────────────────────────────
type NavId =
  | "dashboard"
  | "patients"
  | "doctors"
  | "appointments"
  | "checkin"
  | "consultation"
  | "vitals"
  | "prescriptions"
  | "billing"
  | "payments"
  | "payment-history"
  | "daily-billing-report"
  | "operational-reports"
  | "financial-reports"
  | "audit-logs"
  | "notifications"
  | "settings"
  | "profile"
  | "hospital-management"
  | "user-management"
  | "roles-permissions"
  | "medical-history"
  | "visit-history"
  | "patient-timeline"
  | "patient-search"
  | "bills-payments"
  | "reports"
  | "family-members"
  | "reception"
  | "opd";
type Role =
  | "super-admin"
  | "admin"
  | "doctor"
  | "nurse"
  | "receptionist"
  | "accountant"
  | "patient";
type AppStatus =
  | "scheduled"
  | "checked-in"
  | "in-progress"
  | "waiting"
  | "completed"
  | "cancelled";
type ReportView =
  | "dashboard"
  | "daily-appointments"
  | "daily-revenue"
  | "patient-report"
  | "doctor-report"
  | "billing-report"
  | "kpi-detail";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

const ROLE_LABEL: Record<Role, string> = {
  "super-admin": "Super Admin",
  admin: "Hospital Admin",
  doctor: "Doctor",
  nurse: "Nurse",
  receptionist: "Receptionist",
  accountant: "Accountant",
  patient: "Patient",
};

// ─── Data ──────────────────────────────────────────────────────────────────
const TREND_PATIENTS = [
  { v: 98 },
  { v: 115 },
  { v: 108 },
  { v: 132 },
  { v: 119 },
  { v: 138 },
  { v: 142 },
];
const TREND_QUEUE = [
  { v: 22 },
  { v: 19 },
  { v: 24 },
  { v: 16 },
  { v: 21 },
  { v: 14 },
  { v: 18 },
];
const TREND_REVENUE = [
  { v: 18 },
  { v: 21 },
  { v: 19 },
  { v: 24 },
  { v: 22 },
  { v: 23 },
  { v: 24.8 },
];
const TREND_DOCTORS = [
  { v: 14 },
  { v: 16 },
  { v: 15 },
  { v: 17 },
  { v: 16 },
  { v: 18 },
  { v: 18 },
];

const APPOINTMENTS = [
  {
    id: 1,
    time: "09:00",
    patient: "Sarah Mitchell",
    age: 34,
    gender: "F",
    complaint: "Chest Pain",
    doctor: "Dr. A. Mehta",
    status: "waiting" as AppStatus,
    priority: "high",
    mrn: "MRN-001",
  },
  {
    id: 2,
    time: "09:30",
    patient: "James Thornton",
    age: 67,
    gender: "M",
    complaint: "Diabetes Follow-up",
    doctor: "Dr. P. Sharma",
    status: "in-progress" as AppStatus,
    priority: "normal",
    mrn: "MRN-002",
  },
  {
    id: 3,
    time: "10:00",
    patient: "Emma Reyes",
    age: 28,
    gender: "F",
    complaint: "Prenatal Visit",
    doctor: "Dr. S. Patel",
    status: "checked-in" as AppStatus,
    priority: "normal",
    mrn: "MRN-003",
  },
  {
    id: 4,
    time: "10:30",
    patient: "Robert Chen",
    age: 52,
    gender: "M",
    complaint: "Cardiology Review",
    doctor: "Dr. A. Mehta",
    status: "scheduled" as AppStatus,
    priority: "normal",
    mrn: "MRN-004",
  },
  {
    id: 5,
    time: "11:00",
    patient: "Aisha Kumar",
    age: 41,
    gender: "F",
    complaint: "Migraine",
    doctor: "Dr. R. Kapoor",
    status: "scheduled" as AppStatus,
    priority: "normal",
    mrn: "MRN-005",
  },
  {
    id: 6,
    time: "11:30",
    patient: "David Walsh",
    age: 38,
    gender: "M",
    complaint: "Back Pain",
    doctor: "Dr. P. Sharma",
    status: "scheduled" as AppStatus,
    priority: "low",
    mrn: "MRN-006",
  },
  {
    id: 7,
    time: "14:00",
    patient: "Lily Anderson",
    age: 55,
    gender: "F",
    complaint: "Thyroid Review",
    doctor: "Dr. S. Patel",
    status: "scheduled" as AppStatus,
    priority: "normal",
    mrn: "MRN-007",
  },
  {
    id: 8,
    time: "14:30",
    patient: "Marcus Brown",
    age: 71,
    gender: "M",
    complaint: "Hypertension F/U",
    doctor: "Dr. A. Mehta",
    status: "scheduled" as AppStatus,
    priority: "normal",
    mrn: "MRN-008",
  },
  {
    id: 9,
    time: "15:00",
    patient: "Nina Patel",
    age: 29,
    gender: "F",
    complaint: "Skin Allergy",
    doctor: "Dr. R. Kapoor",
    status: "completed" as AppStatus,
    priority: "low",
    mrn: "MRN-009",
  },
  {
    id: 10,
    time: "15:30",
    patient: "Carlos Mendez",
    age: 63,
    gender: "M",
    complaint: "Joint Pain",
    doctor: "Dr. P. Sharma",
    status: "completed" as AppStatus,
    priority: "normal",
    mrn: "MRN-010",
  },
];

const DEPARTMENTS = [
  {
    name: "OPD — General",
    capacity: 87,
    active: 22,
    total: 25,
    color: "#0D47A1",
  },
  { name: "Cardiology", capacity: 68, active: 17, total: 25, color: "#EF4444" },
  { name: "Pediatrics", capacity: 43, active: 9, total: 21, color: "#009688" },
  { name: "Gynecology", capacity: 70, active: 14, total: 20, color: "#9C27B0" },
  { name: "Neurology", capacity: 55, active: 11, total: 20, color: "#F59E0B" },
];

const JOURNEY_STEPS = [
  { step: "Registration", count: 12, done: false },
  { step: "Appointment", count: 142, done: false },
  { step: "Check-In", count: 89, done: false },
  { step: "Vitals", count: 34, done: false },
  { step: "Consultation", count: 28, done: false },
  { step: "Prescription", count: 21, done: false },
  { step: "Billing", count: 15, done: false },
  { step: "Completed", count: 48, done: true },
];

type NavItem = {
  id: NavId;
  Icon: React.ElementType;
  label: string;
  badge?: number;
};
type NavGroup = { id: string; label: string; items: NavItem[] };

const ROLE_NAV_GROUPS: Record<Role, NavGroup[]> = {
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
        { id: "appointments", Icon: Calendar, label: "Appointments" },
        { id: "consultation", Icon: MessageSquare, label: "Consultation" },
        { id: "prescriptions", Icon: Pill, label: "Prescriptions" },
      ],
    },
    {
      id: "reports",
      label: "Reports",
      items: [{ id: "reports", Icon: BarChart2, label: "Reports" }],
    },
  ],
  nurse: [
    {
      id: "patient-care",
      label: "Patient Care",
      items: [
        { id: "dashboard", Icon: LayoutDashboard, label: "Dashboard" },
        { id: "appointments", Icon: Calendar, label: "Appointments" },
        { id: "consultation", Icon: Stethoscope, label: "OPD Consultation" },
        { id: "vitals", Icon: Activity, label: "Vitals" },
      ],
    },
  ],
  receptionist: [
    {
      id: "front-desk",
      label: "Front Desk",
      items: [
        { id: "dashboard", Icon: LayoutDashboard, label: "Dashboard" },
        { id: "patients", Icon: Users, label: "Patients" },
        { id: "appointments", Icon: Calendar, label: "Appointments" },
        { id: "billing", Icon: CreditCard, label: "Billing" },
        { id: "reports", Icon: BarChart2, label: "Reports" },
      ],
    },
  ],
  accountant: [
    {
      id: "finance",
      label: "Finance",
      items: [
        { id: "dashboard", Icon: LayoutDashboard, label: "Dashboard" },
        { id: "billing", Icon: CreditCard, label: "Billing" },
        { id: "reports", Icon: BarChart2, label: "Reports" },
      ],
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
        {
          id: "medical-history",
          Icon: ClipboardList,
          label: "Medical Records",
        },
        { id: "prescriptions", Icon: Pill, label: "Prescriptions" },
        { id: "bills-payments", Icon: Receipt, label: "Billing & Payments" },
      ],
    },
  ],
};

const ALL_NAV_ITEMS: NavItem[] = Object.values(ROLE_NAV_GROUPS)
  .flatMap((groups) => groups.flatMap((g) => g.items))
  .filter((item, i, arr) => arr.findIndex((x) => x.id === item.id) === i);

// ─── Shared UI Components ──────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  AppStatus,
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

function StatusBadge({ status }: { status: AppStatus }) {
  const c = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function Avatar({
  name,
  size = "sm",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const colors = [
    "bg-[#0D47A1]",
    "bg-[#009688]",
    "bg-violet-600",
    "bg-rose-500",
    "bg-amber-600",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  const sizes = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base",
  };
  return (
    <div
      className={`${sizes[size]} ${color} rounded-full flex items-center justify-center text-white font-semibold shrink-0`}
    >
      {initials}
    </div>
  );
}

function Sparkline({
  data,
  color = "#0D47A1",
  gradId,
}: {
  data: { v: number }[];
  color?: string;
  gradId: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={44}>
      <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.18} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#${gradId})`}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── NavRail ───────────────────────────────────────────────────────────────
function NavRail({
  active,
  onSelect,
  role,
  theme = "light",
  onThemeToggle,
}: {
  active: NavId;
  onSelect: (id: NavId) => void;
  role: Role;
  theme?: "light" | "dark";
  onThemeToggle?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const dk = theme === "dark";

  const bg = dk ? "#0F172A" : "#FFFFFF";
  const border = dk ? "#1E293B" : "#E5E7EB";
  const textSec = dk ? "#94A3B8" : "#64748B";
  const groupLbl = dk ? "#475569" : "#94A3B8";
  const hoverBg = dk ? "rgba(255,255,255,0.06)" : "#F8FAFC";
  const hoverText = dk ? "#F1F5F9" : "#111827";
  const activeBg = "#0D47A1";
  const activeText = "#FFFFFF";
  const divider = dk ? "#1E293B" : "#E5E7EB";
  const rolePill = dk ? "rgba(13,71,161,0.35)" : "rgba(219,234,254,0.9)";
  const roleTxt = dk ? "#93C5FD" : "#0D47A1";
  const themeBtnBg = dk ? "rgba(255,255,255,0.08)" : "#F1F5F9";

  return (
    <nav
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className="relative flex flex-col shrink-0 z-20 overflow-hidden"
      style={{
        width: expanded ? 260 : 72,
        transition: "width 240ms cubic-bezier(0.4,0,0.2,1)",
        background: bg,
        borderRight: `1px solid ${border}`,
      }}
    >
      <div
        className="shrink-0 overflow-hidden"
        style={{
          padding: expanded ? "14px 16px" : "14px 12px",
          minHeight: 64,
          borderBottom: `1px solid ${border}`,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="w-full">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{
              background: rolePill,
              justifyContent: expanded ? "flex-start" : "center",
            }}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0 animate-pulse"
              style={{ background: roleTxt }}
            />
            <span
              className="text-xs font-semibold whitespace-nowrap overflow-hidden transition-all duration-200"
              style={{
                fontFamily: PP,
                color: roleTxt,
                opacity: expanded ? 1 : 0,
                width: expanded ? "auto" : 0,
              }}
            >
              {ROLE_LABEL[role]}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-3 px-2">
        {ROLE_NAV_GROUPS[role].map((group, gi) => (
          <div key={group.id} className={gi > 0 ? "mt-1" : ""}>
            <div
              className="overflow-hidden"
              style={{
                maxHeight: expanded ? 28 : 0,
                opacity: expanded ? 1 : 0,
                transition: "max-height 200ms ease, opacity 160ms",
              }}
            >
              <div className="px-3 pt-2 pb-1.5">
                <span
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ fontFamily: PP, color: groupLbl }}
                >
                  {group.label}
                </span>
              </div>
            </div>

            {group.items.map(({ id, Icon, label, badge }) => {
              const isActive = active === id;
              return (
                <button
                  key={id}
                  onClick={() => onSelect(id)}
                  title={!expanded ? label : undefined}
                  className="relative flex items-center rounded-xl w-full transition-all duration-150 mb-0.5 group/navitem"
                  style={{
                    gap: expanded ? 10 : 0,
                    padding: expanded ? "9px 12px" : "9px 0",
                    justifyContent: expanded ? "flex-start" : "center",
                    background: isActive ? activeBg : "transparent",
                    color: isActive ? activeText : textSec,
                    boxShadow: isActive
                      ? "0 1px 4px rgba(13,71,161,0.25)"
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        hoverBg;
                      (e.currentTarget as HTMLButtonElement).style.color =
                        hoverText;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "transparent";
                      (e.currentTarget as HTMLButtonElement).style.color =
                        textSec;
                    }
                  }}
                >
                  {isActive && !expanded && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-r-full" />
                  )}

                  <div className="relative shrink-0 flex items-center justify-center w-8 h-8">
                    <Icon size={18} />
                    {!!badge && !expanded && (
                      <span
                        className="absolute top-0 right-0 w-[14px] h-[14px] bg-[#EF4444] text-white text-[8px] font-bold rounded-full flex items-center justify-center leading-none"
                        style={{ fontFamily: PP }}
                      >
                        {badge}
                      </span>
                    )}
                  </div>

                  {expanded && (
                    <span
                      className="text-[13px] font-medium whitespace-nowrap flex-1 text-left truncate"
                      style={{ fontFamily: RB }}
                    >
                      {label}
                    </span>
                  )}

                  {!!badge && expanded && (
                    <span
                      className="shrink-0 min-w-[18px] h-[18px] bg-[#EF4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none"
                      style={{ fontFamily: PP }}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}

            {gi < ROLE_NAV_GROUPS[role].length - 1 && (
              <div
                className="my-2 mx-1"
                style={{ borderBottom: `1px solid ${divider}` }}
              />
            )}
          </div>
        ))}
      </div>

      <div
        className="shrink-0 p-3"
        style={{ borderTop: `1px solid ${border}` }}
      >
        <button
          onClick={onThemeToggle}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-colors text-left"
          style={{
            background: themeBtnBg,
            color: textSec,
            fontFamily: RB,
            fontSize: 11,
            justifyContent: expanded ? "flex-start" : "center",
          }}
          title={dk ? "Switch to Light" : "Switch to Dark"}
        >
          {dk ? (
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
          {expanded && <span>{dk ? "Light Mode" : "Dark Mode"}</span>}
        </button>
      </div>
    </nav>
  );
}

// ─── Header ────────────────────────────────────────────────────────────────
function Header({
  role,
  onLogout,
  onNavigateNav,
  activePatient,
  familyMembers = [],
  onSwitchActivePatient,
}: {
  activeNav: NavId;
  role: Role;
  onLogout: () => void;
  onNavigateNav: (id: NavId) => void;
  activePatient?: FamilyMember;
  familyMembers?: FamilyMember[];
  onSwitchActivePatient?: (member: FamilyMember) => void;
}) {
  const user = useAuthStore((s) => s.user);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showPatientSelector, setShowPatientSelector] = useState(false);
  const currentActive =
    activePatient || (familyMembers.length > 0 ? familyMembers[0] : undefined);
  const displayName =
    role === "patient" && currentActive
      ? currentActive.patientName
      : user?.fullName || "Patient";
  const displayEmail =
    user?.email ||
    (role === "patient"
      ? "patient.portal@safehands.org"
      : "staff@safehands.org");
  const [pendingSwitchMember, setPendingSwitchMember] =
    useState<FamilyMember | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const roleLabel = ROLE_LABEL;

  const confirmSwitch = (member: FamilyMember) => {
    setIsSwitching(true);
    setTimeout(() => {
      onSwitchActivePatient?.(member);
      setIsSwitching(false);
      setPendingSwitchMember(null);
      setShowPatientSelector(false);
      setToastMsg(
        `Active patient changed successfully to ${member.patientName}`,
      );
      setTimeout(() => setToastMsg(null), 3500);
    }, 400);
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center px-5 gap-5 shrink-0 z-30 relative">
      <button
        onClick={() => onNavigateNav("dashboard")}
        className="flex items-center gap-3 text-left outline-none shrink-0 group focus:outline-none"
      >
        <img
          src={safeHandsLogo}
          alt="Safe Hands Hospital Logo"
          className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
        />
        <div className="flex flex-col">
          <span
            className="text-sm font-bold text-[#111827] leading-tight"
            style={{ fontFamily: PP }}
          >
            Safe Hands
          </span>
          <span
            className="text-[10px] text-[#64748B] hidden sm:inline"
            style={{ fontFamily: RB }}
          >
            Hospital Management
          </span>
        </div>
      </button>

      <div className="flex-1 max-w-96">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search patients, appointments, records…"
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-gray-100 rounded-lg text-slate-700 placeholder-slate-400 outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {role === "patient" && currentActive && familyMembers.length > 0 && (
          <div className="relative">
            <button
              onClick={() => {
                setShowPatientSelector((v) => !v);
                setShowProfileMenu(false);
              }}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-blue-50/70 border border-blue-200/80 hover:bg-blue-100/60 transition-all outline-none"
            >
              <div className="w-7 h-7 rounded-full bg-[#0D47A1] text-white flex items-center justify-center font-bold text-xs shrink-0">
                {currentActive.patientName[0]}
              </div>
              <div className="text-left hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-xs font-bold text-[#111827] leading-tight"
                    style={{ fontFamily: PP }}
                  >
                    {currentActive.patientName}
                  </span>
                  <span className="px-1.5 py-0.2 bg-blue-100 text-[#0D47A1] text-[9px] font-bold rounded-full">
                    {currentActive.relationship}
                  </span>
                </div>
                <div className="text-[10px] text-[#64748B] font-mono leading-tight">
                  {currentActive.mrn}
                </div>
              </div>
              <ChevronDown size={14} className="text-[#0D47A1] ml-0.5" />
            </button>

            {showPatientSelector && (
              <div className="absolute left-0 sm:right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="border-b border-[#E5E7EB] pb-2.5 mb-2 px-1">
                  <div
                    className="text-xs font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    Select Active Patient
                  </div>
                  <div
                    className="text-[11px] text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    Choose whose medical records you want to view.
                  </div>
                </div>

                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {familyMembers.map((member) => {
                    const isActive = currentActive.id === member.id;
                    const isVerified = member.verificationStatus === "Verified";

                    return (
                      <button
                        key={member.id}
                        disabled={!isVerified}
                        onClick={() => {
                          if (!isVerified) return;
                          if (isActive) {
                            setShowPatientSelector(false);
                            return;
                          }
                          setPendingSwitchMember(member);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                          isActive
                            ? "bg-blue-50/90 border-[#0D47A1] shadow-sm"
                            : isVerified
                              ? "bg-white border-[#E5E7EB] hover:bg-slate-50"
                              : "bg-slate-50 border-[#E5E7EB] opacity-60 cursor-not-allowed"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${isActive ? "bg-[#0D47A1] text-white" : "bg-slate-200 text-slate-700"}`}
                          >
                            {member.patientName[0]}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="text-xs font-bold text-[#111827] truncate"
                                style={{ fontFamily: PP }}
                              >
                                {member.patientName}
                              </span>
                              <span className="px-1.5 py-0.2 bg-slate-100 text-[#64748B] text-[9px] font-bold rounded-full">
                                {member.relationship}
                              </span>
                            </div>
                            <div className="text-[10px] text-[#64748B] font-mono truncate">
                              {member.mrn}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end shrink-0 ml-2">
                          {isActive ? (
                            <span
                              className="px-2 py-0.5 bg-[#0D47A1] text-white rounded-full text-[9px] font-bold"
                              style={{ fontFamily: PP }}
                            >
                              Currently Active
                            </span>
                          ) : isVerified ? (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-bold">
                              Verified
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[9px] font-bold">
                              Pending
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-gray-100">
          <Clock size={12} className="text-slate-400" />
          {today}
        </div>

        <button
          onClick={() => onNavigateNav("notifications")}
          className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-500 transition-colors"
          title="Notification Center"
        >
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-white" />
        </button>

        <div className="relative pl-3 border-l border-gray-100">
          <button
            onClick={() => {
              setShowProfileMenu((v) => !v);
              setShowPatientSelector(false);
            }}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-50 transition-colors outline-none"
          >
            <Avatar name={displayName} size="sm" />
            <div className="hidden xl:block text-left">
              <div
                className="text-xs font-semibold text-[#111827] leading-tight"
                style={{ fontFamily: PP }}
              >
                {displayName}
              </div>
              <div
                className="text-[10px] text-slate-400"
                style={{ fontFamily: RB }}
              >
                {roleLabel[role]}
              </div>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden xl:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-gray-200 shadow-xl shadow-slate-200/50 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-1 border border-slate-100">
                <Avatar name={displayName} size="md" />
                <div className="min-w-0 flex-1">
                  <div
                    className="text-xs font-bold text-[#111827] truncate"
                    style={{ fontFamily: PP }}
                  >
                    {displayName}
                  </div>
                  <div
                    className="text-[11px] text-[#64748B] truncate"
                    style={{ fontFamily: RB }}
                  >
                    {roleLabel[role]}
                  </div>
                  <div className="text-[10px] text-[#0D47A1] font-medium truncate mt-0.5">
                    {displayEmail}
                  </div>
                </div>
              </div>

              <div className="py-1 border-y border-slate-100 my-1 space-y-0.5">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigateNav("profile");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
                >
                  <User size={15} className="text-[#0D47A1]" />
                  <span>My Profile & Settings</span>
                </button>
                {(role === "admin" || role === "super-admin") && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigateNav("settings");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
                  >
                    <Settings size={15} className="text-slate-500" />
                    <span>System Settings</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#EF4444] hover:bg-red-50 transition-colors text-left"
              >
                <LogOut size={15} className="text-[#EF4444]" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {pendingSwitchMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold shrink-0">
                <Users size={20} />
              </div>
              <div>
                <h3
                  className="text-base font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Switch Active Patient
                </h3>
                <p
                  className="text-xs text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Select active viewing profile context
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-slate-50 border border-[#E5E7EB] rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#0D47A1] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {currentActive.patientName[0]}
                  </div>
                  <div>
                    <div
                      className="text-[11px] text-[#64748B] font-semibold"
                      style={{ fontFamily: PP }}
                    >
                      Current Profile
                    </div>
                    <div
                      className="text-xs font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      {currentActive.patientName}
                    </div>
                    <div className="text-[10px] text-[#64748B] font-mono">
                      {currentActive.mrn} · {currentActive.relationship}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50/80 border border-[#0D47A1]/30 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {pendingSwitchMember.patientName[0]}
                  </div>
                  <div>
                    <div
                      className="text-[11px] text-[#0D47A1] font-bold"
                      style={{ fontFamily: PP }}
                    >
                      New Active Profile
                    </div>
                    <div
                      className="text-xs font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      {pendingSwitchMember.patientName}
                    </div>
                    <div className="text-[10px] text-[#64748B] font-mono">
                      {pendingSwitchMember.mrn} ·{" "}
                      {pendingSwitchMember.relationship}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E5E7EB]">
              <button
                onClick={() => setPendingSwitchMember(null)}
                className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition-colors"
                style={{ fontFamily: PP }}
              >
                Cancel
              </button>
              <button
                onClick={() => confirmSwitch(pendingSwitchMember)}
                disabled={isSwitching}
                className="px-5 py-2 bg-[#0D47A1] text-white rounded-xl text-xs font-semibold hover:bg-blue-800 transition-all shadow-sm flex items-center gap-2"
                style={{ fontFamily: PP }}
              >
                {isSwitching ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Switching...</span>
                  </>
                ) : (
                  <span>Switch Patient Profile</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#111827] text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-4 duration-200">
          <Check className="w-5 h-5 text-[#66BB6A] shrink-0" />
          <span className="text-xs font-semibold" style={{ fontFamily: PP }}>
            {toastMsg}
          </span>
        </div>
      )}
    </header>
  );
}

// ─── KPI Card ──────────────────────────────────────────────────────────────
function KPICard({
  title,
  value,
  sub,
  trend,
  trendUp,
  data,
  color,
  gradId,
  icon: Icon,
}: {
  title: string;
  value: string;
  sub: string;
  trend: string;
  trendUp: boolean;
  data: { v: number }[];
  color: string;
  gradId: string;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 shadow-sm shadow-slate-50">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-slate-500 mb-1">{title}</div>
          <div className="text-2xl font-bold text-[#111827] leading-none">
            {value}
          </div>
          <div className="text-xs text-slate-400 mt-1">{sub}</div>
        </div>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: color + "18" }}
        >
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <Sparkline data={data} color={color} gradId={gradId} />
      <div
        className={`flex items-center gap-1 text-xs font-medium ${trendUp ? "text-green-600" : "text-red-500"}`}
      >
        {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {trend}
      </div>
    </div>
  );
}

// ─── Patient Journey Widget ────────────────────────────────────────────────
function PatientJourney() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm shadow-slate-50">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-sm font-semibold text-[#111827]">
            Patient Journey
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Live workflow — today
          </div>
        </div>
        <RefreshCw
          size={13}
          className="text-slate-400 cursor-pointer hover:text-slate-600 transition-colors"
        />
      </div>
      <div className="flex flex-col gap-0">
        {JOURNEY_STEPS.map((s, i) => {
          const isLast = i === JOURNEY_STEPS.length - 1;
          const isCompleted = s.done;
          const pct = Math.round((s.count / 142) * 100);
          return (
            <div key={s.step} className="flex items-stretch gap-3">
              <div className="flex flex-col items-center" style={{ width: 20 }}>
                <div
                  className={`w-4 h-4 rounded-full shrink-0 flex items-center justify-center ${isCompleted ? "bg-[#009688]" : "bg-[#0D47A1]"}`}
                >
                  {isCompleted ? (
                    <Check size={8} className="text-white" strokeWidth={3} />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                {!isLast && <div className="w-px flex-1 bg-gray-100 my-0.5" />}
              </div>
              <div className={`flex-1 pb-3 ${isLast ? "" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-[#111827]">
                    {s.step}
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-600">
                    {s.count}
                  </span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: isCompleted ? "#009688" : "#0D47A1",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Department Status ─────────────────────────────────────────────────────
function DeptStatus() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm shadow-slate-50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-semibold text-[#111827]">
            Department Occupancy
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Real-time OPD active load
          </div>
        </div>
        <span className="text-xs font-semibold text-[#0D47A1] bg-blue-50 px-2.5 py-1 rounded-full">
          5 Active
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {DEPARTMENTS.map((d) => (
          <div key={d.name}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-slate-700">{d.name}</span>
              <span className="text-slate-500 font-mono">
                {d.active}/{d.total} ({d.capacity}%)
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${d.capacity}%`, background: d.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Appointment Queue Table ───────────────────────────────────────────────
function AppointmentQueue({
  onPatientSelect,
}: {
  onPatientSelect: (id: number) => void;
}) {
  const [filter, setFilter] = useState<AppStatus | "all">("all");
  const filtered =
    filter === "all"
      ? APPOINTMENTS
      : APPOINTMENTS.filter((a) => a.status === filter);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-slate-50 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <div>
          <div className="text-sm font-semibold text-[#111827]">
            Today's Queue
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            {APPOINTMENTS.length} appointments ·{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1 border border-gray-100">
            {(
              [
                "all",
                "waiting",
                "in-progress",
                "checked-in",
                "scheduled",
                "completed",
              ] as const
            ).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${filter === s ? "bg-white text-[#0D47A1] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                {s === "all"
                  ? "All"
                  : s === "in-progress"
                    ? "Active"
                    : s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ")}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-100 text-xs text-slate-500 hover:bg-slate-50 transition-colors">
            <Download size={12} />
            Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50">
              {["Time", "Patient", "Complaint", "Doctor", "Status", ""].map(
                (h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold text-slate-400 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((apt) => (
              <tr
                key={apt.id}
                className="hover:bg-slate-50 transition-colors cursor-pointer group"
                onClick={() => onPatientSelect(apt.id)}
              >
                <td className="px-5 py-3.5">
                  <span className="font-mono text-xs font-medium text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded">
                    {apt.time}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={apt.patient} size="sm" />
                    <div>
                      <div className="text-sm font-medium text-[#111827] leading-tight">
                        {apt.patient}
                      </div>
                      <div className="text-xs text-slate-400">
                        {apt.gender}/{apt.age} · {apt.mrn}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm text-slate-600">
                    {apt.complaint}
                  </span>
                  {apt.priority === "high" && (
                    <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
                      <Zap size={8} fill="currentColor" /> URGENT
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <Avatar name={apt.doctor} size="sm" />
                    <span className="text-xs text-slate-600">{apt.doctor}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={apt.status} />
                </td>
                <td className="px-5 py-3.5">
                  <button
                    className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs text-[#0D47A1] font-medium transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPatientSelect(apt.id);
                    }}
                  >
                    View <ChevronRight size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────
function Dashboard({
  onPatientSelect,
}: {
  onPatientSelect: (id: number) => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Patients Today"
          value="142"
          sub="Total visits"
          trend="+8.3% vs yesterday"
          trendUp={true}
          data={TREND_PATIENTS}
          color="#0D47A1"
          gradId="g1"
          icon={Users}
        />
        <KPICard
          title="In Queue"
          value="18"
          sub="Waiting + active"
          trend="-18% vs avg"
          trendUp={true}
          data={TREND_QUEUE}
          color="#009688"
          gradId="g2"
          icon={Clock}
        />
        <KPICard
          title="Revenue Today"
          value="$24.8K"
          sub="Gross collected"
          trend="+12% vs yesterday"
          trendUp={true}
          data={TREND_REVENUE}
          color="#66BB6A"
          gradId="g3"
          icon={DollarSign}
        />
        <KPICard
          title="Doctors On Duty"
          value="18"
          sub="of 24 staff"
          trend="3 on leave today"
          trendUp={true}
          data={TREND_DOCTORS}
          color="#0D47A1"
          gradId="g4"
          icon={UserCheck}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <AppointmentQueue onPatientSelect={onPatientSelect} />
        </div>
        <div className="flex flex-col gap-5">
          <PatientJourney />
          <DeptStatus />
        </div>
      </div>
    </div>
  );
}

// ─── Placeholder Screen ────────────────────────────────────────────────────
function PlaceholderScreen({ nav }: { nav: NavId }) {
  const label = ALL_NAV_ITEMS.find((n) => n.id === nav)?.label ?? nav;
  const Icon = ALL_NAV_ITEMS.find((n) => n.id === nav)?.Icon ?? FileText;
  return (
    <div className="flex-1 overflow-y-auto flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <Icon size={28} className="text-slate-400" />
        </div>
        <div className="text-base font-semibold text-[#111827]">{label}</div>
        <div className="text-sm text-slate-400 mt-1">
          This module is available in the full build
        </div>
      </div>
    </div>
  );
}

function mapUserRoleToAppRole(userRole?: string | null): Role {
  if (!userRole) return "admin";
  const r = String(userRole).toUpperCase();
  if (r === "SUPER_ADMIN") return "super-admin";
  if (r === "ADMIN" || r === "HOSPITAL_ADMIN") return "admin";
  if (r === "DOCTOR") return "doctor";
  if (r === "NURSE") return "nurse";
  if (r === "RECEPTIONIST") return "receptionist";
  if (r === "ACCOUNTANT") return "accountant";
  if (r === "PATIENT") return "patient";
  return "admin";
}

// ─── HMS Shell ─────────────────────────────────────────────────────────────
function HMS({ onLogout }: { onLogout: () => void }) {
  const user = useAuthStore((s) => s.user);
  const [activeNav, setActiveNav] = useState<NavId>("dashboard");
  const [previousNav, setPreviousNav] = useState<NavId | null>(null);
  const role = user?.role ? mapUserRoleToAppRole(user.role) : "admin";
  const [selectedPatient, setSelectedPatient] = useState<
    number | string | null
  >(null);
  const [sidebarTheme, setSidebarTheme] = useState<"light" | "dark">("light");
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [activePatient, setActivePatient] = useState<FamilyMember | undefined>(
    undefined,
  );
  const [showRegisterPatient, setShowRegisterPatient] = useState(false);
  const [showEditPatient, setShowEditPatient] = useState(false);
  const [patientOnboardingDone, setPatientOnboardingDone] = useState(false);
  const [patientOnboardingLoading, setPatientOnboardingLoading] = useState(
    role === "patient",
  );

  const mapPatientToFamilyMember = (p: any, idx: number): FamilyMember => {
    const rawRel = (
      p.relationship ||
      p.relation ||
      p.relationshipType ||
      p.patientRelationship ||
      p.familyRelationship ||
      p.emergencyContact?.relationship ||
      ""
    )
      .toString()
      .trim();

    let rel: FamilyMember["relationship"] = "Other";
    const r = rawRel.toUpperCase();

    if (r === "SELF") rel = "Self";
    else if (r === "FATHER") rel = "Father";
    else if (r === "MOTHER") rel = "Mother";
    else if (r === "SPOUSE") rel = "Spouse";
    else if (r === "SON") rel = "Son";
    else if (r === "DAUGHTER") rel = "Daughter";
    else if (r === "BROTHER") rel = "Brother";
    else if (r === "SISTER") rel = "Sister";
    else if (r === "GRANDFATHER") rel = "Grandfather";
    else if (r === "GRANDMOTHER") rel = "Grandmother";
    else if (r === "GUARDIAN") rel = "Guardian";
    else if (r === "OTHER") rel = "Other";
    else if (rawRel) {
      rel = (rawRel.charAt(0).toUpperCase() +
        rawRel.slice(1).toLowerCase()) as any;
    } else {
      rel = "Other";
    }

    let bg = p.bloodGroup || "";
    if (bg) {
      bg = bg.replace("_POSITIVE", "+").replace("_NEGATIVE", "-");
    }

    let age = p.age || 0;
    const dob = p.dateOfBirth || p.dob;
    if (!age && dob) {
      const birth = new Date(dob);
      const today = new Date();
      age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      if (age < 0) age = 0;
    }

    return {
      id: p.mrn || (p.id ? String(p.id) : `FM-${idx}`),
      patientName: p.fullName || p.patientName || p.name || "Patient",
      mrn: p.mrn || "",
      relationship: rel,
      age,
      gender: (p.gender?.toUpperCase() === "MALE"
        ? "Male"
        : p.gender?.toUpperCase() === "FEMALE"
          ? "Female"
          : "Other") as "Male" | "Female" | "Other",
      bloodGroup: bg,
      registeredMobile: p.phone || p.mobileNumber || "",
      verificationStatus: "Verified" as const,
      patientStatus: "Active" as const,
      lastAppointment: "",
      upcomingAppointmentsCount: 0,
      pendingBillsCount: 0,
      pendingBillsAmount: 0,
      activePrescriptionsCount: 0,
      lastConsultationDate: "",
      primaryDoctor: "",
      latestBillId: "",
      latestBillAmount: 0,
    };
  };

  const refreshFamilyMembersFromBackend = async () => {
    try {
      const profiles = await patientsApi.getMyPatients();
      console.log("Profiles from backend:", profiles);
      if (profiles && Array.isArray(profiles)) {
        profiles.forEach((p, i) => {
          console.log(
            `[Patient ${i}] Name: ${p.fullName || p.patientName}, relationship field =>`,
            p.relationship,
            p,
          );
        });
        const mapped: FamilyMember[] = profiles.map((p, idx) =>
          mapPatientToFamilyMember(p, idx),
        );
        setFamilyMembers(mapped);
        if (mapped.length > 0 && !activePatient) {
          setActivePatient(mapped[0]);
        }
      }
    } catch (err) {
      console.warn("Failed to refresh family members from backend:", err);
    }
  };

  useEffect(() => {
    if (role !== "patient") {
      setPatientOnboardingDone(true);
      setPatientOnboardingLoading(false);
      return;
    }
    setPatientOnboardingLoading(true);
    patientsApi
      .getMyPatients()
      .then((profiles) => {
        if (profiles && profiles.length > 0) {
          const mapped: FamilyMember[] = profiles.map((p, idx) =>
            mapPatientToFamilyMember(p, idx),
          );
          setFamilyMembers(mapped);
          setActivePatient(mapped[0]);
          setActiveNav("dashboard");
          setPatientOnboardingDone(true);
        } else {
          setPatientOnboardingDone(false);
          setShowRegisterPatient(true);
          setActiveNav("patients");
        }
      })
      .catch(() => {
        setPatientOnboardingDone(false);
        setShowRegisterPatient(true);
        setActiveNav("patients");
      })
      .finally(() => setPatientOnboardingLoading(false));
  }, [role]);

  const [activeConsultationId, setActiveConsultationId] = useState<
    string | null
  >(null);
  const [viewDetailsConsultationId, setViewDetailsConsultationId] = useState<
    string | null
  >(null);
  const [editConsultationId, setEditConsultationId] = useState<string | null>(
    null,
  );
  const [showConsultationHistory, setShowConsultationHistory] = useState(false);
  const [showBookAppointmentScreen, setShowBookAppointmentScreen] =
    useState(false);
  const [showQueueManagement, setShowQueueManagement] = useState(false);

  const [viewDetailsPrescriptionId, setViewDetailsPrescriptionId] = useState<
    string | null
  >(null);
  const [editPrescriptionId, setEditPrescriptionId] = useState<string | null>(
    null,
  );
  const [printPreviewPrescriptionId, setPrintPreviewPrescriptionId] = useState<
    string | null
  >(null);
  const [historyPrescriptionUhid, setHistoryPrescriptionUhid] = useState<
    string | null
  >(null);
  const [showCreateInvoiceWorkspace, setShowCreateInvoiceWorkspace] =
    useState(false);
  const [collectPaymentInvoiceId, setCollectPaymentInvoiceId] = useState<
    string | null
  >(null);
  const [viewDetailsInvoiceId, setViewDetailsInvoiceId] = useState<
    string | null
  >(null);
  const [printPreviewInvoiceId, setPrintPreviewInvoiceId] = useState<
    string | null
  >(null);
  const [activeReportView, setActiveReportView] =
    useState<ReportView>("dashboard");

  const handleNavSelect = (id: NavId) => {
    setActiveNav(id);
    setPreviousNav(null);
    setSelectedPatient(null);
    setShowRegisterPatient(false);
    setShowEditPatient(false);
    setShowBookAppointmentScreen(false);
    setShowQueueManagement(false);
    setActiveConsultationId(null);
    setViewDetailsConsultationId(null);
    setEditConsultationId(null);
    setShowConsultationHistory(false);
    setViewDetailsPrescriptionId(null);
    setEditPrescriptionId(null);
    setPrintPreviewPrescriptionId(null);
    setHistoryPrescriptionUhid(null);
    setShowCreateInvoiceWorkspace(false);
    setCollectPaymentInvoiceId(null);
    setViewDetailsInvoiceId(null);
    setPrintPreviewInvoiceId(null);
    setActiveReportView("dashboard");
  };

  const handlePatientSelect = (id: number | string) => {
    if (activeNav !== "patients") {
      setPreviousNav(activeNav);
    }
    setSelectedPatient(id);
    setActiveNav("patients");
  };

  const showPatientWorkspace =
    selectedPatient !== null && activeNav === "patients";

  if (role === "patient" && patientOnboardingLoading) {
    return (
      <div className="flex flex-col h-screen bg-[#F1F5F9] items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#0D47A1] border-t-transparent rounded-full mb-4" />
        <p className="text-sm text-slate-600 font-medium">
          Loading your patient portal...
        </p>
      </div>
    );
  }

  if (role === "patient" && !patientOnboardingDone && showRegisterPatient) {
    return (
      <div className="flex flex-col h-screen bg-[#F1F5F9] font-sans text-[#111827] antialiased">
        <Header
          activeNav={activeNav}
          role={role}
          onLogout={onLogout}
          onNavigateNav={(nav) => setActiveNav(nav)}
          activePatient={activePatient}
          familyMembers={familyMembers}
          onSwitchActivePatient={(member) => setActivePatient(member)}
        />
        <div className="flex flex-1 overflow-y-auto">
          <RegisterPatientScreen
            registrationMode="PATIENT_SELF"
            onBack={() => {
              setShowRegisterPatient(false);
              setPatientOnboardingLoading(true);
              patientsApi
                .getMyPatients()
                .then((profiles) => {
                  if (profiles && profiles.length > 0) {
                    const mapped: FamilyMember[] = profiles.map((p, idx) =>
                      mapPatientToFamilyMember(p, idx),
                    );
                    setFamilyMembers(mapped);
                    setActivePatient(mapped[0]);
                    setActiveNav("dashboard");
                    setPatientOnboardingDone(true);
                  }
                })
                .catch(() => {})
                .finally(() => setPatientOnboardingLoading(false));
            }}
            onBookAppointment={(_mrn) => {
              setShowRegisterPatient(false);
              setPatientOnboardingLoading(true);
              patientsApi
                .getMyPatients()
                .then((profiles) => {
                  if (profiles && profiles.length > 0) {
                    const mapped: FamilyMember[] = profiles.map((p, idx) => ({
                      id: p.mrn || String(p.id) || `FM-${idx}`,
                      patientName: p.patientName || p.name || "Patient",
                      mrn: p.mrn || "",
                      relationship: (p as any).relationship || "Self",
                      age: p.age || 0,
                      gender: (p.gender?.toUpperCase() === "MALE"
                        ? "Male"
                        : p.gender?.toUpperCase() === "FEMALE"
                          ? "Female"
                          : "Other") as "Male" | "Female" | "Other",
                      bloodGroup: p.bloodGroup || "",
                      registeredMobile: p.phone || "",
                      verificationStatus: "Verified" as const,
                      patientStatus: "Active" as const,
                      lastAppointment: "",
                      upcomingAppointmentsCount: 0,
                      pendingBillsCount: 0,
                      pendingBillsAmount: 0,
                      activePrescriptionsCount: 0,
                      lastConsultationDate: "",
                      primaryDoctor: "",
                      latestBillId: "",
                      latestBillAmount: 0,
                    }));
                    setFamilyMembers(mapped);
                    setActivePatient(mapped[0]);
                    setPatientOnboardingDone(true);
                    setActiveNav("appointments");
                  }
                })
                .catch(() => {})
                .finally(() => setPatientOnboardingLoading(false));
            }}
            onViewProfile={() => {
              setShowRegisterPatient(false);
              setPatientOnboardingDone(true);
              setActiveNav("dashboard");
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#F1F5F9] font-sans text-[#111827] antialiased">
      <Header
        activeNav={activeNav}
        role={role}
        onLogout={onLogout}
        onNavigateNav={(nav) => setActiveNav(nav)}
        activePatient={activePatient}
        familyMembers={familyMembers}
        onSwitchActivePatient={(member) => setActivePatient(member)}
      />

      <div className="flex flex-1 overflow-hidden">
        <NavRail
          active={activeNav}
          onSelect={handleNavSelect}
          role={role}
          theme={sidebarTheme}
          onThemeToggle={() =>
            setSidebarTheme((t) => (t === "light" ? "dark" : "light"))
          }
        />

        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex flex-1 overflow-y-auto">
            {activeNav === "dashboard" && role === "super-admin" && (
              <SuperAdminDashboard />
            )}
            {activeNav === "dashboard" && role === "admin" && (
              <HospitalAdminDashboard
                onRegisterPatient={() => {
                  setActiveNav("patients");
                  setShowRegisterPatient(true);
                }}
                onNavigateNav={(nav) => setActiveNav(nav as NavId)}
              />
            )}
            {activeNav === "dashboard" && role === "doctor" && (
              <DoctorDashboard />
            )}
            {activeNav === "dashboard" && role === "receptionist" && (
              <ReceptionDashboard
                userRole={role}
                onNavigateNav={(nav) => setActiveNav(nav as NavId)}
                onRegisterPatient={() => {
                  setActiveNav("patients");
                  setShowRegisterPatient(true);
                }}
                onPatientSearch={() => {
                  setActiveNav("patient-search");
                }}
                onCheckInClick={() => {
                  setActiveNav("appointments");
                  setShowQueueManagement(true);
                }}
                onPatientSelect={(uhid) => handlePatientSelect(uhid)}
                onEditPatient={(uhid) => {
                  handlePatientSelect(uhid);
                  setShowEditPatient(true);
                }}
                onCreateInvoiceClick={() => {
                  setActiveNav("billing");
                  setShowCreateInvoiceWorkspace(true);
                }}
              />
            )}
            {activeNav === "dashboard" && role === "nurse" && (
              <NurseDashboard />
            )}
            {activeNav === "dashboard" && role === "accountant" && (
              <AccountantDashboard />
            )}
            {activeNav === "dashboard" && role === "patient" && (
              <PatientDashboard
                activePatient={activePatient}
                familyMembers={familyMembers}
                onSwitchPatient={(member) => setActivePatient(member)}
                onAddFamilyMember={() => {
                  setShowRegisterPatient(true);
                  setActiveNav("patients");
                }}
                onBookAppointmentClick={() => {
                  setActiveNav("appointments");
                  setShowBookAppointmentScreen(true);
                }}
                onViewBillsClick={() => setActiveNav("billing")}
                onNavigateNav={(nav) => setActiveNav(nav as NavId)}
              />
            )}
            {activeNav === "dashboard" &&
              ![
                "super-admin",
                "admin",
                "doctor",
                "receptionist",
                "nurse",
                "accountant",
                "patient",
              ].includes(role) && (
                <Dashboard onPatientSelect={handlePatientSelect} />
              )}
            {showPatientWorkspace &&
              !showEditPatient &&
              role === "receptionist" && (
                <ReceptionPatientProfileScreen
                  onBack={() => {
                    setSelectedPatient(null);
                    if (previousNav && previousNav !== "patients") {
                      setActiveNav(previousNav);
                      setPreviousNav(null);
                    }
                  }}
                  onEditPatient={() => setShowEditPatient(true)}
                  onBookAppointment={() => {
                    setActiveNav("appointments");
                    setShowBookAppointmentScreen(true);
                  }}
                  onCheckInClick={() => {
                    setActiveNav("appointments");
                    setShowQueueManagement(true);
                  }}
                  patientMrn={
                    typeof selectedPatient === "string"
                      ? selectedPatient
                      : "UHID-892101"
                  }
                  userRole={role}
                />
              )}
            {showPatientWorkspace &&
              !showEditPatient &&
              role !== "receptionist" && (
                <PatientProfileScreen
                  role={role}
                  patientMrn={
                    selectedPatient ? String(selectedPatient) : undefined
                  }
                  onBack={() => {
                    setSelectedPatient(null);
                    if (previousNav && previousNav !== "patients") {
                      setActiveNav(previousNav);
                      setPreviousNav(null);
                    } else if (role === "doctor") {
                      setActiveNav("consultation");
                    }
                  }}
                  onEdit={() => setShowEditPatient(true)}
                  onStartConsultation={() => setActiveNav("consultation")}
                  onRecordVitals={() => setActiveNav("vitals")}
                />
              )}
            {activeNav === "patients" && showEditPatient && (
              <EditPatientScreen
                patientMrn={
                  selectedPatient ? String(selectedPatient) : undefined
                }
                onBack={() => setShowEditPatient(false)}
              />
            )}
            {activeNav === "patients" &&
              !showPatientWorkspace &&
              !showRegisterPatient &&
              !showEditPatient && (
                <PatientSearchScreen
                  userRole={role}
                  onBack={() => setActiveNav("dashboard")}
                  onPatientSelect={(id) => handlePatientSelect(id)}
                  onEditPatientClick={(p) => {
                    const id = p.mrn || String(p.id);
                    setSelectedPatient(id);
                    setShowEditPatient(true);
                  }}
                  onRegisterClick={() => {
                    setShowRegisterPatient(true);
                  }}
                  onBookAppointmentClick={() => {
                    setActiveNav("appointments");
                    setShowBookAppointmentScreen(true);
                  }}
                  onCheckInClick={() => {
                    setActiveNav("appointments");
                    setShowQueueManagement(true);
                  }}
                />
              )}
            {activeNav === "patients" &&
              !showPatientWorkspace &&
              showRegisterPatient && (
                <RegisterPatientScreen
                  registrationMode={
                    role === "patient" ? "PATIENT_FAMILY" : "ADMIN"
                  }
                  onBack={() => {
                    setShowRegisterPatient(false);
                    if (role === "patient") {
                      setActiveNav("family-members");
                      refreshFamilyMembersFromBackend();
                    }
                  }}
                  onSwitchToNewPatient={() => {
                    setShowRegisterPatient(false);
                    if (role === "patient") {
                      setActiveNav("family-members");
                      refreshFamilyMembersFromBackend();
                    }
                  }}
                  onBookAppointment={() => {
                    setShowRegisterPatient(false);
                    if (role === "patient") {
                      setActiveNav("family-members");
                      refreshFamilyMembersFromBackend();
                    } else {
                      setActiveNav("appointments");
                      setShowBookAppointmentScreen(true);
                    }
                  }}
                  onViewProfile={(uhid) => {
                    setShowRegisterPatient(false);
                    if (role === "patient") {
                      setActiveNav("family-members");
                      refreshFamilyMembersFromBackend();
                    } else {
                      handlePatientSelect(uhid);
                    }
                  }}
                />
              )}
            {activeNav === "appointments" && role === "patient" && (
              <PatientAppointmentsScreen activePatient={activePatient} />
            )}
            {activeNav === "appointments" &&
              role !== "doctor" &&
              role !== "patient" &&
              showBookAppointmentScreen && (
                <BookAppointmentScreen
                  role={role}
                  initialMrn={undefined}
                  onBack={() => {
                    setShowBookAppointmentScreen(false);
                  }}
                  onConfirmSuccess={(uhid) => {
                    setShowBookAppointmentScreen(false);
                    handlePatientSelect(uhid || "UHID-892101");
                  }}
                  onRegisterNewPatientClick={() => {
                    setShowBookAppointmentScreen(false);
                    setActiveNav("patients");
                    setShowRegisterPatient(true);
                  }}
                  onViewPatientProfileClick={(uhid) =>
                    handlePatientSelect(uhid)
                  }
                />
              )}
            {activeNav === "appointments" &&
              role === "receptionist" &&
              showQueueManagement && (
                <QueueManagementScreen
                  onBack={() => setShowQueueManagement(false)}
                  onCheckInClick={() => {
                    setShowQueueManagement(true);
                  }}
                  onPatientSearchClick={() => setActiveNav("patient-search")}
                  onPatientSelect={handlePatientSelect}
                  onRegisterPatientClick={() => {
                    setActiveNav("patients");
                    setShowRegisterPatient(true);
                  }}
                  onBookAppointmentClick={() => {
                    setShowQueueManagement(false);
                    setShowBookAppointmentScreen(true);
                  }}
                />
              )}
            {activeNav === "appointments" &&
              role === "receptionist" &&
              !showBookAppointmentScreen &&
              !showQueueManagement && (
                <AppointmentManagementCenterScreen
                  onPatientSelect={handlePatientSelect}
                  onBookAppointmentClick={() =>
                    setShowBookAppointmentScreen(true)
                  }
                  onReceptionQueueClick={() => {
                    setShowQueueManagement(true);
                  }}
                  onRegisterNewPatientClick={() => {
                    setActiveNav("patients");
                    setShowRegisterPatient(true);
                  }}
                  userRole="Receptionist"
                />
              )}
            {activeNav === "appointments" &&
              role !== "doctor" &&
              role !== "patient" &&
              role !== "receptionist" &&
              !showBookAppointmentScreen && (
                <AppointmentManagementCenterScreen
                  onPatientSelect={handlePatientSelect}
                  onBookAppointmentClick={() =>
                    setShowBookAppointmentScreen(true)
                  }
                  onRegisterNewPatientClick={() => {
                    setActiveNav("patients");
                    setShowRegisterPatient(true);
                  }}
                  userRole={role === "admin" ? "Hospital Admin" : "Super Admin"}
                />
              )}
            {activeNav === "appointments" && role === "doctor" && (
              <DoctorAppointmentsScreen
                onStartConsultation={() => setActiveNav("consultation")}
              />
            )}
            {activeNav === "consultation" && showConsultationHistory && (
              <ConsultationHistoryScreen
                role={role}
                onBack={() => setShowConsultationHistory(false)}
                onPatientSelect={(id) => handlePatientSelect(id)}
                onStartNewConsultation={() => {
                  setShowConsultationHistory(false);
                  setViewDetailsConsultationId(null);
                  setEditConsultationId(null);
                  setActiveConsultationId("CNS-1001");
                }}
                onViewFullConsultation={(id) => {
                  setShowConsultationHistory(false);
                  setViewDetailsConsultationId(id);
                }}
              />
            )}
            {activeNav === "consultation" &&
              editConsultationId &&
              !showConsultationHistory && (
                <EditConsultationScreen
                  consultationId={editConsultationId}
                  onBack={() => setEditConsultationId(null)}
                  onViewHistory={() => setShowConsultationHistory(true)}
                  onUpdateSuccess={() => setEditConsultationId(null)}
                />
              )}
            {activeNav === "consultation" &&
              (role === "admin" || role === "nurse") &&
              !viewDetailsConsultationId &&
              !showConsultationHistory && (
                <OpdConsultationMonitoringCenterScreen
                  onViewDetails={(id) => setViewDetailsConsultationId(id)}
                  onViewHistory={() => setShowConsultationHistory(true)}
                  onPatientSelect={(id) => handlePatientSelect(id)}
                  onNavigateReports={() => setActiveNav("reports")}
                />
              )}
            {activeNav === "consultation" &&
              role !== "admin" &&
              role !== "nurse" &&
              !activeConsultationId &&
              !viewDetailsConsultationId &&
              !editConsultationId &&
              !showConsultationHistory && (
                <OpdConsultationCenterScreen
                  onStartConsultation={(id) =>
                    setActiveConsultationId(id || "CNS-1001")
                  }
                  onViewDetails={(id) => setViewDetailsConsultationId(id)}
                  onViewHistory={() => setShowConsultationHistory(true)}
                  onNavigateAppointments={() => setActiveNav("appointments")}
                />
              )}
            {activeNav === "consultation" &&
              viewDetailsConsultationId &&
              (role === "admin" || role === "nurse") &&
              !showConsultationHistory && (
                <AdminConsultationDetailsScreen
                  consultationId={viewDetailsConsultationId}
                  onBack={() => setViewDetailsConsultationId(null)}
                  onPatientSelect={(id) => handlePatientSelect(id)}
                  onViewHistory={() => setShowConsultationHistory(true)}
                />
              )}
            {activeNav === "consultation" &&
              viewDetailsConsultationId &&
              role !== "admin" &&
              role !== "nurse" &&
              !editConsultationId &&
              !showConsultationHistory && (
                <ConsultationDetailsScreen
                  consultationId={viewDetailsConsultationId}
                  onBack={() => setViewDetailsConsultationId(null)}
                  onViewHistory={() => setShowConsultationHistory(true)}
                  onEditConsultation={(id) => {
                    setViewDetailsConsultationId(null);
                    setEditConsultationId(id);
                  }}
                  onViewPatientProfile={(uhid) => handlePatientSelect(uhid)}
                />
              )}
            {activeNav === "consultation" &&
              activeConsultationId &&
              !viewDetailsConsultationId &&
              !editConsultationId &&
              !showConsultationHistory && (
                <StartOpdConsultationWorkspaceScreen
                  onBack={() => setActiveConsultationId(null)}
                  onViewHistory={() => setShowConsultationHistory(true)}
                  onViewPatientProfile={(uhid) =>
                    handlePatientSelect(uhid || "")
                  }
                />
              )}
            {activeNav === "prescriptions" &&
              role === "doctor" &&
              historyPrescriptionUhid && (
                <DoctorPrescriptionHistoryScreen
                  patientMrn={historyPrescriptionUhid}
                  onBack={() => setHistoryPrescriptionUhid(null)}
                  onViewPrescription={(rxId: any) => {
                    setHistoryPrescriptionUhid(null);
                    setViewDetailsPrescriptionId(
                      typeof rxId === "string" ? rxId : rxId?.id || "",
                    );
                  }}
                  onPrintPreview={(rxId: any) => {
                    setHistoryPrescriptionUhid(null);
                    setPrintPreviewPrescriptionId(
                      typeof rxId === "string" ? rxId : rxId?.id || "",
                    );
                  }}
                  onViewPatientProfile={(uhid) => {
                    setHistoryPrescriptionUhid(null);
                    handlePatientSelect(uhid);
                  }}
                />
              )}
            {activeNav === "prescriptions" &&
              role === "doctor" &&
              printPreviewPrescriptionId &&
              !historyPrescriptionUhid && (
                <DoctorPrescriptionPrintPreviewScreen
                  prescriptionId={printPreviewPrescriptionId}
                  onBack={() => setPrintPreviewPrescriptionId(null)}
                  onViewConsultation={(consultId) => {
                    setPrintPreviewPrescriptionId(null);
                    setActiveNav("consultation");
                    setViewDetailsConsultationId(String(consultId));
                  }}
                />
              )}
            {activeNav === "prescriptions" &&
              role === "doctor" &&
              editPrescriptionId &&
              !printPreviewPrescriptionId &&
              !historyPrescriptionUhid && (
                <DoctorEditPrescriptionScreen
                  prescriptionId={editPrescriptionId}
                  onBack={() => setEditPrescriptionId(null)}
                  onSaveSuccess={() => setEditPrescriptionId(null)}
                  onIssueSuccess={() => setEditPrescriptionId(null)}
                  onViewConsultation={(consultId) => {
                    setEditPrescriptionId(null);
                    setActiveNav("consultation");
                    setViewDetailsConsultationId(consultId);
                  }}
                  onViewPatientProfile={(uhid) => {
                    setEditPrescriptionId(null);
                    handlePatientSelect(uhid);
                  }}
                />
              )}
            {activeNav === "prescriptions" &&
              role === "doctor" &&
              viewDetailsPrescriptionId &&
              !editPrescriptionId &&
              !printPreviewPrescriptionId &&
              !historyPrescriptionUhid && (
                <DoctorPrescriptionDetailsScreen
                  prescriptionId={viewDetailsPrescriptionId}
                  onBack={() => setViewDetailsPrescriptionId(null)}
                  onEditPrescription={(rxId) => {
                    setViewDetailsPrescriptionId(null);
                    setEditPrescriptionId(rxId);
                  }}
                  onPrintPreview={(rxId) => {
                    setPrintPreviewPrescriptionId(rxId);
                  }}
                  onViewHistory={(uhid) => {
                    setViewDetailsPrescriptionId(null);
                    setHistoryPrescriptionUhid(uhid);
                  }}
                  onViewConsultation={(consultId) => {
                    setViewDetailsPrescriptionId(null);
                    setActiveNav("consultation");
                    setViewDetailsConsultationId(consultId);
                  }}
                  onViewPatientProfile={(uhid) => {
                    setViewDetailsPrescriptionId(null);
                    handlePatientSelect(uhid);
                  }}
                />
              )}
            {activeNav === "prescriptions" &&
              role === "doctor" &&
              !viewDetailsPrescriptionId &&
              !editPrescriptionId &&
              !printPreviewPrescriptionId &&
              !historyPrescriptionUhid && (
                <DoctorPrescriptionsScreen
                  onNewPrescription={() => {
                    setActiveNav("consultation");
                    setActiveConsultationId("CNS-1001");
                  }}
                  onViewPrescription={(rxId) => {
                    setViewDetailsPrescriptionId(rxId);
                  }}
                  onEditPrescription={(rxId) => {
                    setEditPrescriptionId(rxId);
                  }}
                  onPrintPreview={(rxId) => {
                    setPrintPreviewPrescriptionId(rxId);
                  }}
                  onViewHistory={(uhid) => {
                    setHistoryPrescriptionUhid(uhid);
                  }}
                  onViewConsultation={(consultId) => {
                    setActiveNav("consultation");
                    setViewDetailsConsultationId(consultId);
                  }}
                />
              )}
            {activeNav === "reports" &&
              role === "doctor" &&
              activeReportView === "dashboard" && (
                <DoctorReportsDashboardScreen
                  onOpenReport={(reportId) => {
                    if (reportId === "REP-001") {
                      setActiveReportView("daily-appointments");
                    } else if (reportId === "REP-003") {
                      setActiveReportView("patient-report");
                    } else if (reportId === "REP-004") {
                      setActiveReportView("doctor-report");
                    }
                  }}
                  onOpenKpiDetail={() => setActiveReportView("kpi-detail")}
                />
              )}
            {activeNav === "reports" &&
              role === "receptionist" &&
              activeReportView === "dashboard" && (
                <ReceptionistReportsDashboardScreen
                  onOpenDailyAppointments={() =>
                    setActiveReportView("daily-appointments")
                  }
                  onOpenPatientReport={() =>
                    setActiveReportView("patient-report")
                  }
                />
              )}
            {activeNav === "reports" &&
              (role === "admin" || role === "super-admin") &&
              activeReportView === "dashboard" && (
                <ReportsDashboardScreen
                  onOpenReport={(reportId) => {
                    if (reportId === "REP-001") {
                      setActiveReportView("daily-appointments");
                    } else if (reportId === "REP-002") {
                      setActiveReportView("daily-revenue");
                    } else if (reportId === "REP-003") {
                      setActiveReportView("patient-report");
                    } else if (reportId === "REP-004") {
                      setActiveReportView("doctor-report");
                    } else if (reportId === "REP-005") {
                      setActiveReportView("billing-report");
                    }
                  }}
                  onOpenKpiDetail={() => {
                    setActiveReportView("kpi-detail");
                  }}
                />
              )}
            {activeNav === "reports" &&
              (role === "admin" || role === "super-admin") &&
              activeReportView === "daily-appointments" && (
                <DailyAppointmentReportScreen
                  onBack={() => setActiveReportView("dashboard")}
                />
              )}
            {activeNav === "reports" &&
              role === "doctor" &&
              activeReportView === "daily-appointments" && (
                <DoctorDailyAppointmentReportScreen
                  onBack={() => setActiveReportView("dashboard")}
                  onOpenPatientReport={() =>
                    setActiveReportView("patient-report")
                  }
                  onOpenDoctorReport={() =>
                    setActiveReportView("doctor-report")
                  }
                />
              )}
            {activeNav === "reports" &&
              role === "receptionist" &&
              activeReportView === "daily-appointments" && (
                <ReceptionistDailyAppointmentReportScreen
                  onBack={() => setActiveReportView("dashboard")}
                  onOpenPatientReport={() =>
                    setActiveReportView("patient-report")
                  }
                />
              )}
            {activeNav === "reports" &&
              (role === "admin" || role === "super-admin") &&
              activeReportView === "daily-revenue" && (
                <DailyRevenueReportScreen
                  onBack={() => setActiveReportView("dashboard")}
                />
              )}
            {activeNav === "reports" &&
              (role === "admin" || role === "super-admin") &&
              activeReportView === "patient-report" && (
                <PatientReportScreen
                  onBack={() => setActiveReportView("dashboard")}
                  onOpenAppointmentReport={() =>
                    setActiveReportView("daily-appointments")
                  }
                  onOpenDoctorReport={() =>
                    setActiveReportView("doctor-report")
                  }
                />
              )}
            {activeNav === "reports" &&
              role === "receptionist" &&
              activeReportView === "patient-report" && (
                <ReceptionistPatientReportScreen
                  onBack={() => setActiveReportView("dashboard")}
                  onOpenDailyAppointments={() =>
                    setActiveReportView("daily-appointments")
                  }
                />
              )}
            {activeNav === "reports" &&
              role === "doctor" &&
              activeReportView === "patient-report" && (
                <DoctorPatientReportScreen
                  onBack={() => setActiveReportView("dashboard")}
                  onOpenAppointmentReport={() =>
                    setActiveReportView("daily-appointments")
                  }
                  onOpenDoctorReport={() =>
                    setActiveReportView("doctor-report")
                  }
                />
              )}
            {activeNav === "reports" &&
              (role === "admin" || role === "super-admin") &&
              activeReportView === "doctor-report" && (
                <DoctorReportScreen
                  onBack={() => setActiveReportView("dashboard")}
                  onOpenAppointmentReport={() =>
                    setActiveReportView("daily-appointments")
                  }
                  onOpenPatientReport={() =>
                    setActiveReportView("patient-report")
                  }
                />
              )}
            {activeNav === "reports" &&
              role === "doctor" &&
              activeReportView === "doctor-report" && (
                <DoctorDoctorReportScreen
                  onBack={() => setActiveReportView("dashboard")}
                  onOpenAppointmentReport={() =>
                    setActiveReportView("daily-appointments")
                  }
                  onOpenPatientReport={() =>
                    setActiveReportView("patient-report")
                  }
                />
              )}
            {activeNav === "reports" &&
              (role === "admin" || role === "super-admin") &&
              activeReportView === "billing-report" && (
                <BillingReportScreen
                  onBack={() => setActiveReportView("dashboard")}
                  onOpenRevenueReport={() =>
                    setActiveReportView("daily-revenue")
                  }
                />
              )}
            {activeNav === "reports" &&
              (role === "admin" || role === "super-admin") &&
              activeReportView === "kpi-detail" && (
                <DashboardKpiDetailScreen
                  onBack={() => setActiveReportView("dashboard")}
                  onOpenRelatedReport={() =>
                    setActiveReportView("daily-appointments")
                  }
                />
              )}
            {activeNav === "reports" &&
              role === "doctor" &&
              activeReportView === "kpi-detail" && (
                <DoctorDashboardKpiDetailScreen
                  onBack={() => setActiveReportView("dashboard")}
                  onOpenReport={(v) => setActiveReportView(v as ReportView)}
                />
              )}
            {activeNav === "reports" &&
              role === "receptionist" &&
              activeReportView === "kpi-detail" && (
                <ReceptionistDashboardKpiDetailScreen
                  onBack={() => setActiveReportView("dashboard")}
                  onOpenReport={(v) => setActiveReportView(v as ReportView)}
                />
              )}
            {activeNav === "reports" &&
              role === "accountant" &&
              activeReportView === "dashboard" && (
                <AccountantReportsDashboardScreen
                  onOpenDailyRevenue={() =>
                    setActiveReportView("daily-revenue")
                  }
                  onOpenBillingReport={() =>
                    setActiveReportView("billing-report")
                  }
                  onOpenKpiDetail={() => setActiveReportView("kpi-detail")}
                />
              )}
            {activeNav === "reports" &&
              role === "accountant" &&
              activeReportView === "daily-revenue" && (
                <AccountantDailyRevenueReportScreen
                  onBack={() => setActiveReportView("dashboard")}
                  onOpenBillingReport={() =>
                    setActiveReportView("billing-report")
                  }
                />
              )}
            {activeNav === "reports" &&
              role === "accountant" &&
              activeReportView === "billing-report" && (
                <AccountantBillingReportScreen
                  onBack={() => setActiveReportView("dashboard")}
                  onOpenDailyRevenue={() =>
                    setActiveReportView("daily-revenue")
                  }
                />
              )}
            {activeNav === "reports" &&
              role === "accountant" &&
              activeReportView === "kpi-detail" && (
                <AccountantDashboardKpiDetailScreen
                  onBack={() => setActiveReportView("dashboard")}
                  onOpenReport={(v) => setActiveReportView(v as ReportView)}
                />
              )}
            {activeNav === "prescriptions" &&
              role === "patient" &&
              !viewDetailsPrescriptionId && (
                <PatientPrescriptionsScreen
                  onViewDetails={(rxId) => setViewDetailsPrescriptionId(rxId)}
                />
              )}
            {activeNav === "prescriptions" &&
              role === "patient" &&
              viewDetailsPrescriptionId && (
                <PatientPrescriptionDetailsScreen
                  prescriptionId={viewDetailsPrescriptionId}
                  onBack={() => setViewDetailsPrescriptionId(null)}
                />
              )}
            {activeNav === "medical-history" && role === "patient" && (
              <PatientMedicalRecordsScreen />
            )}
            {activeNav === "medical-history" && role !== "patient" && (
              <MedicalHistoryScreen onBack={() => setActiveNav("patients")} />
            )}
            {activeNav === "visit-history" && (
              <PatientVisitHistoryScreen
                onBack={() => setActiveNav("patients")}
              />
            )}
            {activeNav === "patient-timeline" && (
              <PatientTimelineScreen onBack={() => setActiveNav("patients")} />
            )}
            {activeNav === "patient-search" && (
              <PatientSearchScreen
                userRole={role}
                onBack={() => setActiveNav("patients")}
                onPatientSelect={(id) => handlePatientSelect(id)}
                onRegisterClick={() => {
                  setActiveNav("patients");
                  setShowRegisterPatient(true);
                }}
                onBookAppointmentClick={() => {
                  setActiveNav("appointments");
                  setShowBookAppointmentScreen(true);
                }}
                onCheckInClick={() => {
                  setActiveNav("appointments");
                  setShowQueueManagement(true);
                }}
              />
            )}
            {activeNav === "billing" &&
              role === "receptionist" &&
              !collectPaymentInvoiceId &&
              !viewDetailsInvoiceId &&
              !printPreviewInvoiceId && (
                <CreateInvoiceWorkspaceScreen
                  onBack={() => {
                    setShowCreateInvoiceWorkspace(false);
                    setActiveNav("dashboard");
                  }}
                  onInvoiceCreated={() => {
                    setShowCreateInvoiceWorkspace(false);
                    setActiveNav("dashboard");
                  }}
                  onCollectPaymentClick={(invId) => {
                    setCollectPaymentInvoiceId(invId || "INV-1043");
                  }}
                  onViewInvoiceDetailsClick={(invId) => {
                    setViewDetailsInvoiceId(invId || "INV-1542");
                  }}
                  isReceptionist={true}
                />
              )}
            {activeNav === "billing" &&
              role !== "patient" &&
              role !== "receptionist" &&
              !showCreateInvoiceWorkspace &&
              !collectPaymentInvoiceId &&
              !viewDetailsInvoiceId &&
              !printPreviewInvoiceId && (
                <BillingDashboardScreen
                  onGenerateInvoiceClick={() =>
                    setShowCreateInvoiceWorkspace(true)
                  }
                  onCollectPaymentClick={(invId) =>
                    setCollectPaymentInvoiceId(invId || "INV-1041")
                  }
                  onViewInvoiceDetailsClick={(invId) =>
                    setViewDetailsInvoiceId(invId || "INV-1042")
                  }
                  onViewPaymentsClick={() => setActiveNav("payments")}
                  onViewDailyReportClick={() =>
                    setActiveNav("daily-billing-report")
                  }
                  isAdminReadOnly={role === "admin"}
                />
              )}
            {activeNav === "billing" &&
              role !== "patient" &&
              role !== "receptionist" &&
              showCreateInvoiceWorkspace &&
              !collectPaymentInvoiceId &&
              !viewDetailsInvoiceId &&
              !printPreviewInvoiceId && (
                <CreateInvoiceWorkspaceScreen
                  onBack={() => setShowCreateInvoiceWorkspace(false)}
                  onInvoiceCreated={() => setShowCreateInvoiceWorkspace(false)}
                  isReceptionist={false}
                />
              )}
            {activeNav === "billing" &&
              role === "receptionist" &&
              collectPaymentInvoiceId &&
              !viewDetailsInvoiceId &&
              !printPreviewInvoiceId && (
                <ReceptionistPaymentCollectionScreen
                  invoiceId={collectPaymentInvoiceId}
                  onBack={() => setCollectPaymentInvoiceId(null)}
                  onViewInvoiceClick={(invId) => {
                    setCollectPaymentInvoiceId(null);
                    setViewDetailsInvoiceId(invId);
                  }}
                  onPaymentCompleted={() => setCollectPaymentInvoiceId(null)}
                />
              )}
            {activeNav === "billing" &&
              role !== "patient" &&
              role !== "receptionist" &&
              collectPaymentInvoiceId &&
              !viewDetailsInvoiceId &&
              !printPreviewInvoiceId && (
                <CollectPaymentWorkspaceScreen
                  invoiceId={collectPaymentInvoiceId}
                  onBack={() => setCollectPaymentInvoiceId(null)}
                  onPaymentConfirmed={() => setCollectPaymentInvoiceId(null)}
                />
              )}
            {viewDetailsInvoiceId && !printPreviewInvoiceId && (
              <InvoiceDetailsScreen
                invoiceId={viewDetailsInvoiceId}
                onBack={() => setViewDetailsInvoiceId(null)}
                onCollectPaymentClick={(invId) => {
                  setViewDetailsInvoiceId(null);
                  setCollectPaymentInvoiceId(invId);
                }}
                onPrintInvoiceClick={(invId) => {
                  setViewDetailsInvoiceId(null);
                  setPrintPreviewInvoiceId(invId);
                }}
                onViewPatientProfile={(uhid) => handlePatientSelect(uhid)}
                onViewConsultationDetails={(consultId) => {
                  setViewDetailsInvoiceId(null);
                  setActiveNav("consultation");
                  setViewDetailsConsultationId(consultId);
                }}
                isReceptionist={role === "receptionist"}
                isAdminReadOnly={role === "admin"}
                isPatientView={role === "patient"}
              />
            )}
            {printPreviewInvoiceId && (
              <InvoicePrintPreviewScreen
                invoiceId={printPreviewInvoiceId}
                onBack={() => setPrintPreviewInvoiceId(null)}
                onViewPatientProfile={(uhid) => handlePatientSelect(uhid)}
                onViewConsultationDetails={(consultId) => {
                  setPrintPreviewInvoiceId(null);
                  setActiveNav("consultation");
                  setViewDetailsConsultationId(consultId);
                }}
                isReceptionist={role === "receptionist"}
                isPatientView={role === "patient"}
              />
            )}
            {(activeNav === "payments" || activeNav === "payment-history") &&
              role !== "patient" && (
                <PaymentHistoryScreen
                  onViewInvoiceDetailsClick={(invId) => {
                    setActiveNav("billing");
                    setViewDetailsInvoiceId(invId);
                  }}
                  onViewPatientProfile={(uhid) => handlePatientSelect(uhid)}
                  onPrintReceiptClick={(invId) => {
                    setActiveNav("billing");
                    setPrintPreviewInvoiceId(invId);
                  }}
                />
              )}
            {(activeNav === "daily-billing-report" ||
              activeNav === "financial-reports") &&
              role !== "patient" && (
                <DailyBillingReportScreen
                  onBack={() => setActiveNav("billing")}
                  onViewInvoiceDetailsClick={(invId) => {
                    setActiveNav("billing");
                    setViewDetailsInvoiceId(invId);
                  }}
                  onViewPatientProfile={(uhid) => handlePatientSelect(uhid)}
                  isAdminReadOnly={role === "admin"}
                />
              )}
            {(activeNav === "billing" || activeNav === "bills-payments") &&
              role === "patient" &&
              !viewDetailsInvoiceId &&
              !printPreviewInvoiceId && (
                <PatientMyBillsScreen
                  activePatient={activePatient}
                  onBack={() => setActiveNav("dashboard")}
                  onViewInvoiceDetailsClick={(invId) => {
                    setViewDetailsInvoiceId(invId);
                  }}
                  onPrintInvoiceClick={(invId) => {
                    setPrintPreviewInvoiceId(invId);
                  }}
                />
              )}
            {activeNav === "profile" && role === "patient" && (
              <PatientProfileCenterScreen
                activePatient={activePatient}
                onAddFamilyMember={() => {
                  setShowRegisterPatient(true);
                }}
              />
            )}
            {activeNav === "profile" && role !== "patient" && (
              <MyProfileManagement
                currentRole={
                  role === "admin" || role === "super-admin"
                    ? "Hospital Admin"
                    : role === "doctor"
                      ? "Doctor"
                      : role === "nurse"
                        ? "Nurse"
                        : role === "receptionist"
                          ? "Receptionist"
                          : role === "accountant"
                            ? "Accountant"
                            : "Hospital Admin"
                }
                onLogout={onLogout}
                onNavigateToModule={(mod) => {
                  if (mod === "Notifications") setActiveNav("notifications");
                  else if (mod === "Audit Logs") setActiveNav("audit-logs");
                  else setActiveNav("dashboard");
                }}
              />
            )}
            {activeNav === "user-management" && <UserManagementCenterScreen />}
            {activeNav === "audit-logs" && <AuditLogsManagementScreen />}
            {activeNav === "notifications" && (
              <NotificationCenterManagement
                currentRole={
                  role === "admin" || role === "super-admin"
                    ? "Hospital Admin"
                    : role === "doctor"
                      ? "Doctor"
                      : role === "nurse"
                        ? "Nurse"
                        : role === "receptionist"
                          ? "Receptionist"
                          : role === "accountant"
                            ? "Accountant"
                            : role === "patient"
                              ? "Patient Portal"
                              : "Hospital Admin"
                }
                onNavigateToModule={(module, targetId) => {
                  switch (module) {
                    case "Appointments":
                      setActiveNav("appointments");
                      break;
                    case "Patients":
                      if (targetId) handlePatientSelect(targetId);
                      else setActiveNav("patients");
                      break;
                    case "Doctors":
                    case "Doctor":
                      setActiveNav("doctors");
                      break;
                    case "Consultation":
                      setActiveNav("consultation");
                      if (targetId) setViewDetailsConsultationId(targetId);
                      break;
                    case "Invoice":
                    case "Billing":
                      setActiveNav("billing");
                      if (targetId) setViewDetailsInvoiceId(targetId);
                      break;
                    case "Reports":
                    case "Report":
                      setActiveNav("reports");
                      break;
                    case "Audit Logs":
                    case "Audit":
                      setActiveNav("audit-logs");
                      break;
                    default:
                      setActiveNav("dashboard");
                  }
                }}
              />
            )}
            {activeNav === "doctors" && <DoctorManagementCenterScreen />}
            {activeNav === "reception" && (
              <ReceptionDashboard
                onRegisterPatient={() => {
                  setActiveNav("patients");
                  setShowRegisterPatient(true);
                }}
                onPatientSearch={() => {
                  setActiveNav("patient-search");
                }}
              />
            )}
            {activeNav === "vitals" && (
              <RecordPatientVitalsScreen
                onPatientSelect={handlePatientSelect}
              />
            )}
            {activeNav === "settings" && (
              <div className="w-full flex-1 flex flex-col">
                <SettingsWorkspace
                  onNavigate={(s) => setActiveNav(s as NavId)}
                />
              </div>
            )}
            {activeNav === "family-members" && (
              <FamilyMembersManagement
                familyMembers={familyMembers}
                activeFamilyMember={activePatient}
                onSwitchProfile={(member) => {
                  setActivePatient(member);
                }}
                onAddFamilyMember={(newMember) => {
                  if (newMember && newMember.patientName) {
                    const created: FamilyMember = {
                      id: `FM-${Date.now().toString().slice(-3)}`,
                      patientName: newMember.patientName || "New Member",
                      mrn:
                        newMember.mrn ||
                        `MRN-2026-${Math.floor(100000 + Math.random() * 900000)}`,
                      relationship: newMember.relationship || "Mother",
                      age: newMember.age || 40,
                      gender: newMember.gender || "Female",
                      bloodGroup: newMember.bloodGroup || "O+",
                      registeredMobile:
                        newMember.registeredMobile || "+91 98765 00000",
                      verificationStatus: "Verified",
                      patientStatus: "Active",
                      lastAppointment: "Just Added",
                      upcomingAppointmentsCount: 0,
                      pendingBillsCount: 0,
                      pendingBillsAmount: 0,
                      activePrescriptionsCount: 0,
                    };
                    setFamilyMembers((prev) => [created, ...prev]);
                  } else {
                    setShowRegisterPatient(true);
                    setActiveNav("patients");
                  }
                }}
                onRemoveFamilyMember={(id) => {
                  setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
                }}
                onUpdateRelationship={(id, rel) => {
                  setFamilyMembers((prev) =>
                    prev.map((m) =>
                      m.id === id ? { ...m, relationship: rel } : m,
                    ),
                  );
                }}
              />
            )}
            {![
              "dashboard",
              "patients",
              "doctors",
              "appointments",
              "consultation",
              "vitals",
              "reception",
              "prescriptions",
              "reports",
              "medical-history",
              "visit-history",
              "patient-search",
              "billing",
              "bills-payments",
              "profile",
              "user-management",
              "audit-logs",
              "notifications",
              "settings",
              "family-members",
            ].includes(activeNav) && <PlaceholderScreen nav={activeNav} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────
export default function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) return <LoginPage />;
  return (
    <HMS
      onLogout={() => {
        useAuthStore.logout();
      }}
    />
  );
}
