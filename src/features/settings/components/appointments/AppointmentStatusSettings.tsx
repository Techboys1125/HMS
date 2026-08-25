import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import {
  DEFAULT_STATUSES,
  type AppointmentStatus,
} from "../../constants/appointments.constants";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export function AppointmentStatusSettings() {
  void RB;
  const [statuses, setStatuses] =
    useState<AppointmentStatus[]>(DEFAULT_STATUSES);

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
        <CheckCircle2 size={18} style={{ color: "#009688" }} /> Section 06:
        Appointment Status Lifecycle Rules
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
        }}
      >
        {statuses.map((st, i) => (
          <div
            key={st.id}
            style={{
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              padding: "12px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: st.color,
                }}
              />
              <input
                aria-label="Input field"
                type="text"
                value={st.label}
                onChange={(e) => {
                  const val = e.target.value;
                  const next = statuses.map((st, idx) =>
                    idx === i ? { ...st, label: val } : st,
                  );
                  setStatuses(next);
                }}
                style={{
                  border: "1px solid #D1D5DB",
                  borderRadius: "6px",
                  padding: "4px 8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#111827",
                  width: "120px",
                }}
              />
            </div>
            <input
              aria-label="Toggle option"
              type="checkbox"
              checked={st.visible}
              onChange={(e) => {
                const checked = e.target.checked;
                const next = statuses.map((st, idx) =>
                  idx === i ? { ...st, visible: checked } : st,
                );
                setStatuses(next);
              }}
              style={{ accentColor: "#009688", cursor: "pointer" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
