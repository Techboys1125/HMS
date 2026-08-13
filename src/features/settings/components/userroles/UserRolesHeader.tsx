import { useState } from "react";
import { RefreshCw, Download, Plus } from "lucide-react";
import { CreateRoleModal } from "./CreateRoleModal";

const PP = "'Poppins', system-ui, sans-serif";

export function UserRolesHeader() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
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
            User Roles & Permissions Configuration
          </h2>
          <p
            style={{ fontSize: "12px", color: "#64748B", margin: "2px 0 0 0" }}
          >
            Manage access permissions, module visibility, and role-based
            privileges for every Hospital Management System user.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => {}}
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
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            onClick={() => {}}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              background: "#FFFFFF",
              color: "#009688",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Download size={14} /> Export
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 18px",
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
            <Plus size={14} /> Create Role
          </button>
        </div>
      </div>

      {isCreateModalOpen && (
        <CreateRoleModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </>
  );
}
