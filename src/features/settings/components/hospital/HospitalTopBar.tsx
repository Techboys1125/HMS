import { Printer, RotateCcw, Save } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";

interface HospitalTopBarProps {
  saving: boolean;
  onSave: () => void;
  onReset: () => void;
  onPreview: () => void;
}

export function HospitalTopBar({
  saving,
  onSave,
  onReset,
  onPreview,
}: HospitalTopBarProps) {
  return (
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
          Hospital Information Configuration
        </h2>
        <p
          style={{
            fontSize: "12px",
            color: "#64748B",
            margin: "2px 0 0 0",
          }}
        >
          Manage master hospital profile, official address, communication
          channels, and print template headers.
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          onClick={onPreview}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            borderRadius: "8px",
            border: "1px solid #E5E7EB",
            background: "#FFFFFF",
            color: "#0D47A1",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Printer size={14} /> Preview Print Header
        </button>
        <button
          onClick={onReset}
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
          <RotateCcw size={14} /> Reset
        </button>
        <button
          onClick={onSave}
          disabled={saving}
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
            cursor: saving ? "default" : "pointer",
            opacity: saving ? 0.7 : 1,
            boxShadow: "0 2px 4px rgba(13,71,161,0.2)",
          }}
        >
          <Save size={14} /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
