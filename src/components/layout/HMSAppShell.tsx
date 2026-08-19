import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useAuthStore, authStoreActions } from "../../features/auth";
import { Header } from "./Header";
import { NavRail } from "./NavRail";
import type { NavId, Role } from "../../types/app.types";
import { ROUTES } from "../../app/routes/routes";
import { usePatientPortal } from "../../features/patients/context/usePatientPortal";
import type { FamilyMember } from "../../features/patients/pages/FamilyMembersManagement";
import type { FamilyMember as HeaderFamilyMember } from "../../features/patients/types/family.types";

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

const exactPathToNavId: Record<string, NavId> = {
  [ROUTES.DASHBOARD]: "dashboard",
  [ROUTES.PATIENTS]: "patients",
  [ROUTES.DOCTORS]: "doctors",
  [ROUTES.APPOINTMENTS]: "appointments",
  [ROUTES.QUEUE]: "checkin",
  [ROUTES.VITALS]: "vitals",
  [ROUTES.CONSULTATION]: "consultation",
  [ROUTES.PRESCRIPTIONS]: "prescriptions",
  [ROUTES.BILLING]: "billing",
  [ROUTES.REPORTS]: "reports",
  [ROUTES.SETTINGS]: "settings",
  [ROUTES.PROFILE]: "profile",
  [ROUTES.DOCTOR_ME_PROFILE]: "profile",
  [ROUTES.USER_MANAGEMENT]: "user-management",
  [ROUTES.AUDIT_LOGS]: "audit-logs",
  [ROUTES.NOTIFICATIONS]: "notifications",
  [ROUTES.FAMILY_MEMBERS]: "family-members",
  [ROUTES.PATIENT_APPOINTMENTS]: "appointments",
  [ROUTES.PATIENT_MEDICAL_RECORDS]: "medical-history",
  [ROUTES.PATIENT_PRESCRIPTIONS]: "prescriptions",
  [ROUTES.PATIENT_BILLING]: "bills-payments",
  [ROUTES.PATIENT_DOCTORS]: "doctors",
  [ROUTES.PATIENT_QUEUE]: "queue-status",
  [ROUTES.PATIENT_NOTIFICATIONS]: "notifications",
  [ROUTES.PATIENT_MY_PROFILE]: "profile",
  [ROUTES.DOCTOR_MY_SCHEDULE]: "my-schedule",
  [ROUTES.DOCTOR_MY_QUEUE]: "my-queue",
  [ROUTES.DOCTOR_PATIENTS]: "patients",
  [ROUTES.DOCTOR_MEDICAL_RECORDS]: "medical-history",
  [ROUTES.DOCTOR_APPOINTMENTS]: "appointments",
  [ROUTES.DOCTOR_CONSULTATION]: "consultation",
  [ROUTES.DOCTOR_PRESCRIPTIONS]: "prescriptions",
  [ROUTES.DOCTOR_PATIENT_DETAILS]: "patients",
};

const BILLING_PREFIXES: NavId[] = [
  "/billing",
  "/patients/billing",
  "/patients/my-bills",
  "/accountant/patients/billing",
  "/receptionist/billing",
];

function resolvePathToNavId(pathname: string): NavId {
  const exact = exactPathToNavId[pathname];
  if (exact) return exact;

  for (const prefix of BILLING_PREFIXES) {
    if (pathname.startsWith(prefix)) return "billing";
  }

  return "dashboard";
}

const navIdToPath = (role: Role, navId: NavId): string => {
  const isPatient = role === "patient";
  const isDoctor = role === "doctor";

  if (isPatient) {
    switch (navId) {
      case "dashboard":
        return ROUTES.DASHBOARD;
      case "profile":
        return ROUTES.PATIENT_MY_PROFILE;
      case "family-members":
        return ROUTES.FAMILY_MEMBERS;
      case "doctors":
        return ROUTES.PATIENT_DOCTORS;
      case "appointments":
        return ROUTES.PATIENT_APPOINTMENTS;
      case "queue-status":
        return ROUTES.PATIENT_QUEUE;
      case "medical-history":
        return ROUTES.PATIENT_MEDICAL_RECORDS;
      case "prescriptions":
        return ROUTES.PATIENT_PRESCRIPTIONS;
      case "bills-payments":
        return ROUTES.PATIENT_BILLING;
      case "notifications":
        return ROUTES.PATIENT_NOTIFICATIONS;
      case "settings":
        return ROUTES.SETTINGS;
      default:
        return ROUTES.DASHBOARD;
    }
  }

  if (isDoctor) {
    switch (navId) {
      case "dashboard":
        return ROUTES.DASHBOARD;
      case "my-schedule":
        return ROUTES.DOCTOR_MY_SCHEDULE;
      case "patients":
        return ROUTES.DOCTOR_PATIENTS;
      case "appointments":
        return ROUTES.DOCTOR_APPOINTMENTS;
      case "my-queue":
        return ROUTES.DOCTOR_MY_QUEUE;
      case "consultation":
        return ROUTES.DOCTOR_CONSULTATION;
      case "prescriptions":
        return ROUTES.DOCTOR_PRESCRIPTIONS;
      case "medical-history":
        return ROUTES.DOCTOR_MEDICAL_RECORDS;
      case "doctors":
        return ROUTES.DOCTORS;
      case "reports":
        return ROUTES.REPORTS;
      case "settings":
        return ROUTES.SETTINGS;
      case "notifications":
        return ROUTES.NOTIFICATIONS;
      case "profile":
        return ROUTES.DOCTOR_ME_PROFILE;
      default:
        return ROUTES.DASHBOARD;
    }
  }

  const base: Record<NavId, string> = {
    dashboard: ROUTES.DASHBOARD,
    patients: ROUTES.PATIENTS,
    doctors: ROUTES.DOCTORS,
    appointments: ROUTES.APPOINTMENTS,
    checkin: ROUTES.QUEUE,
    consultation: ROUTES.CONSULTATION,
    vitals: ROUTES.VITALS,
    prescriptions: ROUTES.PRESCRIPTIONS,
    billing: ROUTES.BILLING,
    payments: ROUTES.BILLING,
    "payment-history": ROUTES.BILLING,
    "daily-billing-report": ROUTES.BILLING,
    "operational-reports": ROUTES.REPORTS,
    "financial-reports": ROUTES.REPORTS,
    "audit-logs": ROUTES.AUDIT_LOGS,
    notifications: ROUTES.NOTIFICATIONS,
    settings: ROUTES.SETTINGS,
    profile: ROUTES.PROFILE,
    "hospital-management": ROUTES.SETTINGS,
    "user-management": ROUTES.USER_MANAGEMENT,
    "roles-permissions": ROUTES.USER_MANAGEMENT,
    "medical-history": ROUTES.PATIENTS,
    "visit-history": ROUTES.PATIENTS,
    "patient-timeline": ROUTES.PATIENTS,
    "patient-search": ROUTES.PATIENTS,
    "bills-payments": ROUTES.BILLING,
    reports: ROUTES.REPORTS,
    "family-members": ROUTES.FAMILY_MEMBERS,
    reception: ROUTES.DASHBOARD,
    opd: ROUTES.CONSULTATION,
    "queue-status": ROUTES.PATIENT_QUEUE,
    "my-schedule": ROUTES.DOCTOR_MY_SCHEDULE,
    "my-queue": ROUTES.DOCTOR_MY_QUEUE,
  };
  return base[navId] || ROUTES.DASHBOARD;
};

export function HMSAppShell({ onLogout }: { onLogout?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const handleLogout = onLogout || (() => authStoreActions.logout());

  const role = user?.role ? mapUserRoleToAppRole(user.role) : "admin";
  const activeNav = resolvePathToNavId(location.pathname);
  const [sidebarTheme, setSidebarTheme] = useState<"light" | "dark">("light");
  const portal = usePatientPortal();

  const toHeaderMember = (m: FamilyMember): HeaderFamilyMember => ({
    id: String(m.id),
    patientName: m.patientName,
    name: m.patientName,
    relationship: m.relationship,
    age: m.age,
    gender: m.gender,
    mrn: m.mrn,
    verificationStatus: m.verificationStatus,
    isPrimary: m.relationship === "Self",
    status: m.patientStatus,
  });

  const familyMembers: HeaderFamilyMember[] = (portal?.familyMembers ?? []).map(
    toHeaderMember,
  );
  const activePatient: HeaderFamilyMember | undefined = portal?.activePatient
    ? toHeaderMember(portal.activePatient)
    : undefined;

  const handleSwitchActivePatient = (member: HeaderFamilyMember) => {
    const match = (portal?.familyMembers ?? []).find(
      (m) =>
        String(m.id) === String(member.id) || (m.mrn && m.mrn === member.mrn),
    );
    if (match) portal?.switchToPatient(match);
  };

  const handleNavSelect = (id: NavId) => {
    const path = navIdToPath(role, id);
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F1F5F9] font-sans text-[#111827] antialiased">
      <Header
        activeNav={activeNav}
        role={role}
        onLogout={handleLogout}
        onNavigateNav={handleNavSelect}
        activePatient={activePatient}
        familyMembers={familyMembers}
        onSwitchActivePatient={handleSwitchActivePatient}
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
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HMSAppShell;
