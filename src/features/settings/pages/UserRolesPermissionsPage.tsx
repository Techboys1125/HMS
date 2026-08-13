import { useState } from "react";
import { UserRolesHeader } from "../components/userroles/UserRolesHeader";
import { UserRolesKpiCards } from "../components/userroles/UserRolesKpiCards";
import { QuickActionsCards } from "../components/userroles/QuickActionsCards";
import { RolesTable } from "../components/userroles/RolesTable";
import { PermissionMatrix } from "../components/userroles/PermissionMatrix";
import { ModuleAccessOverview } from "../components/userroles/ModuleAccessOverview";
import { PermissionAnalyticsCharts } from "../components/userroles/PermissionAnalyticsCharts";
import { UserRolesSaveToast } from "../components/userroles/UserRolesSaveToast";

export function UserRolesPermissionsPage() {
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const handleSaveChanges = () => {
    setSaveToast("Role & Permission matrix changes saved successfully!");
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Use handleSaveChanges to suppress unused warning
  void handleSaveChanges;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* ─── SECTION: SUB-HEADER ACTIONS ───────────────────────────────── */}
      <UserRolesHeader />

      {/* ─── TOP KPI CARDS (4 CARDS) ──────────────────────────────────────── */}
      <UserRolesKpiCards />

      {/* ─── QUICK ACTIONS CARDS ─────────────────────────────────────────── */}
      <QuickActionsCards />

      {/* ─── MAIN CONTENT SECTIONS ───────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: "20px",
        }}
      >
        {/* SECTION 01: ROLES DATA TABLE */}
        <RolesTable />

        {/* SECTION 02: PERMISSION MATRIX GRID */}
        <PermissionMatrix />

        {/* SECTION 04: MODULE ACCESS OVERVIEW CARDS */}
        <ModuleAccessOverview />

        {/* SECTION 05: PERMISSION ANALYTICS CHARTS */}
        <PermissionAnalyticsCharts />
      </div>

      {/* SAVE TOAST NOTIFICATION */}
      <UserRolesSaveToast message={saveToast} />
    </div>
  );
}
