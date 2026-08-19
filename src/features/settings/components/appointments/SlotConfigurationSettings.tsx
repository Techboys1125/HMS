import { useState } from "react";
import { Clock } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export function SlotConfigurationSettings() {
  void RB;
  const [slotConfig, setSlotConfig] = useState({
    defaultDuration: "15 Minutes",
    bufferTime: "5 Minutes",
    maxPatientsPerSlot: 1,
    enableDoubleBooking: false,
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
        <Clock size={18} style={{ color: "#009688" }} /> Section 02:
        Consultation Slot & Duration Parameters
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "16px",
          marginBottom: "16px",
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
            Default Consultation Duration
          </label>
          <select
            value={slotConfig.defaultDuration}
            onChange={(e) =>
              setSlotConfig((prev) => ({
                ...prev,
                defaultDuration: e.target.value,
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
          >
            <option>10 Minutes</option>
            <option>15 Minutes</option>
            <option>20 Minutes</option>
            <option>30 Minutes</option>
            <option>45 Minutes</option>
            <option>60 Minutes</option>
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
            Buffer Time Between Patients
          </label>
          <select
            value={slotConfig.bufferTime}
            onChange={(e) =>
              setSlotConfig((prev) => ({
                ...prev,
                bufferTime: e.target.value,
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
          >
            <option>0 Minutes</option>
            <option>5 Minutes</option>
            <option>10 Minutes</option>
            <option>15 Minutes</option>
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
            Maximum Patients Allowed Per Slot
          </label>
          <input
            type="number"
            value={slotConfig.maxPatientsPerSlot}
            onChange={(e) =>
              setSlotConfig((prev) => ({
                ...prev,
                maxPatientsPerSlot: e.currentTarget.valueAsNumber || 1,
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
        </div>
      </div>

      <div
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
            style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}
          >
            Enable Double Booking Override
          </div>
          <div style={{ fontSize: "11px", color: "#64748B" }}>
            Allows senior doctors to accept urgent emergency patients in
            filled slots
          </div>
        </div>
        <input
          type="checkbox"
          checked={slotConfig.enableDoubleBooking}
          onChange={(e) =>
            setSlotConfig((prev) => ({
              ...prev,
              enableDoubleBooking: e.target.checked,
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
    </div>
  );
}
