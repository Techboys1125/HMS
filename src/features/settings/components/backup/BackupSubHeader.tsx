import { useState } from "react";
import { Play, Save, Wrench } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

interface BackupSubHeaderProps {
  onSave: () => void;
  onShowToast: (message: string) => void;
  maintenanceMode: boolean;
  onToggleMaintenance: () => void;
}

export function BackupSubHeader({
  onSave,
  onShowToast,
  maintenanceMode,
  onToggleMaintenance,
}: BackupSubHeaderProps) {
  void RB;
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleRunBackupNow = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      onShowToast("Manual System & Database Backup completed successfully!");
    }, 2000);
  };

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "16px",
        border: "1px solid #E5E7EB",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <div>
        <h2
          style={{
            fontFamily: PP,
            fontSize: "18px",
            fontWeight: 700,
            color: "#111827",
            margin: 0,
          }}
        >
          Backup & System Maintenance
        </h2>
        <p
          style={{
            fontSize: "12px",
            color: "#64748B",
            margin: "2px 0 0 0",
          }}
        >
          Manage backup schedules, monitor system health, configure
          maintenance windows, and review backup history.
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          onClick={handleRunBackupNow}
          disabled={isBackingUp}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            borderRadius: "8px",
            border: "none",
            background: "#0D47A1",
            color: "#FFFFFF",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(13,71,161,0.2)",
          }}
        >
          <Play size={14} />{" "}
          {isBackingUp ? "Backing Up..." : "Run Backup Now"}
        </button>
        <button
          onClick={onToggleMaintenance}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            borderRadius: "8px",
            border: "1px solid #E5E7EB",
            background: maintenanceMode ? "#FEF3C7" : "#FFFFFF",
            color: maintenanceMode ? "#B45309" : "#374151",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Wrench size={14} />{" "}
          {maintenanceMode ? "Maintenance ON" : "Maintenance Mode"}
        </button>
        <button
          onClick={onSave}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            borderRadius: "8px",
            border: "1px solid #E5E7EB",
            background: "#FFFFFF",
            color: "#64748B",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          <Save size={14} /> Save Configuration
        </button>
      </div>
    </div>
  );
}
