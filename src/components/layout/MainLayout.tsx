import type { ReactNode } from "react";
import type { NavId, Role } from "../../types/app.types";
import type { FamilyMember } from "../../features/patients/pages/FamilyMembersManagement";
import { Header } from "./Header";
import { NavRail } from "./NavRail";

const EMPTY_FAMILY_MEMBERS: FamilyMember[] = [];

export function MainLayout({
  activeNav,
  role,
  onLogout,
  onNavigateNav,
  activePatient,
  familyMembers = EMPTY_FAMILY_MEMBERS,
  onSwitchActivePatient,
  sidebarTheme = "light",
  onThemeToggle,
  children,
}: {
  activeNav: NavId;
  role: Role;
  onLogout: () => void;
  onNavigateNav: (id: NavId) => void;
  activePatient?: FamilyMember;
  familyMembers?: readonly FamilyMember[];
  onSwitchActivePatient?: (member: FamilyMember) => void;
  sidebarTheme?: "light" | "dark";
  onThemeToggle?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-[#F1F5F9] font-sans text-[#111827] antialiased">
      <Header
        activeNav={activeNav}
        role={role}
        onLogout={onLogout}
        onNavigateNav={onNavigateNav}
        activePatient={activePatient}
        familyMembers={familyMembers}
        onSwitchActivePatient={onSwitchActivePatient}
      />

      <div className="flex flex-1 overflow-hidden">
        <NavRail
          active={activeNav}
          onSelect={onNavigateNav}
          role={role}
          theme={sidebarTheme}
          onThemeToggle={onThemeToggle}
        />

        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
