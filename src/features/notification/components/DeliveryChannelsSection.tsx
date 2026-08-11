import { Bell } from "lucide-react";
import type { CommunicationChannel } from "../types/notifications.types";
import { PP } from "../constants/notifications.constants";

export interface DeliveryChannelsSectionProps {
  channels: CommunicationChannel[];
  onToggleChannel: (id: string, field: "enabled" | "isDefault") => void;
}

export function DeliveryChannelsSection({
  channels,
  onToggleChannel,
}: DeliveryChannelsSectionProps) {
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
        <Bell size={18} style={{ color: "#0D47A1" }} /> Section 01: Delivery
        Channels Configuration
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "14px",
        }}
      >
        {channels.map((ch) => {
          const IconC = ch.icon;
          return (
            <div
              key={ch.id}
              style={{
                background: "#F8FAFC",
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                padding: "14px",
                opacity: ch.enabled ? 1 : 0.6,
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: "#E3F2FD",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconC size={18} style={{ color: "#0D47A1" }} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#111827",
                      }}
                    >
                      {ch.name}
                    </div>
                    {ch.isDefault && (
                      <span
                        style={{
                          fontSize: "10px",
                          color: "#009688",
                          fontWeight: 600,
                        }}
                      >
                        Default Channel
                      </span>
                    )}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={ch.enabled}
                  onChange={() => onToggleChannel(ch.id, "enabled")}
                  style={{
                    accentColor: "#0D47A1",
                    width: "18px",
                    height: "18px",
                    cursor: "pointer",
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: "11px",
                  color: "#64748B",
                  margin: "0 0 12px 0",
                }}
              >
                {ch.desc}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderTop: "1px solid #E2E8F0",
                  paddingTop: "8px",
                  fontSize: "11px",
                }}
              >
                <span style={{ color: "#64748B" }}>
                  Set as Primary Channel
                </span>
                <input
                  type="radio"
                  name="primaryChannel"
                  checked={ch.isDefault}
                  onChange={() => onToggleChannel(ch.id, "isDefault")}
                  style={{ accentColor: "#0D47A1", cursor: "pointer" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
