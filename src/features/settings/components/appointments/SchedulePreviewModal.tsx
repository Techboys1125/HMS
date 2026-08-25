import { X } from "lucide-react";
import { PREVIEW_TIME_SLOTS } from "../../constants/appointments.constants";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export function SchedulePreviewModal({ onClose }: { onClose: () => void }) {
  void RB;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          maxWidth: "650px",
          width: "100%",
          padding: "24px",
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
            borderBottom: "1px solid #E5E7EB",
            paddingBottom: "12px",
          }}
        >
          <h3
            style={{
              fontFamily: PP,
              fontSize: "16px",
              fontWeight: 700,
              margin: 0,
              color: "#111827",
            }}
          >
            Operational OPD Slot Preview (15-Min Intervals)
          </h3>
          <button aria-label="Close"
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#64748B",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "8px",
            maxHeight: "300px",
            overflowY: "auto",
            padding: "8px",
          }}
        >
          {PREVIEW_TIME_SLOTS.map((time, idx) => (
            <div
              key={time}
              style={{
                background: idx % 3 === 0 ? "#E3F2FD" : "#FFFFFF",
                border: "1px solid #CBD5E1",
                padding: "8px",
                borderRadius: "6px",
                textTransform: "uppercase",
                textAlign: "center",
                fontSize: "11px",
                fontWeight: 600,
                color: idx % 3 === 0 ? "#0D47A1" : "#475569",
              }}
            >
              {time} <br />
              <span style={{ fontSize: "9px", fontWeight: 400 }}>
                {idx % 3 === 0 ? "Booked" : "Available"}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "16px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              background: "#0D47A1",
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
