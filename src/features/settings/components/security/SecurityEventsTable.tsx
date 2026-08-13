import { useState } from "react";
import {
  SECURITY_EVENTS,
  type SecurityEvent,
} from "../../constants/security.constants";
import { EventDetailsModal } from "./EventDetailsModal";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export function SecurityEventsTable() {
  void RB;
  const securityEvents = SECURITY_EVENTS;
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(
    null,
  );

  return (
    <>
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #E5E7EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h3
            style={{
              fontFamily: PP,
              fontSize: "15px",
              fontWeight: 700,
              color: "#111827",
              margin: 0,
            }}
          >
            Recent Security Audit Events ({securityEvents.length})
          </h3>
          <span style={{ fontSize: "12px", color: "#64748B" }}>
            SIEM Real-Time Stream
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: "13px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#F8FAFC",
                  borderBottom: "1px solid #E5E7EB",
                  color: "#475569",
                  fontWeight: 600,
                }}
              >
                <th style={{ padding: "12px 16px" }}>Event</th>
                <th style={{ padding: "12px 16px" }}>Category</th>
                <th style={{ padding: "12px 16px" }}>Severity</th>
                <th style={{ padding: "12px 16px" }}>Triggered By</th>
                <th style={{ padding: "12px 16px" }}>Date & Time</th>
                <th style={{ padding: "12px 16px" }}>Status</th>
                <th style={{ padding: "12px 16px", textAlign: "right" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {securityEvents.map((ev) => (
                <tr key={ev.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontWeight: 700,
                      color: "#0D47A1",
                    }}
                  >
                    {ev.event}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#475569" }}>
                    {ev.category}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: "4px",
                        background:
                          ev.severity === "Critical" || ev.severity === "High"
                            ? "#FEE2E2"
                            : "#FEF3C7",
                        color:
                          ev.severity === "Critical" || ev.severity === "High"
                            ? "#DC2626"
                            : "#B45309",
                      }}
                    >
                      {ev.severity}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      color: "#111827",
                      fontWeight: 500,
                    }}
                  >
                    {ev.triggeredBy}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      color: "#94A3B8",
                      fontSize: "12px",
                    }}
                  >
                    {ev.datetime}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: "12px",
                        background: "#E8F5E9",
                        color: "#2E7D32",
                      }}
                    >
                      {ev.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <button
                      onClick={() => setSelectedEvent(ev)}
                      style={{
                        border: "none",
                        background: "transparent",
                        color: "#0D47A1",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "12px",
                      }}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  );
}
