import { useState } from "react";
import { ShieldAlert } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export function LoginProtection() {
  void RB;
  const [loginProtection, setLoginProtection] = useState({
    maxFailedAttempts: 5,
    lockDuration: "30 Minutes",
    notifyAdminOnLock: true,
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
        <ShieldAlert size={18} style={{ color: "#EF4444" }} /> Section 04:
        Brute-Force & Lockout Protection
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "16px",
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
            Max Failed Login Attempts
          </label>
          <input
            type="number"
            value={loginProtection.maxFailedAttempts}
            onChange={(e) =>
              setLoginProtection((prev) => ({
                ...prev,
                maxFailedAttempts: parseInt(e.target.value) || 3,
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
            Account Lock Duration
          </label>
          <select
            value={loginProtection.lockDuration}
            onChange={(e) =>
              setLoginProtection((prev) => ({
                ...prev,
                lockDuration: e.target.value,
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
            <option>15 Minutes</option>
            <option>30 Minutes</option>
            <option>1 Hour</option>
            <option>24 Hours</option>
            <option>Manual Admin Unlock Only</option>
          </select>
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
              Notify Admin After Account Lock
            </div>
            <div style={{ fontSize: "10px", color: "#64748B" }}>
              Send instant alert email to Super Admin
            </div>
          </div>
          <input
            type="checkbox"
            checked={loginProtection.notifyAdminOnLock}
            onChange={(e) =>
              setLoginProtection((prev) => ({
                ...prev,
                notifyAdminOnLock: e.target.checked,
              }))
            }
            style={{ accentColor: "#EF4444", cursor: "pointer" }}
          />
        </div>
      </div>
    </div>
  );
}
