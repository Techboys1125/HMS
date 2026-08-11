import { Bell, X } from "lucide-react";
import { PP } from "../constants/notifications.constants";

export interface PreviewNotificationModalProps {
  open: boolean;
  onClose: () => void;
  onSendTest: () => void;
  sending?: boolean;
  canSendTest?: boolean;
}

export function PreviewNotificationModal({
  open,
  onClose,
  onSendTest,
  sending,
  canSendTest,
}: PreviewNotificationModalProps) {
  if (!open) return null;

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
          maxWidth: "550px",
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
            Sample Notification Dispatch Preview
          </h3>
          <button
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
            background: "#F8FAFC",
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #E2E8F0",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                background: "#0D47A1",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Bell size={14} />
            </div>
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                St. Jude HMS - Appointment Reminder
              </div>
              <div style={{ fontSize: "10px", color: "#64748B" }}>
                To: patient.mitchell@example.com
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#374151",
              lineHeight: "1.5",
              background: "#FFFFFF",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
            }}
          >
            <p style={{ margin: "0 0 8px 0", fontWeight: 600 }}>
              Dear Sarah Mitchell,
            </p>
            <p style={{ margin: "0 0 8px 0" }}>
              This is an automated reminder that your OPD Cardiology appointment
              with <strong>Dr. Arjun Mehta</strong> is scheduled for{" "}
              <strong>Tomorrow at 09:30 AM</strong>.
            </p>
            <p style={{ margin: 0, fontSize: "11px", color: "#64748B" }}>
              Token Number: <strong>OPD-102</strong> | Consultation Room:{" "}
              <strong>Suite 104</strong>
            </p>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          {canSendTest && (
            <button
              onClick={onSendTest}
              disabled={sending}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid #009688",
                background: "#FFFFFF",
                color: "#009688",
                fontWeight: 600,
                fontSize: "13px",
                cursor: "pointer",
                opacity: sending ? 0.6 : 1,
              }}
            >
              {sending ? "Sending Test..." : "Send Test Notification"}
            </button>
          )}
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
