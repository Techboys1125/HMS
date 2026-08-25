import { useState } from "react";
import { Edit2, X } from "lucide-react";
import type { RoleItem } from "../../constants/userroles.constants";

const PP = "'Poppins', system-ui, sans-serif";

interface RoleDetailsDrawerProps {
  role: RoleItem;
  onClose: () => void;
}

export function RoleDetailsDrawer({ role, onClose }: RoleDetailsDrawerProps) {
  const [isRoleEditMode, setIsRoleEditMode] = useState(false);

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
        transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
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
        {/* DRAWER HEADER */}
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
                {role.name}
              </h3>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: "12px",
                  background: role.status === "Active" ? "#E8F5E9" : "#FEF3C7",
                  color: role.status === "Active" ? "#2E7D32" : "#B45309",
                }}
              >
                {role.status}
              </span>
            </div>
            <p
              style={{
                fontSize: "12px",
                color: "#64748B",
                margin: "4px 0 0 0",
              }}
            >
              Access Level: <strong>{role.permissionLevel}</strong> •{" "}
              {role.usersCount.toLocaleString()} Accounts
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => setIsRoleEditMode(!isRoleEditMode)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "6px 14px",
                borderRadius: "6px",
                border: "1px solid #009688",
                background: isRoleEditMode ? "#009688" : "#FFFFFF",
                color: isRoleEditMode ? "#FFFFFF" : "#009688",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background-color 0.2s ease, border-color 0.2s ease",
              }}
            >
              <Edit2 size={14} /> {isRoleEditMode ? "Cancel Edit" : "Edit"}
            </button>
            <button aria-label="Close"
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

        {/* DRAWER CONTENT */}
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
          {/* Group 1: General Information */}
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
                marginBottom: "12px",
              }}
            >
              <div>
                <span
                  style={{
                    display: "block",
                    color: "#64748B",
                    fontSize: "11px",
                    marginBottom: "2px",
                  }}
                >
                  Role Title
                </span>
                {isRoleEditMode ? (
                  <input aria-label="Input field"
                    type="text"
                    defaultValue={role.name}
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
                    {role.name}
                  </span>
                )}
              </div>
              <div>
                <span
                  style={{
                    display: "block",
                    color: "#64748B",
                    fontSize: "11px",
                    marginBottom: "2px",
                  }}
                >
                  Permission Tier
                </span>
                {isRoleEditMode ? (
                  <select aria-label="Select option"
                    defaultValue={role.permissionLevel}
                    style={{
                      width: "100%",
                      padding: "6px 8px",
                      borderRadius: "6px",
                      border: "1px solid #CBD5E1",
                      fontSize: "12px",
                      background: "#FFFFFF",
                    }}
                  >
                    <option>Full Access</option>
                    <option>Clinical Access</option>
                    <option>Operational</option>
                    <option>Financial</option>
                  </select>
                ) : (
                  <span style={{ fontWeight: 600, color: "#009688" }}>
                    {role.permissionLevel}
                  </span>
                )}
              </div>
            </div>
            <div>
              <span
                style={{
                  display: "block",
                  color: "#64748B",
                  fontSize: "11px",
                  marginBottom: "2px",
                }}
              >
                Role Description
              </span>
              {isRoleEditMode ? (
                <textarea aria-label="Text input"
                  rows={2}
                  defaultValue={role.description}
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
                <p
                  style={{
                    fontSize: "12px",
                    color: "#475569",
                    margin: 0,
                    lineHeight: "1.4",
                  }}
                >
                  {role.description}
                </p>
              )}
            </div>
          </div>

          {/* Group 2: Configuration Details */}
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
              Configuration Details
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                fontSize: "12px",
                marginBottom: "12px",
              }}
            >
              <div>
                <span
                  style={{
                    display: "block",
                    color: "#64748B",
                    fontSize: "11px",
                    marginBottom: "2px",
                  }}
                >
                  Default Dashboard
                </span>
                {isRoleEditMode ? (
                  <input aria-label="Input field"
                    type="text"
                    defaultValue={role.defaultDashboard}
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
                    {role.defaultDashboard}
                  </span>
                )}
              </div>
              <div>
                <span
                  style={{
                    color: "#64748B",
                    display: "block",
                    fontSize: "11px",
                  }}
                >
                  Created Date
                </span>
                <span style={{ color: "#475569" }}>{role.createdDate}</span>
              </div>
            </div>
            <div>
              <span
                style={{
                  display: "block",
                  color: "#64748B",
                  fontSize: "11px",
                  marginBottom: "4px",
                }}
              >
                Accessible System Modules ({role.modules.length})
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {role.modules.map((m) => (
                  <span
                    key={m}
                    style={{
                      fontSize: "11px",
                      background: "#E3F2FD",
                      color: "#0D47A1",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontWeight: 600,
                    }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Group 3: Related Statistics */}
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
                  Active User Accounts
                </span>
                <span style={{ fontWeight: 700, color: "#111827" }}>
                  {role.usersCount.toLocaleString()} Accounts
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
                  System Protected
                </span>
                <span
                  style={{
                    fontWeight: 600,
                    color: role.isSystem ? "#2E7D32" : "#64748B",
                  }}
                >
                  {role.isSystem ? "Yes (Built-in)" : "No (Custom)"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* DRAWER STICKY FOOTER */}
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
          {isRoleEditMode && (
            <button
              onClick={onClose}
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
