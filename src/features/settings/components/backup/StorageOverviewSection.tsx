import { HardDrive } from "lucide-react";
import { STORAGE_BREAKDOWN } from "../../constants/backup.constants";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export function StorageOverviewSection() {
  void RB;
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
        <HardDrive size={18} style={{ color: "#009688" }} /> Section 03:
        Disk & Storage Space Breakdown
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
        }}
      >
        {STORAGE_BREAKDOWN.map((st) => (
          <div
            key={st.label}
            style={{
              background: "#F8FAFC",
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#111827",
                marginBottom: "4px",
              }}
            >
              {st.label}
            </div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: 800,
                color: st.color,
                marginBottom: "6px",
              }}
            >
              {st.used}
            </div>
            <div
              style={{
                width: "100%",
                height: "6px",
                background: "#E2E8F0",
                borderRadius: "3px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${st.pct}%`,
                  height: "100%",
                  background: st.color,
                }}
              />
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "#64748B",
                marginTop: "4px",
              }}
            >
              Of {st.total} Total Allocated
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
