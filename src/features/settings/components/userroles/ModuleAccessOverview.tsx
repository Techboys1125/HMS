import { Lock } from "lucide-react";
import { MODULE_ACCESS_OVERVIEW } from "../../constants/userroles.constants";

const PP = "'Poppins', system-ui, sans-serif";

export function ModuleAccessOverview() {
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
          fontSize: "16px",
          fontWeight: 700,
          color: "#111827",
          margin: "0 0 16px 0",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Lock size={18} style={{ color: "#009688" }} /> Module Access Matrix
        Overview
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "14px",
        }}
      >
        {MODULE_ACCESS_OVERVIEW.map((m) => (
          <div
            key={m.module}
            style={{
              background: "#F8FAFC",
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              padding: "14px",
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
              <h4
                style={{
                  fontFamily: PP,
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#111827",
                  margin: 0,
                }}
              >
                {m.module}
              </h4>
              <span
                style={{
                  fontSize: "10px",
                  color: "#64748B",
                  fontWeight: 600,
                }}
              >
                RBAC Rule
              </span>
            </div>
            <p
              style={{
                fontSize: "11px",
                color: "#64748B",
                margin: "0 0 10px 0",
              }}
            >
              {m.summary}
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                fontSize: "11px",
              }}
            >
              <div>
                <span style={{ color: "#2E7D32", fontWeight: 700 }}>
                  Allowed Roles:{" "}
                </span>
                <span style={{ color: "#111827" }}>{m.allowed.join(", ")}</span>
              </div>
              <div>
                <span style={{ color: "#DC2626", fontWeight: 700 }}>
                  Blocked Roles:{" "}
                </span>
                <span style={{ color: "#64748B" }}>{m.blocked.join(", ")}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
