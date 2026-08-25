import { useState } from "react";
import { Database } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export function BackupConfigSection() {
  void RB;
  const [backupConfig, setBackupConfig] = useState({
    autoBackup: true,
    frequency: "Daily",
    backupTime: "02:00 AM",
    retentionPeriod: "30 Days",
    enableVerification: true,
    compressFiles: true,
  });

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
        <Database size={18} style={{ color: "#0D47A1" }} /> Section 01:
        Automated Backup Schedule & Preferences
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        <div>
          <span
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Backup Frequency
            <select
              aria-label="Select option"
              value={backupConfig.frequency}
              onChange={(e) =>
                setBackupConfig((prev) => ({
                  ...prev,
                  frequency: e.target.value,
                }))
              }
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                border: "1px solid #D1D5DB",
                fontSize: "13px",
                boxSizing: "border-box",
              }}
            >
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </span>
        </div>

        <div>
          <span
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Scheduled Backup Time
            <input
              aria-label="Input field"
              type="text"
              value={backupConfig.backupTime}
              onChange={(e) =>
                setBackupConfig((prev) => ({
                  ...prev,
                  backupTime: e.target.value,
                }))
              }
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                border: "1px solid #D1D5DB",
                fontSize: "13px",
                boxSizing: "border-box",
              }}
            />
          </span>
        </div>

        <div>
          <span
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Retention Policy
            <select
              aria-label="Select option"
              value={backupConfig.retentionPeriod}
              onChange={(e) =>
                setBackupConfig((prev) => ({
                  ...prev,
                  retentionPeriod: e.target.value,
                }))
              }
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                border: "1px solid #D1D5DB",
                fontSize: "13px",
                boxSizing: "border-box",
              }}
            >
              <option>7 Days</option>
              <option>15 Days</option>
              <option>30 Days</option>
              <option>60 Days</option>
              <option>90 Days</option>
            </select>
          </span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
        }}
      >
        {[
          {
            label: "Enable Automatic Daily Backup",
            sub: "Runs automated DB dump on schedule",
            key: "autoBackup",
          },
          {
            label: "Enable Backup Integrity Verification",
            sub: "Runs checksum validation post-backup",
            key: "enableVerification",
          },
          {
            label: "Compress Backup Dump Files",
            sub: "GZIP compression to save disk space",
            key: "compressFiles",
          },
        ].map((item) => (
          <div
            key={item.key}
            style={{
              background: "#F8FAFC",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                {item.label}
              </div>
              <div style={{ fontSize: "10px", color: "#64748B" }}>
                {item.sub}
              </div>
            </div>
            <input
              aria-label="Toggle option"
              type="checkbox"
              checked={
                (backupConfig as unknown as Record<string, boolean>)[item.key]
              }
              onChange={(e) =>
                setBackupConfig((prev) => ({
                  ...prev,
                  [item.key]: e.target.checked,
                }))
              }
              style={{ accentColor: "#0D47A1", cursor: "pointer" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
