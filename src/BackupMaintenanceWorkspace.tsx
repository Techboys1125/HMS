import { useState } from "react";
import {
  Database,
  HardDrive,
  Activity,
  Clock,
  Download,
  Eye,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  PieChart as PieChartIcon,
  Check,
  X,
  Server,
  Play,
  Wrench,
  ShieldCheck,
} from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export function BackupMaintenanceWorkspace() {
  void RB;
  void RotateCcw;
  void CheckCircle2;
  void AlertCircle;
  // Section 01: Backup Configuration
  const [backupConfig, setBackupConfig] = useState({
    autoBackup: true,
    frequency: "Daily",
    backupTime: "02:00 AM",
    retentionPeriod: "30 Days",
    enableVerification: true,
    compressFiles: true,
  });

  // Section 02: Backup History Table
  const [backupHistory] = useState([
    {
      id: "BK-20260726-01",
      type: "Automated Daily",
      createdOn: "26 Jul 2026, 02:00 AM",
      createdBy: "System Scheduler",
      size: "4.2 GB",
      duration: "3m 45s",
      status: "Completed",
    },
    {
      id: "BK-20260725-01",
      type: "Automated Daily",
      createdOn: "25 Jul 2026, 02:00 AM",
      createdBy: "System Scheduler",
      size: "4.1 GB",
      duration: "3m 40s",
      status: "Completed",
    },
    {
      id: "BK-20260724-02",
      type: "Manual Admin Backup",
      createdOn: "24 Jul 2026, 17:30 PM",
      createdBy: "Sarah Jenkins (Admin)",
      size: "4.1 GB",
      duration: "3m 52s",
      status: "Completed",
    },
    {
      id: "BK-20260724-01",
      type: "Automated Daily",
      createdOn: "24 Jul 2026, 02:00 AM",
      createdBy: "System Scheduler",
      size: "4.0 GB",
      duration: "3m 38s",
      status: "Completed",
    },
    {
      id: "BK-20260723-01",
      type: "Automated Daily",
      createdOn: "23 Jul 2026, 02:00 AM",
      createdBy: "System Scheduler",
      size: "4.0 GB",
      duration: "3m 42s",
      status: "Completed",
    },
  ]);

  // Section 04: Maintenance Configuration
  const [maintConfig, setMaintConfig] = useState({
    enableMaintenanceMode: false,
    maintenanceMessage:
      "System is undergoing scheduled database indexing and optimization. HMS services will resume shortly.",
    scheduledDate: "2026-08-01",
    startTime: "01:00 AM",
    endTime: "04:00 AM",
    notifyUsers: true,
  });

  const [selectedBackup, setSelectedBackup] = useState<
    (typeof backupHistory)[0] | null
  >(null);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleRunBackupNow = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      setSaveToast("Manual System & Database Backup completed successfully!");
      setTimeout(() => setSaveToast(null), 3000);
    }, 2000);
  };

  const handleSave = () => {
    setSaveToast("Backup schedules and maintenance preferences updated!");
    setTimeout(() => setSaveToast(null), 3000);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: "20px",
      }}
    >
      {/* MAIN CONTENT SECTIONS */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "100%",
        }}
      >
        {/* SUB-HEADER ACTION BAR */}
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
              Backup & System Maintenance
            </h2>
            <p
              style={{
                fontSize: "12px",
                color: "#64748B",
                margin: "2px 0 0 0",
              }}
            >
              Manage backup schedules, monitor system health, configure
              maintenance windows, and review backup history.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={handleRunBackupNow}
              disabled={isBackingUp}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
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
              <Play size={14} />{" "}
              {isBackingUp ? "Backing Up..." : "Run Backup Now"}
            </button>
            <button
              onClick={() =>
                setMaintConfig((prev) => ({
                  ...prev,
                  enableMaintenanceMode: !prev.enableMaintenanceMode,
                }))
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                background: maintConfig.enableMaintenanceMode
                  ? "#FEF3C7"
                  : "#FFFFFF",
                color: maintConfig.enableMaintenanceMode
                  ? "#B45309"
                  : "#374151",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Wrench size={14} />{" "}
              {maintConfig.enableMaintenanceMode
                ? "Maintenance ON"
                : "Maintenance Mode"}
            </button>
            <button
              onClick={handleSave}
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
              <Save size={14} /> Save Configuration
            </button>
          </div>
        </div>

        {/* TOP KPI CARDS (4 CARDS) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              border: "1px solid #E5E7EB",
              padding: "18px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span
                style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}
              >
                System Health
              </span>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "#E8F5E9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Activity size={18} style={{ color: "#2E7D32" }} />
              </div>
            </div>
            <div
              style={{
                fontFamily: PP,
                fontSize: "24px",
                fontWeight: 800,
                color: "#111827",
              }}
            >
              100% Healthy
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "6px",
              }}
            >
              <span style={{ fontSize: "11px", color: "#94A3B8" }}>
                All Nodes Operational
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#2E7D32",
                  background: "#E8F5E9",
                  padding: "1px 6px",
                  borderRadius: "4px",
                }}
              >
                Optimal
              </span>
            </div>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              border: "1px solid #E5E7EB",
              padding: "18px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span
                style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}
              >
                Last Backup
              </span>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "#E3F2FD",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Database size={18} style={{ color: "#0D47A1" }} />
              </div>
            </div>
            <div
              style={{
                fontFamily: PP,
                fontSize: "24px",
                fontWeight: 800,
                color: "#111827",
              }}
            >
              Today, 02:00 AM
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "6px",
              }}
            >
              <span style={{ fontSize: "11px", color: "#94A3B8" }}>
                Size: 4.2 GB
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#2E7D32",
                  background: "#E8F5E9",
                  padding: "1px 6px",
                  borderRadius: "4px",
                }}
              >
                Verified
              </span>
            </div>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              border: "1px solid #E5E7EB",
              padding: "18px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span
                style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}
              >
                Storage Usage
              </span>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "#E0F2F1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <HardDrive size={18} style={{ color: "#009688" }} />
              </div>
            </div>
            <div
              style={{
                fontFamily: PP,
                fontSize: "24px",
                fontWeight: 800,
                color: "#111827",
              }}
            >
              24.5 GB / 500 GB
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "6px",
              }}
            >
              <span style={{ fontSize: "11px", color: "#94A3B8" }}>
                4.9% Capacity Used
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#009688",
                  background: "#E0F2F1",
                  padding: "1px 6px",
                  borderRadius: "4px",
                }}
              >
                Ample Space
              </span>
            </div>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              border: "1px solid #E5E7EB",
              padding: "18px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span
                style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}
              >
                Maintenance Status
              </span>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: maintConfig.enableMaintenanceMode
                    ? "#FEF3C7"
                    : "#E8F5E9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Wrench
                  size={18}
                  style={{
                    color: maintConfig.enableMaintenanceMode
                      ? "#B45309"
                      : "#2E7D32",
                  }}
                />
              </div>
            </div>
            <div
              style={{
                fontFamily: PP,
                fontSize: "24px",
                fontWeight: 800,
                color: "#111827",
              }}
            >
              {maintConfig.enableMaintenanceMode
                ? "Maintenance ON"
                : "Normal Operations"}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "6px",
              }}
            >
              <span style={{ fontSize: "11px", color: "#94A3B8" }}>
                Next Window: 01 Aug
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: maintConfig.enableMaintenanceMode
                    ? "#B45309"
                    : "#2E7D32",
                  background: maintConfig.enableMaintenanceMode
                    ? "#FEF3C7"
                    : "#E8F5E9",
                  padding: "1px 6px",
                  borderRadius: "4px",
                }}
              >
                {maintConfig.enableMaintenanceMode ? "Active" : "Scheduled"}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 01: BACKUP CONFIGURATION */}
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
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Backup Frequency
              </label>
              <select
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
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Scheduled Backup Time
              </label>
              <input
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
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Retention Policy
              </label>
              <select
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
            ].map((item, idx) => (
              <div
                key={idx}
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
                  type="checkbox"
                  checked={(backupConfig as unknown as Record<string, boolean>)[item.key]}
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

        {/* SECTION 02: BACKUP HISTORY DATA TABLE */}
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

        {/* SECTION 03: STORAGE OVERVIEW */}
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
            <HardDrive size={18} style={{ color: "#009688" }} /> Section 03:
            Disk & Storage Space Breakdown
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "16px",
            }}
          >
            {[
              {
                label: "Relational Database",
                used: "12.4 GB",
                total: "200 GB",
                pct: 6.2,
                color: "#0D47A1",
              },
              {
                label: "Medical Documents / DICOM",
                used: "8.2 GB",
                total: "200 GB",
                pct: 4.1,
                color: "#009688",
              },
              {
                label: "Report PDF & Logs",
                used: "3.9 GB",
                total: "100 GB",
                pct: 3.9,
                color: "#F59E0B",
              },
              {
                label: "Available Free Storage",
                used: "475.5 GB",
                total: "500 GB",
                pct: 95.1,
                color: "#66BB6A",
              },
            ].map((st, i) => (
              <div
                key={i}
                style={{
                  background: "#F8FAFC",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: "4px",
                  }}
                >
                  {st.label}
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 800,
                    color: st.color,
                    marginBottom: "6px",
                  }}
                >
                  {st.used}
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "6px",
                    background: "#E2E8F0",
                    borderRadius: "3px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${st.pct}%`,
                      height: "100%",
                      background: st.color,
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "#64748B",
                    marginTop: "4px",
                  }}
                >
                  Of {st.total} Total Allocated
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 04: MAINTENANCE CONFIGURATION */}
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
            <Wrench size={18} style={{ color: "#B45309" }} /> Section 04:
            Scheduled System Maintenance Window
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
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Maintenance Date
              </label>
              <input
                type="date"
                value={maintConfig.scheduledDate}
                onChange={(e) =>
                  setMaintConfig((prev) => ({
                    ...prev,
                    scheduledDate: e.target.value,
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
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Start Time
              </label>
              <input
                type="text"
                value={maintConfig.startTime}
                onChange={(e) =>
                  setMaintConfig((prev) => ({
                    ...prev,
                    startTime: e.target.value,
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
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Estimated End Time
              </label>
              <input
                type="text"
                value={maintConfig.endTime}
                onChange={(e) =>
                  setMaintConfig((prev) => ({
                    ...prev,
                    endTime: e.target.value,
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
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "6px",
              }}
            >
              User Broadcast Maintenance Notice
            </label>
            <textarea
              rows={2}
              value={maintConfig.maintenanceMessage}
              onChange={(e) =>
                setMaintConfig((prev) => ({
                  ...prev,
                  maintenanceMessage: e.target.value,
                }))
              }
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #D1D5DB",
                fontSize: "12px",
                boxSizing: "border-box",
                fontFamily: RB,
              }}
            />
          </div>

          <div
            style={{
              background: "#FEF3C7",
              padding: "12px 14px",
              borderRadius: "10px",
              border: "1px solid #FDE68A",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{ fontSize: "13px", fontWeight: 700, color: "#92400E" }}
              >
                Activate Emergency System Maintenance Banner
              </div>
              <div style={{ fontSize: "11px", color: "#B45309" }}>
                Displays top notification banner across all active staff
                sessions
              </div>
            </div>
            <input
              type="checkbox"
              checked={maintConfig.enableMaintenanceMode}
              onChange={(e) =>
                setMaintConfig((prev) => ({
                  ...prev,
                  enableMaintenanceMode: e.target.checked,
                }))
              }
              style={{
                accentColor: "#B45309",
                width: "18px",
                height: "18px",
                cursor: "pointer",
              }}
            />
          </div>
        </div>

        {/* SECTION 05: SYSTEM HEALTH MONITORING CARDS */}
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
            <Server size={18} style={{ color: "#0D47A1" }} /> Section 05: Core
            HMS Service Health Status
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "12px",
            }}
          >
            {[
              {
                service: "PostgreSQL DB",
                status: "Healthy",
                latency: "2ms",
                icon: Database,
                bg: "#E8F5E9",
                color: "#2E7D32",
              },
              {
                service: "App Server Node",
                status: "Running",
                latency: "12ms",
                icon: Server,
                bg: "#E8F5E9",
                color: "#2E7D32",
              },
              {
                service: "Notification Engine",
                status: "Active",
                latency: "45ms",
                icon: Clock,
                bg: "#E8F5E9",
                color: "#2E7D32",
              },
              {
                service: "Backup Daemon",
                status: "Running",
                latency: "Standby",
                icon: ShieldCheck,
                bg: "#E8F5E9",
                color: "#2E7D32",
              },
              {
                service: "Storage Mount",
                status: "Healthy",
                latency: "Free 95%",
                icon: HardDrive,
                bg: "#E8F5E9",
                color: "#2E7D32",
              },
            ].map((srv, idx) => {
              const SrvIcon = srv.icon;
              return (
                <div
                  key={idx}
                  style={{
                    background: "#F8FAFC",
                    borderRadius: "10px",
                    border: "1px solid #E2E8F0",
                    padding: "12px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: srv.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 6px auto",
                    }}
                  >
                    <SrvIcon size={16} style={{ color: srv.color }} />
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    {srv.service}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#2E7D32",
                      fontWeight: 600,
                      margin: "2px 0",
                    }}
                  >
                    {srv.status}
                  </div>
                  <div style={{ fontSize: "10px", color: "#94A3B8" }}>
                    {srv.latency}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 06: RECENT SYSTEM ACTIVITY TIMELINE */}
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
            <Activity size={18} style={{ color: "#009688" }} /> Section 06:
            Recent Maintenance & System Timeline
          </h3>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {[
              {
                title: "Automatic Daily Backup Completed",
                user: "System Scheduler",
                time: "Today, 02:00 AM",
                module: "Backup Daemon",
                status: "Success",
              },
              {
                title: "Backup Integrity Verification Passed",
                user: "System Validator",
                time: "Today, 02:05 AM",
                module: "Checksum Engine",
                status: "Verified",
              },
              {
                title: "Manual Backup Triggered",
                user: "Sarah Jenkins (Admin)",
                time: "Yesterday, 17:30 PM",
                module: "Admin Console",
                status: "Success",
              },
              {
                title: "Maintenance Notice Scheduled",
                user: "Chief IT Admin",
                time: "2 days ago",
                module: "System Admin",
                status: "Scheduled",
              },
            ].map((act, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#F8FAFC",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid #E2E8F0",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#009688",
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#111827",
                      }}
                    >
                      {act.title}
                    </div>
                    <div style={{ fontSize: "11px", color: "#64748B" }}>
                      By {act.user} • {act.module}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "#2E7D32",
                      background: "#E8F5E9",
                      padding: "2px 8px",
                      borderRadius: "10px",
                    }}
                  >
                    {act.status}
                  </span>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#94A3B8",
                      marginTop: "2px",
                    }}
                  >
                    {act.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 07: ANALYTICS CHARTS */}
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
              fontSize: "16px",
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 16px 0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <BarChart2 size={18} style={{ color: "#0D47A1" }} /> Backup
            Performance & Health Metrics
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            {/* Donut Chart Mock */}
            <div
              style={{
                background: "#F8FAFC",
                borderRadius: "12px",
                padding: "16px",
                border: "1px solid #E2E8F0",
              }}
            >
              <h4
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#111827",
                  margin: "0 0 12px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <PieChartIcon size={14} style={{ color: "#009688" }} /> Storage
                Distribution
              </h4>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  height: "120px",
                }}
              >
                <div
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "50%",
                    background:
                      "conic-gradient(#0D47A1 0% 50%, #009688 50% 85%, #F59E0B 85% 100%)",
                  }}
                />
                <div
                  style={{
                    fontSize: "11px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <span style={{ color: "#0D47A1", fontWeight: 600 }}>
                    ■ Postgres DB (50%)
                  </span>
                  <span style={{ color: "#009688", fontWeight: 600 }}>
                    ■ DICOM Scans (35%)
                  </span>
                  <span style={{ color: "#F59E0B", fontWeight: 600 }}>
                    ■ Logs & PDFs (15%)
                  </span>
                </div>
              </div>
            </div>

            {/* Bar Chart Mock */}
            <div
              style={{
                background: "#F8FAFC",
                borderRadius: "12px",
                padding: "16px",
                border: "1px solid #E2E8F0",
              }}
            >
              <h4
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#111827",
                  margin: "0 0 12px 0",
                }}
              >
                Daily Backup Duration (Last 5 Days)
              </h4>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "12px",
                  height: "110px",
                  paddingTop: "10px",
                }}
              >
                {[
                  { day: "22 Jul", min: "3.5m" },
                  { day: "23 Jul", min: "3.7m" },
                  { day: "24 Jul", min: "3.6m" },
                  { day: "25 Jul", min: "3.7m" },
                  { day: "26 Jul", min: "3.8m" },
                ].map((bar, idx) => (
                  <div key={idx} style={{ flex: 1, textAlign: "center" }}>
                    <div
                      style={{
                        width: "100%",
                        background: "#0D47A1",
                        height: "60px",
                        borderRadius: "4px 4px 0 0",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "10px",
                        color: "#64748B",
                        display: "block",
                        marginTop: "4px",
                      }}
                    >
                      {bar.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 08: RECOVERY READINESS STATUS */}
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

      {/* BACKUP DETAILS MODAL */}
      {selectedBackup && (
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
                onClick={() => setSelectedBackup(null)}
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
                  {selectedBackup.id}
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
                  {selectedBackup.type} • {selectedBackup.size}
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
                <span style={{ color: "#475569" }}>
                  {selectedBackup.createdOn}
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
                onClick={() => setSelectedBackup(null)}
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
      )}

      {/* SAVE TOAST */}
      {saveToast && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "24px",
            background: "#2E7D32",
            color: "#FFFFFF",
            padding: "12px 20px",
            borderRadius: "10px",
            fontWeight: 600,
            fontSize: "13px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            zIndex: 90,
          }}
        >
          <Check size={16} /> {saveToast}
        </div>
      )}
    </div>
  );
}
