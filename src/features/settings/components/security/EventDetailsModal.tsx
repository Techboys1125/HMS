import { X } from "lucide-react";
import type { SecurityEvent } from "../../constants/security.constants";

const PP = "'Poppins', system-ui, sans-serif";

interface EventDetailsModalProps {
  event: SecurityEvent;
  onClose: () => void;
}

export function EventDetailsModal({ event, onClose }: EventDetailsModalProps) {
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
          maxWidth: "500px",
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
            Security Audit Log Details
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
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            fontSize: "13px",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "11px",
                color: "#64748B",
                display: "block",
              }}
            >
              Event Name
            </span>
            <span
              style={{
                fontFamily: PP,
                fontSize: "15px",
                fontWeight: 700,
                color: "#0D47A1",
              }}
            >
              {event.event}
            </span>
          </div>
          <div>
            <span
              style={{
                fontSize: "11px",
                color: "#64748B",
                display: "block",
              }}
            >
              Triggered By / Source IP
            </span>
            <span style={{ fontWeight: 600, color: "#111827" }}>
              {event.triggeredBy}
            </span>
          </div>
          <div>
            <span
              style={{
                fontSize: "11px",
                color: "#64748B",
                display: "block",
              }}
            >
              Category & Severity
            </span>
            <span style={{ fontWeight: 600, color: "#009688" }}>
              {event.category} • {event.severity}
            </span>
          </div>
          <div>
            <span
              style={{
                fontSize: "11px",
                color: "#64748B",
                display: "block",
              }}
            >
              Timestamp
            </span>
            <span style={{ color: "#475569" }}>{event.datetime}</span>
          </div>
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
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
