import { useState } from "react";
import { Key } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export function PasswordPolicy() {
  void RB;
  const [passPolicy, setPassPolicy] = useState({
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true,
    expiryDays: "90 Days",
    historyCount: "5 Passwords",
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
        <Key size={18} style={{ color: "#009688" }} /> Section 02: Password
        Complexity & Expiry Rules
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        {[
          { label: "Require Uppercase (A-Z)", key: "requireUppercase" },
          { label: "Require Lowercase (a-z)", key: "requireLowercase" },
          { label: "Require Number (0-9)", key: "requireNumber" },
          { label: "Require Symbol (!@#)", key: "requireSpecialChar" },
        ].map((item) => (
          <div
            key={item.key}
            style={{
              background: "#F8FAFC",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #E2E8F0",
              textAlign: "center",
            }}
          >
            <input
              type="checkbox"
              checked={
                passPolicy[item.key as keyof typeof passPolicy] as boolean
              }
              onChange={(e) =>
                setPassPolicy((prev) => ({
                  ...prev,
                  [item.key]: e.target.checked,
                }))
              }
              style={{
                accentColor: "#009688",
                marginBottom: "4px",
                cursor: "pointer",
              }}
            />
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#111827",
                display: "block",
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

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
            Minimum Password Length
          </label>
          <input
            type="number"
            value={passPolicy.minLength}
            onChange={(e) =>
              setPassPolicy((prev) => ({
                ...prev,
                minLength: parseInt(e.target.value) || 8,
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
            Password Expiry Duration
          </label>
          <select
            value={passPolicy.expiryDays}
            onChange={(e) =>
              setPassPolicy((prev) => ({
                ...prev,
                expiryDays: e.target.value,
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
            <option>30 Days</option>
            <option>60 Days</option>
            <option>90 Days</option>
            <option>180 Days</option>
            <option>Never</option>
          </select>
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
            Password History Restriction
          </label>
          <select
            value={passPolicy.historyCount}
            onChange={(e) =>
              setPassPolicy((prev) => ({
                ...prev,
                historyCount: e.target.value,
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
            <option>Remember Last 3 Passwords</option>
            <option>Remember Last 5 Passwords</option>
            <option>Remember Last 10 Passwords</option>
          </select>
        </div>
      </div>
    </div>
  );
}
