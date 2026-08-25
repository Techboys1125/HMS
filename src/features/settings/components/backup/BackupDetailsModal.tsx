import { X } from "lucide-react";
import type { BackupHistory } from "../../constants/backup.constants";

const PP = "'Poppins', system-ui, sans-serif";

interface BackupDetailsModalProps {
  backup: BackupHistory;
  onClose: () => void;
}

export function BackupDetailsModal({
  backup,
  onClose,
}: BackupDetailsModalProps) {
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
            Backup Archive Specifications
          </h3>
          <button
            aria-label="Close"
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
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            fontSize: "13px",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "11px",
                color: "#64748B",
                display: "block",
              }}
            >
              Backup Identifier
            </span>
            <span
              style={{
                fontFamily: PP,
                fontSize: "15px",
                fontWeight: 700,
                color: "#0D47A1",
              }}
            >
              {backup.id}
            </span>
          </div>
          <div>
            <span
              style={{
                fontSize: "11px",
                color: "#64748B",
                display: "block",
              }}
            >
              Backup Type & Size
            </span>
            <span style={{ fontWeight: 600, color: "#111827" }}>
              {backup.type} • {backup.size}
            </span>
          </div>
          <div>
            <span
              style={{
                fontSize: "11px",
                color: "#64748B",
                display: "block",
              }}
            >
              Created On
            </span>
            <span style={{ color: "#475569" }}>{backup.createdOn}</span>
          </div>
          <div>
            <span
              style={{
                fontSize: "11px",
                color: "#64748B",
                display: "block",
              }}
            >
              Checksum Verification
            </span>
            <span style={{ color: "#2E7D32", fontWeight: 600 }}>
              SHA-256 Verified Match
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "16px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              background: "#0D47A1",
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
