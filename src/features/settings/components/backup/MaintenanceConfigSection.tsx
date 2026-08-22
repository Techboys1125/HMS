import { Wrench } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { MaintConfig } from "../../constants/backup.constants";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

interface MaintenanceConfigSectionProps {
  maintConfig: MaintConfig;
  setMaintConfig: Dispatch<SetStateAction<MaintConfig>>;
}

export function MaintenanceConfigSection({
  maintConfig,
  setMaintConfig,
}: MaintenanceConfigSectionProps) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "16px",
        border: "1px solid #E5E7EB",
        padding: "20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <h3
        style={{
          fontFamily: PP,
          fontSize: "15px",
          fontWeight: 700,
          color: "#111827",
          margin: "0 0 16px 0",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Wrench size={18} style={{ color: "#B45309" }} /> Section 04: Scheduled
        System Maintenance Window
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Maintenance Date
          </label>
          <input
            type="date"
            value={maintConfig.scheduledDate}
            onChange={(e) =>
              setMaintConfig((prev) => ({
                ...prev,
                scheduledDate: e.target.value,
              }))
            }
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Start Time
          </label>
          <input
            type="text"
            value={maintConfig.startTime}
            onChange={(e) =>
              setMaintConfig((prev) => ({
                ...prev,
                startTime: e.target.value,
              }))
            }
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Estimated End Time
          </label>
          <input
            type="text"
            value={maintConfig.endTime}
            onChange={(e) =>
              setMaintConfig((prev) => ({
                ...prev,
                endTime: e.target.value,
              }))
            }
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            fontSize: "12px",
            fontWeight: 600,
            color: "#374151",
            marginBottom: "6px",
          }}
        >
          User Broadcast Maintenance Notice
        </label>
        <textarea
          rows={2}
          value={maintConfig.maintenanceMessage}
          onChange={(e) =>
            setMaintConfig((prev) => ({
              ...prev,
              maintenanceMessage: e.target.value,
            }))
          }
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #D1D5DB",
            fontSize: "12px",
            boxSizing: "border-box",
            fontFamily: RB,
          }}
        />
      </div>

      <div
        style={{
          background: "#FEF3C7",
          padding: "12px 14px",
          borderRadius: "10px",
          border: "1px solid #FDE68A",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#92400E" }}>
            Activate Emergency System Maintenance Banner
          </div>
          <div style={{ fontSize: "11px", color: "#B45309" }}>
            Displays top notification banner across all active staff sessions
          </div>
        </div>
        <input
          type="checkbox"
          checked={maintConfig.enableMaintenanceMode}
          onChange={(e) =>
            setMaintConfig((prev) => ({
              ...prev,
              enableMaintenanceMode: e.target.checked,
            }))
          }
          style={{
            accentColor: "#B45309",
            width: "18px",
            height: "18px",
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
}
