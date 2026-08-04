import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useAuthStore, authStoreActions } from "../../features/auth";
import { Header } from "./Header";
import { NavRail } from "./NavRail";
import type { NavId, Role } from "../../types/app.types";
import { ROUTES } from "../../app/routes/routes";
import { patientsApi } from "../../features/patients";
import type { FamilyMember } from "../../features/patients";

interface FamilyMemberPayload {
  id?: string | number;
  mrn?: string;
  patientName?: string;
  fullName?: string;
  relationship?: string;
  age?: number;
  gender?: string;
  mobileNumber?: string;
  phone?: string;
  registeredMobile?: string;
  email?: string;
  photoUrl?: string;
  photo?: string;
  address?: unknown;
  lastAppointment?: string;
  upcomingAppointmentsCount?: number;
  pendingBillsCount?: number;
  pendingBillsAmount?: number;
  activePrescriptionsCount?: number;
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

const pathToNavId: Record<string, NavId> = {
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
  [ROUTES.DOCTOR_MY_SCHEDULE]: "my-schedule",
  [ROUTES.DOCTOR_MY_QUEUE]: "my-queue",
  [ROUTES.DOCTOR_PATIENTS]: "patients",
  [ROUTES.DOCTOR_MEDICAL_RECORDS]: "medical-history",
  [ROUTES.DOCTOR_APPOINTMENTS]: "appointments",
  [ROUTES.DOCTOR_CONSULTATION]: "consultation",
  [ROUTES.DOCTOR_PRESCRIPTIONS]: "prescriptions",
  [ROUTES.DOCTOR_PATIENT_DETAILS]: "patients",
};

const navIdToPath = (role: Role, navId: NavId): string => {
  const isPatient = role === "patient";
  const isDoctor = role === "doctor";

  if (isPatient) {
    switch (navId) {
      case "dashboard":
        return ROUTES.DASHBOARD;
      case "profile":
        return ROUTES.PATIENTS;
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
      case "profile":
        return ROUTES.PROFILE;
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
  const activeNav = pathToNavId[location.pathname] || "dashboard";
  const [sidebarTheme, setSidebarTheme] = useState<"light" | "dark">("light");
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [activePatient, setActivePatient] = useState<FamilyMember | undefined>(
    undefined,
  );

  useEffect(() => {
    if (role !== "patient") return;
    let cancelled = false;
    patientsApi
      .getMyPatients()
      .then((data) => {
        if (cancelled) return;
        const mapped: FamilyMember[] = (Array.isArray(data) ? data : []).map(
          (p: FamilyMemberPayload) => ({
            id: String(p.id ?? p.mrn ?? Math.random()),
            patientName: p.patientName || p.fullName || "Unknown",
            name: p.patientName || p.fullName || "Unknown",
            mrn: p.mrn || "",
            relationship:
              (p.relationship as FamilyMember["relationship"]) || "Self",
            age: p.age ?? 0,
            gender: (p.gender as FamilyMember["gender"]) || "Other",
            mobileNumber: p.mobileNumber || p.phone || "",
            registeredMobile:
              p.registeredMobile || p.mobileNumber || p.phone || "",
            email: p.email,
            photoUrl: p.photoUrl || p.photo,
            address: typeof p.address === "string" ? p.address : "",
            verificationStatus: "Verified",
            patientStatus: "Active",
            lastAppointment: p.lastAppointment || "",
            upcomingAppointmentsCount: p.upcomingAppointmentsCount ?? 0,
            pendingBillsCount: p.pendingBillsCount ?? 0,
            pendingBillsAmount: p.pendingBillsAmount ?? 0,
            activePrescriptionsCount: p.activePrescriptionsCount ?? 0,
          }),
        );
        setFamilyMembers(mapped);
        setActivePatient((prev) => {
          if (prev) return prev;
          return mapped[0];
        });
      })
      .catch(() => {
        if (cancelled) return;
        setFamilyMembers([]);
      });
    return () => {
      cancelled = true;
    };
  }, [role]);

  const handleNavSelect = (id: NavId) => {
    const path = navIdToPath(role, id);
    if (path) {
      navigate(path);
    }
  };

  const handleSwitchActivePatient = (member: FamilyMember) => {
    setActivePatient(member);
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
