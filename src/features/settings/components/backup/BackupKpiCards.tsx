import { Activity, Database, HardDrive, Wrench } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export function BackupKpiCards({
  maintenanceMode,
}: {
  maintenanceMode: boolean;
}) {
  void RB;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E5E7EB",
          padding: "18px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <span
            style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}
          >
            System Health
          </span>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "#E8F5E9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Activity size={18} style={{ color: "#2E7D32" }} />
          </div>
        </div>
        <div
          style={{
            fontFamily: PP,
            fontSize: "24px",
            fontWeight: 800,
            color: "#111827",
          }}
        >
          100% Healthy
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "6px",
          }}
        >
          <span style={{ fontSize: "11px", color: "#94A3B8" }}>
            All Nodes Operational
          </span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: "#2E7D32",
              background: "#E8F5E9",
              padding: "1px 6px",
              borderRadius: "4px",
            }}
          >
            Optimal
          </span>
        </div>
      </div>

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E5E7EB",
          padding: "18px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <span
            style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}
          >
            Last Backup
          </span>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "#E3F2FD",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Database size={18} style={{ color: "#0D47A1" }} />
          </div>
        </div>
        <div
          style={{
            fontFamily: PP,
            fontSize: "24px",
            fontWeight: 800,
            color: "#111827",
          }}
        >
          Today, 02:00 AM
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "6px",
          }}
        >
          <span style={{ fontSize: "11px", color: "#94A3B8" }}>
            Size: 4.2 GB
          </span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: "#2E7D32",
              background: "#E8F5E9",
              padding: "1px 6px",
              borderRadius: "4px",
            }}
          >
            Verified
          </span>
        </div>
      </div>

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E5E7EB",
          padding: "18px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <span
            style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}
          >
            Storage Usage
          </span>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "#E0F2F1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HardDrive size={18} style={{ color: "#009688" }} />
          </div>
        </div>
        <div
          style={{
            fontFamily: PP,
            fontSize: "24px",
            fontWeight: 800,
            color: "#111827",
          }}
        >
          24.5 GB / 500 GB
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "6px",
          }}
        >
          <span style={{ fontSize: "11px", color: "#94A3B8" }}>
            4.9% Capacity Used
          </span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: "#009688",
              background: "#E0F2F1",
              padding: "1px 6px",
              borderRadius: "4px",
            }}
          >
            Ample Space
          </span>
        </div>
      </div>

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E5E7EB",
          padding: "18px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <span
            style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}
          >
            Maintenance Status
          </span>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: maintenanceMode ? "#FEF3C7" : "#E8F5E9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Wrench
              size={18}
              style={{
                color: maintenanceMode ? "#B45309" : "#2E7D32",
              }}
            />
          </div>
        </div>
        <div
          style={{
            fontFamily: PP,
            fontSize: "24px",
            fontWeight: 800,
            color: "#111827",
          }}
        >
          {maintenanceMode ? "Maintenance ON" : "Normal Operations"}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "6px",
          }}
        >
          <span style={{ fontSize: "11px", color: "#94A3B8" }}>
            Next Window: 01 Aug
          </span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: maintenanceMode ? "#B45309" : "#2E7D32",
              background: maintenanceMode ? "#FEF3C7" : "#E8F5E9",
              padding: "1px 6px",
              borderRadius: "4px",
            }}
          >
            {maintenanceMode ? "Active" : "Scheduled"}
          </span>
        </div>
      </div>
    </div>
  );
}
