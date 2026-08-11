import { Edit2, X } from "lucide-react";
import type { TemplateRow } from "./TemplatesSection";
import { PP } from "../constants/notifications.constants";

export interface TemplateDetailsDrawerProps {
  template: TemplateRow | null;
  isEditMode: boolean;
  readOnly?: boolean;
  onToggleEdit: () => void;
  onClose: () => void;
  onSaveChanges: () => void;
  savePending?: boolean;
}

export function TemplateDetailsDrawer({
  template,
  isEditMode,
  readOnly,
  onToggleEdit,
  onClose,
  onSaveChanges,
  savePending,
}: TemplateDetailsDrawerProps) {
  if (!template) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.4)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "flex-end",
        zIndex: 100,
        transition: "all 0.3s ease-in-out",
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          width: "540px",
          height: "100%",
          boxSizing: "border-box",
          boxShadow: "-8px 0 24px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          animation: "slideInRight 0.3s ease-out",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #E5E7EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#F8FAFC",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h3
                style={{
                  fontFamily: PP,
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#111827",
                  margin: 0,
                }}
              >
                {template.name}
              </h3>
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
                {template.status}
              </span>
            </div>
            <p
              style={{
                fontSize: "12px",
                color: "#64748B",
                margin: "4px 0 0 0",
              }}
            >
              Category: <strong>{template.category}</strong> • Channel:{" "}
              {template.channel}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {!readOnly && (
              <button
                onClick={onToggleEdit}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  border: "1px solid #009688",
                  background: isEditMode ? "#009688" : "#FFFFFF",
                  color: isEditMode ? "#FFFFFF" : "#009688",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <Edit2 size={14} /> {isEditMode ? "Cancel Edit" : "Edit"}
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "#64748B",
                padding: "4px",
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div
          style={{
            padding: "24px",
            overflowY: "auto",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              background: "#F8FAFC",
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              padding: "16px",
            }}
          >
            <h4
              style={{
                fontFamily: PP,
                fontSize: "13px",
                fontWeight: 700,
                color: "#0D47A1",
                margin: "0 0 12px 0",
              }}
            >
              General Information
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                fontSize: "12px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    color: "#64748B",
                    fontSize: "11px",
                    marginBottom: "2px",
                  }}
                >
                  Template Name
                </label>
                {isEditMode ? (
                  <input
                    type="text"
                    defaultValue={template.name}
                    style={{
                      width: "100%",
                      padding: "6px 8px",
                      borderRadius: "6px",
                      border: "1px solid #CBD5E1",
                      fontSize: "12px",
                    }}
                  />
                ) : (
                  <span style={{ fontWeight: 600, color: "#111827" }}>
                    {template.name}
                  </span>
                )}
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    color: "#64748B",
                    fontSize: "11px",
                    marginBottom: "2px",
                  }}
                >
                  Category
                </label>
                {isEditMode ? (
                  <input
                    type="text"
                    defaultValue={template.category}
                    style={{
                      width: "100%",
                      padding: "6px 8px",
                      borderRadius: "6px",
                      border: "1px solid #CBD5E1",
                      fontSize: "12px",
                    }}
                  />
                ) : (
                  <span style={{ fontWeight: 600, color: "#009688" }}>
                    {template.category}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#F8FAFC",
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              padding: "16px",
            }}
          >
            <h4
              style={{
                fontFamily: PP,
                fontSize: "13px",
                fontWeight: 700,
                color: "#0D47A1",
                margin: "0 0 12px 0",
              }}
            >
              Configuration & Content Payload
            </h4>
            <div style={{ fontSize: "12px", marginBottom: "12px" }}>
              <label
                style={{
                  display: "block",
                  color: "#64748B",
                  fontSize: "11px",
                  marginBottom: "2px",
                }}
              >
                Delivery Channel Scope
              </label>
              {isEditMode ? (
                <input
                  type="text"
                  defaultValue={template.channel}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    borderRadius: "6px",
                    border: "1px solid #CBD5E1",
                    fontSize: "12px",
                  }}
                />
              ) : (
                <span style={{ fontWeight: 600, color: "#111827" }}>
                  {template.channel}
                </span>
              )}
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  color: "#64748B",
                  fontSize: "11px",
                  marginBottom: "2px",
                }}
              >
                Message Body Preview
              </label>
              {isEditMode ? (
                <textarea
                  rows={4}
                  defaultValue={`Dear {{patient_name}}, your appointment with {{doctor_name}} is confirmed for {{time}} at Room {{room}}.`}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #CBD5E1",
                    fontSize: "12px",
                    boxSizing: "border-box",
                  }}
                />
              ) : (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#374151",
                    background: "#FFFFFF",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #E2E8F0",
                    lineHeight: "1.5",
                  }}
                >
                  Dear <strong>Sarah Mitchell</strong>, your OPD appointment
                  with <strong>Dr. Arjun Mehta</strong> is scheduled for{" "}
                  <strong>Tomorrow at 09:30 AM</strong>. Room:{" "}
                  <strong>Suite 104</strong>.
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              background: "#F8FAFC",
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              padding: "16px",
            }}
          >
            <h4
              style={{
                fontFamily: PP,
                fontSize: "13px",
                fontWeight: 700,
                color: "#0D47A1",
                margin: "0 0 12px 0",
              }}
            >
              Related Statistics
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                fontSize: "12px",
              }}
            >
              <div>
                <span
                  style={{
                    color: "#64748B",
                    display: "block",
                    fontSize: "11px",
                  }}
                >
                  Last Updated
                </span>
                <span style={{ color: "#475569" }}>
                  {template.lastUpdated}
                </span>
              </div>
              <div>
                <span
                  style={{
                    color: "#64748B",
                    display: "block",
                    fontSize: "11px",
                  }}
                >
                  Dispatch Success
                </span>
                <span style={{ fontWeight: 700, color: "#2E7D32" }}>
                  99.8% Rate
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #E5E7EB",
            background: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              background: "#FFFFFF",
              color: "#64748B",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          {isEditMode && (
            <button
              onClick={onSaveChanges}
              disabled={savePending}
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                border: "none",
                background: "#0D47A1",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(13,71,161,0.2)",
                opacity: savePending ? 0.7 : 1,
              }}
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
