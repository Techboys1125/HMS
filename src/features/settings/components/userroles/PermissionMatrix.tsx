import { useState } from "react";
import { Grid } from "lucide-react";
import {
  MATRIX_MODULES,
  MATRIX_ROLES,
  INITIAL_PERMISSIONS,
  type PermissionState,
} from "../../constants/userroles.constants";

const PP = "'Poppins', system-ui, sans-serif";

export function PermissionMatrix() {
  const [permissionState, setPermissionState] =
    useState<PermissionState>(INITIAL_PERMISSIONS);

  const toggleMatrixPermission = (
    role: string,
    module: string,
    perm: "view" | "edit" | "delete" | "approve",
  ) => {
    setPermissionState((prev) => {
      const currentRoleObj = prev[role] || {};
      const currentModObj = currentRoleObj[module] || {
        view: false,
        edit: false,
        delete: false,
        approve: false,
      };
      return {
        ...prev,
        [role]: {
          ...currentRoleObj,
          [module]: {
            ...currentModObj,
            [perm]: !currentModObj[perm],
          },
        },
      };
    });
  };

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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div>
          <h3
            style={{
              fontFamily: PP,
              fontSize: "16px",
              fontWeight: 700,
              color: "#111827",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Grid size={18} style={{ color: "#0D47A1" }} /> Master
            Role-Permission Matrix
          </h3>
          <p
            style={{
              fontSize: "12px",
              color: "#64748B",
              margin: "2px 0 0 0",
            }}
          >
            Configure granular View, Edit, Delete, and Approval permissions
            per role across all 11 HMS core modules.
          </p>
        </div>
        <span
          style={{
            fontSize: "11px",
            color: "#009688",
            fontWeight: 600,
            background: "#E0F2F1",
            padding: "4px 10px",
            borderRadius: "6px",
          }}
        >
          Toggle Interactive
        </span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "12px",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#F8FAFC",
                borderBottom: "2px solid #E5E7EB",
                color: "#475569",
                fontWeight: 700,
              }}
            >
              <th style={{ padding: "10px 12px", textAlign: "left" }}>
                HMS Module
              </th>
              {MATRIX_ROLES.map((role) => (
                <th
                  key={role}
                  style={{
                    padding: "10px 8px",
                    textAlign: "center",
                    minWidth: "100px",
                  }}
                >
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MATRIX_MODULES.map((module) => (
              <tr
                key={module}
                style={{ borderBottom: "1px solid #F1F5F9" }}
              >
                <td
                  style={{
                    padding: "10px 12px",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  {module}
                </td>
                {MATRIX_ROLES.map((role) => {
                  const perm = permissionState[role]?.[module] || {
                    view: false,
                    edit: false,
                    delete: false,
                    approve: false,
                  };
                  return (
                    <td
                      key={role}
                      style={{ padding: "8px 4px", textAlign: "center" }}
                    >
                      <div
                        style={{
                          display: "inline-flex",
                          gap: "4px",
                          background: "#F8FAFC",
                          padding: "4px 6px",
                          borderRadius: "6px",
                          border: "1px solid #E2E8F0",
                        }}
                      >
                        <button
                          onClick={() =>
                            toggleMatrixPermission(role, module, "view")
                          }
                          title="View Permission"
                          style={{
                            border: "none",
                            borderRadius: "4px",
                            padding: "2px 6px",
                            fontSize: "10px",
                            fontWeight: 700,
                            cursor: "pointer",
                            background: perm.view ? "#E8F5E9" : "#FFFFFF",
                            color: perm.view ? "#2E7D32" : "#94A3B8",
                          }}
                        >
                          V
                        </button>
                        <button
                          onClick={() =>
                            toggleMatrixPermission(role, module, "edit")
                          }
                          title="Edit Permission"
                          style={{
                            border: "none",
                            borderRadius: "4px",
                            padding: "2px 6px",
                            fontSize: "10px",
                            fontWeight: 700,
                            cursor: "pointer",
                            background: perm.edit ? "#E3F2FD" : "#FFFFFF",
                            color: perm.edit ? "#0D47A1" : "#94A3B8",
                          }}
                        >
                          E
                        </button>
                        <button
                          onClick={() =>
                            toggleMatrixPermission(role, module, "delete")
                          }
                          title="Delete Permission"
                          style={{
                            border: "none",
                            borderRadius: "4px",
                            padding: "2px 6px",
                            fontSize: "10px",
                            fontWeight: 700,
                            cursor: "pointer",
                            background: perm.delete ? "#FEE2E2" : "#FFFFFF",
                            color: perm.delete ? "#DC2626" : "#94A3B8",
                          }}
                        >
                          D
                        </button>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
