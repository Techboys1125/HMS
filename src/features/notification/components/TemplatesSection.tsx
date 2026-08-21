import { Eye } from "lucide-react";
import { PP } from "../constants/notifications.constants";

export interface TemplateRow {
  id: string;
  name: string;
  category: string;
  channel: string;
  status: string;
  lastUpdated: string;
  body?: string;
  priority?: string;
  active?: boolean;
}

export interface TemplatesSectionProps {
  templates: TemplateRow[];
  onViewTemplate: (template: TemplateRow) => void;
}

export function TemplatesSection({
  templates,
  onViewTemplate,
}: TemplatesSectionProps) {
  return (
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
          Master Communication Templates ({templates.length})
        </h3>
        <span style={{ fontSize: "12px", color: "#64748B" }}>
          Standard HTML / Text Specs
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
              <th style={{ padding: "12px 16px" }}>Name</th>
              <th style={{ padding: "12px 16px" }}>Description</th>
              <th style={{ padding: "12px 16px" }}>Status</th>
              <th style={{ padding: "12px 16px" }}>Last Updated</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {templates.map((t) => (
              <tr key={t.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                <td
                  style={{
                    padding: "12px 16px",
                    fontWeight: 700,
                    color: "#0D47A1",
                  }}
                >
                  <div>{t.name}</div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748B",
                      fontWeight: 500,
                    }}
                  >
                    Category: {t.category}
                  </div>
                </td>
                <td style={{ padding: "12px 16px", color: "#475569" }}>
                  Delivery Channel:{" "}
                  <strong style={{ color: "#009688" }}>{t.channel}</strong>
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
                    {t.status}
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    color: "#94A3B8",
                    fontSize: "12px",
                  }}
                >
                  {t.lastUpdated}
                </td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>
                  <button
                    onClick={() => onViewTemplate(t)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "1px solid #0D47A1",
                      background: "#FFFFFF",
                      color: "#0D47A1",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <Eye size={14} /> View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
