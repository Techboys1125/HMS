import { useState } from "react";
import { Smartphone } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export function SessionManagement() {
  void RB;
  const [sessionConfig, setSessionConfig] = useState({
    autoLogoutMinutes: "15 Minutes",
    timeoutWarning: true,
    allowConcurrent: false,
    maxConcurrentSessions: 1,
  });

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
        <Smartphone size={18} style={{ color: "#0D47A1" }} /> Section 03:
        Session Timeout & Inactivity Rules
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "16px",
        }}
      >
        <div>
          <span
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Auto Logout After Inactivity
          
          <select aria-label="Select option"
            value={sessionConfig.autoLogoutMinutes}
            onChange={(e) =>
              setSessionConfig((prev) => ({
                ...prev,
                autoLogoutMinutes: e.target.value,
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
          >
            <option>10 Minutes</option>
            <option>15 Minutes</option>
            <option>30 Minutes</option>
            <option>60 Minutes</option>
          </select></span>
        </div>

        <div
          style={{
            background: "#F8FAFC",
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "fit-content",
            marginTop: "18px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#111827",
              }}
            >
              Session Timeout Warning
            </div>
            <div style={{ fontSize: "10px", color: "#64748B" }}>
              Show 60s countdown toast before logout
            </div>
          </div>
          <input aria-label="Toggle option"
            type="checkbox"
            checked={sessionConfig.timeoutWarning}
            onChange={(e) =>
              setSessionConfig((prev) => ({
                ...prev,
                timeoutWarning: e.target.checked,
              }))
            }
            style={{ accentColor: "#0D47A1", cursor: "pointer" }}
          />
        </div>

        <div
          style={{
            background: "#F8FAFC",
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "fit-content",
            marginTop: "18px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#111827",
              }}
            >
              Allow Concurrent Sessions
            </div>
            <div style={{ fontSize: "10px", color: "#64748B" }}>
              Permit simultaneous login sessions
            </div>
          </div>
          <input aria-label="Toggle option"
            type="checkbox"
            checked={sessionConfig.allowConcurrent}
            onChange={(e) =>
              setSessionConfig((prev) => ({
                ...prev,
                allowConcurrent: e.target.checked,
              }))
            }
            style={{ accentColor: "#0D47A1", cursor: "pointer" }}
          />
        </div>
      </div>
    </div>
  );
}
