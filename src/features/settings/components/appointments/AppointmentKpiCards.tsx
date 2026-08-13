import { Clock, Calendar, Sliders, AlertCircle } from "lucide-react";
import { DEFAULT_HOLIDAYS } from "../../constants/appointments.constants";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export function AppointmentKpiCards() {
  void RB;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E5E7EB",
          padding: "18px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
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
          <span
            style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}
          >
            Appointment Slots
          </span>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "#E3F2FD",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Clock size={18} style={{ color: "#0D47A1" }} />
          </div>
        </div>
        <div
          style={{
            fontFamily: PP,
            fontSize: "24px",
            fontWeight: 800,
            color: "#111827",
          }}
        >
          15 Mins
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "6px",
          }}
        >
          <span style={{ fontSize: "11px", color: "#94A3B8" }}>
            Default Duration
          </span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: "#2E7D32",
              background: "#E8F5E9",
              padding: "1px 6px",
              borderRadius: "4px",
            }}
          >
            Configured
          </span>
        </div>
      </div>

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E5E7EB",
          padding: "18px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
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
          <span
            style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}
          >
            Working Shifts
          </span>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "#E0F2F1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Calendar size={18} style={{ color: "#009688" }} />
          </div>
        </div>
        <div
          style={{
            fontFamily: PP,
            fontSize: "24px",
            fontWeight: 800,
            color: "#111827",
          }}
        >
          6 Days/Wk
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "6px",
          }}
        >
          <span style={{ fontSize: "11px", color: "#94A3B8" }}>
            OPD Schedule
          </span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: "#009688",
              background: "#E0F2F1",
              padding: "1px 6px",
              borderRadius: "4px",
            }}
          >
            Active
          </span>
        </div>
      </div>

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E5E7EB",
          padding: "18px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
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
          <span
            style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}
          >
            Queue Rules
          </span>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "#E8F5E9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sliders size={18} style={{ color: "#2E7D32" }} />
          </div>
        </div>
        <div
          style={{
            fontFamily: PP,
            fontSize: "24px",
            fontWeight: 800,
            color: "#111827",
          }}
        >
          Auto Token
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "6px",
          }}
        >
          <span style={{ fontSize: "11px", color: "#94A3B8" }}>
            Prefix OPD-
          </span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: "#2E7D32",
              background: "#E8F5E9",
              padding: "1px 6px",
              borderRadius: "4px",
            }}
          >
            Enabled
          </span>
        </div>
      </div>

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E5E7EB",
          padding: "18px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
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
          <span
            style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}
          >
            Holiday Calendar
          </span>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "#FEF3C7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AlertCircle size={18} style={{ color: "#B45309" }} />
          </div>
        </div>
        <div
          style={{
            fontFamily: PP,
            fontSize: "24px",
            fontWeight: 800,
            color: "#111827",
          }}
        >
          {DEFAULT_HOLIDAYS.length} Dates
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "6px",
          }}
        >
          <span style={{ fontSize: "11px", color: "#94A3B8" }}>
            Official Exclusions
          </span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: "#B45309",
              background: "#FEF3C7",
              padding: "1px 6px",
              borderRadius: "4px",
            }}
          >
            Updated
          </span>
        </div>
      </div>
    </div>
  );
}
