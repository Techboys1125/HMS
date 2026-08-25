import { useState } from "react";
import { Lock } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export function AuthenticationSettings() {
  void RB;
  const [authConfig, setAuthConfig] = useState({
    enable2FA: true,
    requireEmailVerification: true,
    requirePasswordChangeFirstLogin: true,
    allowMultipleDevices: true,
    allowRememberMe: false,
    enableCaptchaFailedLogins: true,
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
        <Lock size={18} style={{ color: "#0D47A1" }} /> Section 01:
        Authentication & Multi-Factor Security
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "14px",
        }}
      >
        {[
          {
            label: "Enable Two-Factor Authentication (2FA)",
            sub: "Require SMS / Authenticator app OTP for all staff accounts",
            key: "enable2FA",
          },
          {
            label: "Require Official Email Verification",
            sub: "Mandatory email token verification during user onboarding",
            key: "requireEmailVerification",
          },
          {
            label: "Require Password Change on First Login",
            sub: "Forces staff to replace temporary admin passwords",
            key: "requirePasswordChangeFirstLogin",
          },
          {
            label: "Allow Multiple Concurrent Device Logins",
            sub: "Permits single user session across mobile & desktop",
            key: "allowMultipleDevices",
          },
          {
            label: 'Allow "Remember Me" Option',
            sub: "Permits persistent browser login tokens for 14 days",
            key: "allowRememberMe",
          },
          {
            label: "Enable CAPTCHA After Failed Logins",
            sub: "Triggers Google reCAPTCHA after 3 consecutive errors",
            key: "enableCaptchaFailedLogins",
          },
        ].map((item) => (
          <div
            key={item.key}
            style={{
              background: "#F8FAFC",
              padding: "12px 14px",
              borderRadius: "10px",
              border: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                {item.label}
              </div>
              <div style={{ fontSize: "11px", color: "#64748B" }}>
                {item.sub}
              </div>
            </div>
            <input aria-label="Toggle option"
              type="checkbox"
              checked={authConfig[item.key as keyof typeof authConfig]}
              onChange={(e) =>
                setAuthConfig((prev) => ({
                  ...prev,
                  [item.key]: e.target.checked,
                }))
              }
              style={{
                accentColor: "#0D47A1",
                width: "18px",
                height: "18px",
                cursor: "pointer",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
