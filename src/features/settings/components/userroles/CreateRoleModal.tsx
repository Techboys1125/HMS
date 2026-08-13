import { X } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

interface CreateRoleModalProps {
  onClose: () => void;
}

export function CreateRoleModal({ onClose }: CreateRoleModalProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          maxWidth: "500px",
          width: "100%",
          padding: "24px",
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
            borderBottom: "1px solid #E5E7EB",
            paddingBottom: "12px",
          }}
        >
          <h3
            style={{
              fontFamily: PP,
              fontSize: "16px",
              fontWeight: 700,
              margin: 0,
              color: "#111827",
            }}
          >
            Create Custom Role Definition
          </h3>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#64748B",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "4px",
              }}
            >
              Role Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Clinical Research Coordinator"
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #D1D5DB",
                fontSize: "13px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "4px",
              }}
            >
              Role Description *
            </label>
            <textarea
              rows={3}
              placeholder="Describe duties and permission scope..."
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #D1D5DB",
                fontSize: "13px",
                boxSizing: "border-box",
                fontFamily: RB,
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "4px",
              }}
            >
              Default Landing Dashboard
            </label>
            <select
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #D1D5DB",
                fontSize: "13px",
                boxSizing: "border-box",
              }}
            >
              <option>Hospital Admin Dashboard</option>
              <option>Doctor Clinical Dashboard</option>
              <option>Nurse Dashboard</option>
              <option>Reception Dashboard</option>
            </select>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "12px",
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                background: "#FFFFFF",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                background: "#0D47A1",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Create Role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
