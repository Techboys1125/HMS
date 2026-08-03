import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useAuthStore, authStoreActions } from "../../features/auth";
import { Header } from "./Header";
import { NavRail } from "./NavRail";
import type { NavId, Role } from "../../types/app.types";
import { ROUTES } from "../../app/routes/routes";

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
};

const navIdToPath: Record<NavId, string> = {
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
};

export function HMSAppShell({ onLogout }: { onLogout?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const handleLogout = onLogout || (() => authStoreActions.logout());

  const role = user?.role ? mapUserRoleToAppRole(user.role) : "admin";
  const activeNav = pathToNavId[location.pathname] || "dashboard";
  const [sidebarTheme, setSidebarTheme] = useState<"light" | "dark">("light");

  const handleNavSelect = (id: NavId) => {
    const path = navIdToPath[id];
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
