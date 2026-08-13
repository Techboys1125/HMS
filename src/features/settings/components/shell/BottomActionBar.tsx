import { Check, RotateCcw, Save } from "lucide-react";

interface BottomActionBarProps {
  saveStatus: string | null;
  activeTitle: string;
  onCancel?: () => void;
  onSave?: () => void;
  onReset?: () => void;
}

export function BottomActionBar({
  saveStatus,
  activeTitle,
  onCancel = () => {},
  onSave = () => {},
  onReset = () => {},
}: BottomActionBarProps) {
  return (
    <div
      style={{
        position: "sticky",
        bottom: 0,
        background: "#FFFFFF",
        borderTop: "1px solid #E5E7EB",
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 -4px 12px rgba(0,0,0,0.05)",
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 500 }}>
          Active View: <strong>{activeTitle}</strong>
        </span>
        {saveStatus && (
          <span
            style={{
              fontSize: "12px",
              color: "#2E7D32",
              background: "#E8F5E9",
              padding: "4px 10px",
              borderRadius: "6px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Check size={14} /> {saveStatus}
          </span>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          onClick={onCancel}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
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
        <button
          onClick={onReset}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            borderRadius: "8px",
            border: "1px solid #D1D5DB",
            background: "#FFFFFF",
            color: "#374151",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <RotateCcw size={14} style={{ color: "#64748B" }} /> Reset
        </button>
        <button
          onClick={onSave}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
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
          <Save size={14} /> Save Changes
        </button>
      </div>
    </div>
  );
}
