import { Bell, Mail, Sliders, CheckCircle2 } from "lucide-react";
import { PP } from "../constants/notifications.constants";

export interface CommunicationKpiCardsProps {
  channelsCount: number;
  templatesCount: number;
}

export function CommunicationKpiCards({
  channelsCount,
  templatesCount,
}: CommunicationKpiCardsProps) {
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
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}>
            Notification Channels
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
            <Bell size={18} style={{ color: "#0D47A1" }} />
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
          {channelsCount} Active
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
            In-App, Email, SMS, Push
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
            Operational
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
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}>
            Active Templates
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
            <Mail size={18} style={{ color: "#009688" }} />
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
          {templatesCount} Templates
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
            HTML & Text Standard
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
            Ready
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
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}>
            Reminder Rules
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
          Auto Cron
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
            24h & 3d Lead Time
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
            Automated
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
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}>
            Delivery Rate
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
            <CheckCircle2 size={18} style={{ color: "#B45309" }} />
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
          99.8%
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
            Success Delivery
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
            Optimal
          </span>
        </div>
      </div>
    </div>
  );
}
