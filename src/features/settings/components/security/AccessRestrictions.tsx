import { useState } from "react";
import { Shield } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export function AccessRestrictions() {
  void RB;
  const [accessRestrictions, setAccessRestrictions] = useState({
    restrictWorkingHours: false,
    restrictDepartment: true,
    restrictIpAddress: true,
    restrictExternalAccess: false,
    emergencyOverride: true,
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
        <Shield size={18} style={{ color: "#009688" }} /> Section 05: Network &
        IP Access Restrictions
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
        }}
      >
        {[
          {
            label: "Restrict Login by Working Hours",
            sub: "Deny staff logins outside shift hours",
            key: "restrictWorkingHours",
          },
          {
            label: "Restrict Login by Department Node",
            sub: "Allow access only from hospital IP subnet",
            key: "restrictDepartment",
          },
          {
            label: "Restrict Login by IP Whitelist",
            sub: "Enforce static IP binding for admin consoles",
            key: "restrictIpAddress",
          },
          {
            label: "Restrict External Internet Access",
            sub: "Block public web access to clinical EMR",
            key: "restrictExternalAccess",
          },
          {
            label: "Emergency Access Override",
            sub: "Allow Chief Medical Officer emergency bypass",
            key: "emergencyOverride",
          },
        ].map((item) => (
          <div
            key={item.key}
            style={{
              background: "#F8FAFC",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
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
                {item.label}
              </div>
              <div style={{ fontSize: "10px", color: "#64748B" }}>
                {item.sub}
              </div>
            </div>
            <input
              aria-label="Toggle option"
              type="checkbox"
              checked={
                accessRestrictions[item.key as keyof typeof accessRestrictions]
              }
              onChange={(e) =>
                setAccessRestrictions((prev) => ({
                  ...prev,
                  [item.key]: e.target.checked,
                }))
              }
              style={{ accentColor: "#009688", cursor: "pointer" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
