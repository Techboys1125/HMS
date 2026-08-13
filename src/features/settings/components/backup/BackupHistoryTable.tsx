import { useState } from "react";
import { Download, Eye } from "lucide-react";
import {
  BACKUP_HISTORY,
  type BackupHistory,
} from "../../constants/backup.constants";
import { BackupDetailsModal } from "./BackupDetailsModal";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export function BackupHistoryTable() {
  void RB;
  const backupHistory = BACKUP_HISTORY;
  const [selectedBackup, setSelectedBackup] = useState<BackupHistory | null>(
    null,
  );

  return (
    <>
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
            System Backup History ({backupHistory.length})
          </h3>
          <span style={{ fontSize: "12px", color: "#64748B" }}>
            Encrypted & Verified Dumps
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
                <th style={{ padding: "12px 16px" }}>Backup ID</th>
                <th style={{ padding: "12px 16px" }}>Type</th>
                <th style={{ padding: "12px 16px" }}>Created On</th>
                <th style={{ padding: "12px 16px" }}>Created By</th>
                <th style={{ padding: "12px 16px" }}>File Size</th>
                <th style={{ padding: "12px 16px" }}>Duration</th>
                <th style={{ padding: "12px 16px" }}>Status</th>
                <th style={{ padding: "12px 16px", textAlign: "right" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {backupHistory.map((b) => (
                <tr key={b.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontWeight: 700,
                      color: "#0D47A1",
                    }}
                  >
                    {b.id}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#475569" }}>
                    {b.type}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#111827" }}>
                    {b.createdOn}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#64748B" }}>
                    {b.createdBy}
                  </td>
                  <td style={{ padding: "12px 16px", fontWeight: 600 }}>
                    {b.size}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#64748B" }}>
                    {b.duration}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: "12px",
                        background: "#E8F5E9",
                        color: "#2E7D32",
                      }}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: "6px",
                      }}
                    >
                      <button
                        onClick={() => setSelectedBackup(b)}
                        title="View Details"
                        style={{
                          border: "none",
                          background: "transparent",
                          color: "#0D47A1",
                          cursor: "pointer",
                          padding: "4px",
                        }}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        title="Download Backup Dump"
                        style={{
                          border: "none",
                          background: "transparent",
                          color: "#009688",
                          cursor: "pointer",
                          padding: "4px",
                        }}
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBackup && (
        <BackupDetailsModal
          backup={selectedBackup}
          onClose={() => setSelectedBackup(null)}
        />
      )}
    </>
  );
}
