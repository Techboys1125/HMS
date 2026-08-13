import { Activity } from "lucide-react";
import { SYSTEM_TIMELINE } from "../../constants/backup.constants";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export function SystemTimelineSection() {
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
        <Activity size={18} style={{ color: "#009688" }} /> Section 06:
        Recent Maintenance & System Timeline
      </h3>

      <div
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        {SYSTEM_TIMELINE.map((act) => (
          <div
            key={act.title}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#F8FAFC",
              padding: "12px 14px",
              borderRadius: "10px",
              border: "1px solid #E2E8F0",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#009688",
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  {act.title}
                </div>
                <div style={{ fontSize: "11px", color: "#64748B" }}>
                  By {act.user} • {act.module}
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#2E7D32",
                  background: "#E8F5E9",
                  padding: "2px 8px",
                  borderRadius: "10px",
                }}
              >
                {act.status}
              </span>
              <div
                style={{
                  fontSize: "10px",
                  color: "#94A3B8",
                  marginTop: "2px",
                }}
              >
                {act.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
