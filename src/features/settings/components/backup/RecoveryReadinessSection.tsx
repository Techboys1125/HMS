import { ShieldCheck } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export function RecoveryReadinessSection() {
  void RB;
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
        <ShieldCheck size={18} style={{ color: "#2E7D32" }} /> Section 08:
        System Recovery & Integrity Readiness
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
        }}
      >
        <div
          style={{
            background: "#F8FAFC",
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #E2E8F0",
          }}
        >
          <div>
            <span
              style={{ fontSize: "11px", color: "#64748B", display: "block" }}
            >
              Latest Backup Point
            </span>
            <span
              style={{ fontWeight: 700, color: "#111827", fontSize: "13px" }}
            >
              BK-20260726-01
            </span>
          </div>
          <div>
            <span
              style={{ fontSize: "11px", color: "#64748B", display: "block" }}
            >
              Checksum Status
            </span>
            <span
              style={{ fontWeight: 700, color: "#2E7D32", fontSize: "13px" }}
            >
              Passed (SHA-256)
            </span>
          </div>
          <div>
            <span
              style={{ fontSize: "11px", color: "#64748B", display: "block" }}
            >
              Est. Recovery Time
            </span>
            <span
              style={{ fontWeight: 700, color: "#0D47A1", fontSize: "13px" }}
            >
              &lt; 15 Minutes
            </span>
          </div>
          <div>
            <span
              style={{ fontSize: "11px", color: "#64748B", display: "block" }}
            >
              Readiness Score
            </span>
            <span
              style={{ fontWeight: 800, color: "#2E7D32", fontSize: "14px" }}
            >
              100% Ready
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
