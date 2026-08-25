import { useState } from "react";
import { Calendar } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export function GeneralAppointmentSettings() {
  void RB;
  const [generalConfig, setGeneralConfig] = useState({
    enableOnlineBooking: true,
    approvalRequired: true,
    allowWalkIn: true,
    allowSameDay: true,
    allowFutureBooking: true,
    maxAdvanceBookingDays: 30,
    minAdvanceBookingHours: 2,
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
        <Calendar size={18} style={{ color: "#0D47A1" }} /> Section 01: General
        Appointment Rules
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        {[
          {
            label: "Enable Online Appointment Booking",
            sub: "Allow patients to book via Patient Portal & Mobile App",
            key: "enableOnlineBooking",
          },
          {
            label: "Appointment Approval Required",
            sub: "Staff must confirm pending online booking requests",
            key: "approvalRequired",
          },
          {
            label: "Allow Walk-in Registration",
            sub: "Enable reception desk counter walk-in tokens",
            key: "allowWalkIn",
          },
          {
            label: "Allow Same-Day Appointment",
            sub: "Permit same-day slot bookings up to minimum hours",
            key: "allowSameDay",
          },
          {
            label: "Allow Future Advance Booking",
            sub: "Patients can schedule appointments in advance",
            key: "allowFutureBooking",
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
            <input
              aria-label="Toggle option"
              type="checkbox"
              checked={
                (generalConfig as unknown as Record<string, boolean>)[item.key]
              }
              onChange={(e) =>
                setGeneralConfig((prev) => ({
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
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
            Maximum Advance Booking Limit (Days)
            <input
              aria-label="Input field"
              type="number"
              value={generalConfig.maxAdvanceBookingDays}
              onChange={(e) =>
                setGeneralConfig((prev) => ({
                  ...prev,
                  maxAdvanceBookingDays: e.currentTarget.valueAsNumber || 0,
                }))
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #D1D5DB",
                fontSize: "13px",
                boxSizing: "border-box",
              }}
            />
          </span>
        </div>
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
            Minimum Advance Booking Lead Time (Hours)
            <input
              aria-label="Input field"
              type="number"
              value={generalConfig.minAdvanceBookingHours}
              onChange={(e) =>
                setGeneralConfig((prev) => ({
                  ...prev,
                  minAdvanceBookingHours: e.currentTarget.valueAsNumber || 0,
                }))
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #D1D5DB",
                fontSize: "13px",
                boxSizing: "border-box",
              }}
            />
          </span>
        </div>
      </div>
    </div>
  );
}
