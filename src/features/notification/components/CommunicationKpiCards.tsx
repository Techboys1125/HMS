import { Bell, Mail, AlertTriangle } from "lucide-react";
import { PP } from "../constants/notifications.constants";

export interface CommunicationKpiCardsProps {
  rulesCount: number;
  templatesCount: number;
  failuresCount: number;
}

export function CommunicationKpiCards({
  rulesCount,
  templatesCount,
  failuresCount,
}: CommunicationKpiCardsProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
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
            Enabled Rules
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
          {rulesCount}
        </div>
        <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "6px" }}>
          API rules currently enabled
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
          {templatesCount}
        </div>
        <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "6px" }}>
          Templates returned by the API
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
            Delivery Failures
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
            <AlertTriangle size={18} style={{ color: "#B45309" }} />
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
          {failuresCount}
        </div>
        <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "6px" }}>
          Latest backend delivery failures
        </div>
      </div>
    </div>
  );
}
