import { Server } from "lucide-react";
import { SERVICE_HEALTH } from "../../constants/backup.constants";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export function ServiceHealthSection() {
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
        <Server size={18} style={{ color: "#0D47A1" }} /> Section 05: Core HMS
        Service Health Status
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "12px",
        }}
      >
        {SERVICE_HEALTH.map((srv) => {
          const SrvIcon = srv.icon;
          return (
            <div
              key={srv.service}
              style={{
                background: "#F8FAFC",
                borderRadius: "10px",
                border: "1px solid #E2E8F0",
                padding: "12px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: srv.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 6px auto",
                }}
              >
                <SrvIcon size={16} style={{ color: srv.color }} />
              </div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {srv.service}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#2E7D32",
                  fontWeight: 600,
                  margin: "2px 0",
                }}
              >
                {srv.status}
              </div>
              <div style={{ fontSize: "10px", color: "#94A3B8" }}>
                {srv.latency}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
