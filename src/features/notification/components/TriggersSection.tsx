import { AlertCircle } from "lucide-react";
import { PP, DEFAULT_COMM_RULES } from "../constants/notifications.constants";

export interface TriggersSectionProps {
  commRules: Record<string, boolean>;
  onToggleRule: (key: string, enabled: boolean) => void;
  readOnly?: boolean;
}

export function TriggersSection({ commRules, onToggleRule, readOnly }: TriggersSectionProps) {
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
        <AlertCircle size={18} style={{ color: "#009688" }} /> Section 05:
        Automated Communication Triggers
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
        }}
      >
        {DEFAULT_COMM_RULES.map((item) => (
          <div
            key={item.key}
            style={{
              background: "#F8FAFC",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                {item.label}
              </div>
              <div style={{ fontSize: "11px", color: "#64748B" }}>
                {item.sub}
              </div>
            </div>
            <input
              type="checkbox"
              checked={!!commRules[item.key]}
              onChange={(e) => onToggleRule(item.key, e.target.checked)}
              disabled={readOnly}
              style={{
                accentColor: "#009688",
                width: "18px",
                height: "18px",
                cursor: readOnly ? "not-allowed" : "pointer",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
