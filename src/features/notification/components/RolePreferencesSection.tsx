import { Sliders } from "lucide-react";
import { PP, ALL_ROLES, PREFERENCE_COLUMNS } from "../constants/notifications.constants";

export interface RolePreferencesSectionProps {
  rolePreferences: Record<string, Record<string, boolean>>;
  onToggleRolePreference: (role: string, col: string) => void;
}

export function RolePreferencesSection({
  rolePreferences,
  onToggleRolePreference,
}: RolePreferencesSectionProps) {
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
        <Sliders size={18} style={{ color: "#009688" }} /> Section 02:
        Role-Based Delivery Preferences Matrix
      </h3>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "12px",
            textAlign: "left",
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
              <th style={{ padding: "10px 12px" }}>Role</th>
              {PREFERENCE_COLUMNS.map((col) => (
                <th key={col.key} style={{ padding: "10px 8px", textAlign: "center" }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALL_ROLES.map((role) => {
              const prefs = rolePreferences[role] || {};
              return (
                <tr key={role} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    {role}
                  </td>
                  {PREFERENCE_COLUMNS.map((col) => (
                    <td key={col.key} style={{ padding: "8px", textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={!!prefs[col.key]}
                        onChange={() => onToggleRolePreference(role, col.key)}
                        style={{
                          accentColor: "#009688",
                          width: "16px",
                          height: "16px",
                          cursor: "pointer",
                        }}
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
