import { Eye } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";

export function SecurityWorkflowPreview() {
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
        <Eye size={18} style={{ color: "#0D47A1" }} /> Section 08: User
        Authentication Security Flow
      </h3>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#F8FAFC",
          padding: "16px",
          borderRadius: "12px",
          border: "1px solid #E2E8F0",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {[
          { step: "1. User Login", sub: "Creds Check" },
          { step: "2. Authentication", sub: "BCrypt Match" },
          { step: "3. 2FA Verification", sub: "OTP Challenge" },
          { step: "4. Role Validation", sub: "RBAC Policy" },
          { step: "5. Session Created", sub: "15m Auto Expire" },
          { step: "6. Dashboard Access", sub: "Secure EMR" },
        ].map((st) => (
          <div
            key={st.step}
            style={{ textAlign: "center", flex: 1, minWidth: "100px" }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#0D47A1",
                background: "#E3F2FD",
                padding: "6px 4px",
                borderRadius: "6px",
                marginBottom: "4px",
              }}
            >
              {st.step}
            </div>
            <div style={{ fontSize: "10px", color: "#64748B" }}>
              {st.sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
