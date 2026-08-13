import { useState } from "react";
import { DEFAULT_MAINT_CONFIG } from "../constants/backup.constants";
import { BackupSubHeader } from "../components/backup/BackupSubHeader";
import { BackupKpiCards } from "../components/backup/BackupKpiCards";
import { BackupConfigSection } from "../components/backup/BackupConfigSection";
import { BackupHistoryTable } from "../components/backup/BackupHistoryTable";
import { StorageOverviewSection } from "../components/backup/StorageOverviewSection";
import { MaintenanceConfigSection } from "../components/backup/MaintenanceConfigSection";
import { ServiceHealthSection } from "../components/backup/ServiceHealthSection";
import { SystemTimelineSection } from "../components/backup/SystemTimelineSection";
import { BackupAnalyticsSection } from "../components/backup/BackupAnalyticsSection";
import { RecoveryReadinessSection } from "../components/backup/RecoveryReadinessSection";
import { BackupSaveToast } from "../components/backup/BackupSaveToast";

export function BackupMaintenancePage() {
  const [maintConfig, setMaintConfig] = useState(DEFAULT_MAINT_CONFIG);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const handleSave = () => {
    setSaveToast("Backup schedules and maintenance preferences updated!");
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleShowToast = (message: string) => {
    setSaveToast(message);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleToggleMaintenance = () => {
    setMaintConfig((prev) => ({
      ...prev,
      enableMaintenanceMode: !prev.enableMaintenanceMode,
    }));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: "20px",
      }}
    >
      {/* MAIN CONTENT SECTIONS */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "100%",
        }}
      >
        {/* SUB-HEADER ACTION BAR */}
        <BackupSubHeader
          onSave={handleSave}
          onShowToast={handleShowToast}
          maintenanceMode={maintConfig.enableMaintenanceMode}
          onToggleMaintenance={handleToggleMaintenance}
        />

        {/* TOP KPI CARDS (4 CARDS) */}
        <BackupKpiCards maintenanceMode={maintConfig.enableMaintenanceMode} />

        {/* SECTION 01: BACKUP CONFIGURATION */}
        <BackupConfigSection />

        {/* SECTION 02: BACKUP HISTORY DATA TABLE */}
        <BackupHistoryTable />

        {/* SECTION 03: STORAGE OVERVIEW */}
        <StorageOverviewSection />

        {/* SECTION 04: MAINTENANCE CONFIGURATION */}
        <MaintenanceConfigSection
          maintConfig={maintConfig}
          setMaintConfig={setMaintConfig}
        />

        {/* SECTION 05: SYSTEM HEALTH MONITORING CARDS */}
        <ServiceHealthSection />

        {/* SECTION 06: RECENT SYSTEM ACTIVITY TIMELINE */}
        <SystemTimelineSection />

        {/* SECTION 07: ANALYTICS CHARTS */}
        <BackupAnalyticsSection />

        {/* SECTION 08: RECOVERY READINESS STATUS */}
        <RecoveryReadinessSection />
      </div>

      {/* SAVE TOAST */}
      <BackupSaveToast message={saveToast} />
    </div>
  );
}
