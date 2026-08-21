import { Eye, RefreshCw } from "lucide-react";
import { PP } from "../constants/notifications.constants";

export interface CommunicationHeaderProps {
  onPreview: () => void;
  onRefresh: () => void;
}

export function CommunicationHeader({
  onPreview,
  onRefresh,
}: CommunicationHeaderProps) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "16px",
        border: "1px solid #E5E7EB",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      <div>
        <h2
          style={{
            fontFamily: PP,
            fontSize: "18px",
            fontWeight: 700,
            color: "#111827",
            margin: 0,
          }}
        >
          Notification & Communication Configuration
        </h2>
        <p
          style={{
            fontSize: "12px",
            color: "#64748B",
            margin: "2px 0 0 0",
          }}
        >
          API-backed notification rules, templates, and delivery failures only.
        </p>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={onPreview}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            borderRadius: "8px",
            border: "1px solid #E5E7EB",
            background: "#FFFFFF",
            color: "#0D47A1",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Eye size={14} /> Preview Notification
        </button>
        <button
          onClick={onRefresh}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            borderRadius: "8px",
            border: "1px solid #E5E7EB",
            background: "#FFFFFF",
            color: "#64748B",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>
    </div>
  );
}
