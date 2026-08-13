import { useState } from "react";
import { Eye, Lock } from "lucide-react";
import {
  ROLES,
  type RoleItem,
} from "../../constants/userroles.constants";
import { RolesFilterBar } from "./RolesFilterBar";
import { RoleDetailsDrawer } from "./RoleDetailsDrawer";

const PP = "'Poppins', system-ui, sans-serif";

export function RolesTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleType, setSelectedRoleType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedRole, setSelectedRole] = useState<RoleItem | null>(null);

  const filteredRoles = ROLES.filter((role) => {
    const matchesSearch =
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || role.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <RolesFilterBar
        searchTerm={searchTerm}
        selectedRoleType={selectedRoleType}
        selectedStatus={selectedStatus}
        setSearchTerm={setSearchTerm}
        setSelectedRoleType={setSelectedRoleType}
        setSelectedStatus={setSelectedStatus}
      />

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
            Role Definitions Roster ({filteredRoles.length})
          </h3>
          <span style={{ fontSize: "12px", color: "#64748B" }}>
            RBAC Security Protocol v4.2
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
              {filteredRoles.map((r) => (
                <tr
                  key={r.id}
                  style={{
                    borderBottom: "1px solid #F1F5F9",
                    transition: "background 0.15s ease",
                  }}
                >
                  <td
                    style={{
                      padding: "12px 16px",
                      fontWeight: 700,
                      color: "#0D47A1",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {r.isSystem && (
                        <Lock size={12} style={{ color: "#009688" }} />
                      )}
                      {r.name}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#64748B",
                        fontWeight: 500,
                      }}
                    >
                      {r.usersCount.toLocaleString()} Users •{" "}
                      {r.permissionLevel}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      color: "#64748B",
                      maxWidth: "280px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.description}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: "12px",
                        background:
                          r.status === "Active" ? "#E8F5E9" : "#FEF3C7",
                        color:
                          r.status === "Active" ? "#2E7D32" : "#B45309",
                      }}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      color: "#94A3B8",
                      fontSize: "12px",
                    }}
                  >
                    {r.lastUpdated}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <button
                      onClick={() => setSelectedRole(r)}
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

      {selectedRole && (
        <RoleDetailsDrawer
          role={selectedRole}
          onClose={() => setSelectedRole(null)}
        />
      )}
    </>
  );
}
