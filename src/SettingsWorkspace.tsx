import { useState } from "react";
import { HospitalInformationWorkspace } from "./HospitalInformationWorkspace";
import { UserRolesPermissionsWorkspace } from "./UserRolesPermissionsWorkspace";
import { AppointmentConfigurationWorkspace } from "./AppointmentConfigurationWorkspace";
import { BillingConfigurationWorkspace } from "./BillingConfigurationWorkspace";
import { NotificationCommunicationWorkspace } from "./NotificationCommunicationWorkspace";
import { SecuritySettingsWorkspace } from "./SecuritySettingsWorkspace";
import { BackupMaintenanceWorkspace } from "./BackupMaintenanceWorkspace";
import {
  Settings as SettingsIcon,
  Building2,
  Shield,
  Calendar,
  CreditCard,
  Bell,
  Lock,
  Database,
  CheckCircle2,
  AlertCircle,
  Clock,
  Save,
  RotateCcw,
  Sliders,
  Check,
  Globe,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

interface SettingsWorkspaceProps {
  onNavigate?: (screen: string) => void;
}

export function SettingsWorkspace({ onNavigate }: SettingsWorkspaceProps) {
  void onNavigate;
  const [activeMenu, setActiveMenu] = useState<string>("general");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Accordion State (single expanded accordion at a time)
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(
    "accordion-1",
  );

  // General Settings Form State (Phase 1 Compliant)
  const [generalSettings, setGeneralSettings] = useState({
    defaultLanguage: "English",
    timezone: "Asia/Kolkata (IST - UTC +05:30)",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12 Hour",
    weekStartsOn: "Monday",
    hospitalDisplayName: "St. Jude Multispecialty Hospital",
    hospitalShortCode: "SJH-01",
    defaultLandingDashboard: "Super Admin Operations Center",
    defaultWorkingShift: "Morning (08:00 AM - 04:00 PM)",
    enableAutoLogout: true,
    autoLogoutDuration: "15 Minutes",
    compactTableView: false,
    enableAnimations: true,
    showBreadcrumbs: true,
    enableTooltips: true,
    defaultTheme: "Light",
    defaultApptDuration: "30 Minutes",
    queueTokenPrefix: "OPD",
    defaultPatientSearchMode: "MRN / Name",
    enableConfirmationDialogs: true,
  });

  const [showResetWarning, setShowResetWarning] = useState(false);

  // Quick Configuration Toolbar items
  const quickConfigCards = [
    {
      id: "general",
      title: "General",
      description: "System overview & status",
      icon: Sliders,
      status: "Overview",
    },
    {
      id: "hospital-info",
      title: "Hospital Information",
      description: "Branding, contact & address",
      icon: Building2,
      status: "Configured",
    },
    {
      id: "roles-permissions",
      title: "User Roles & Permissions",
      description: "RBAC & matrix policies",
      icon: Shield,
      status: "Configured",
    },
    {
      id: "appointments",
      title: "Appointment Configuration",
      description: "Slot timing & token rules",
      icon: Calendar,
      status: "Pending",
    },
    {
      id: "billing",
      title: "Billing Configuration",
      description: "Invoice, tax & payments",
      icon: CreditCard,
      status: "Configured",
    },
    {
      id: "notifications",
      title: "Notification & Communication",
      description: "SMS, email & templates",
      icon: Bell,
      status: "Configured",
    },
    {
      id: "security",
      title: "Security Settings",
      description: "2FA, passwords & SIEM",
      icon: Lock,
      status: "Configured",
    },
    {
      id: "backup",
      title: "Backup & Maintenance",
      description: "DB dumps & health check",
      icon: Database,
      status: "Configured",
    },
  ];

  const handleSave = () => {
    setSaveStatus("Settings saved successfully!");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const getStatusBadge = (status: string) => {
    if (status === "Configured") {
      return (
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "#2E7D32",
            background: "#E8F5E9",
            padding: "2px 8px",
            borderRadius: "12px",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <CheckCircle2 size={12} /> Configured
        </span>
      );
    }
    if (status === "Pending") {
      return (
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "#B45309",
            background: "#FEF3C7",
            padding: "2px 8px",
            borderRadius: "12px",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <AlertCircle size={12} /> Pending
        </span>
      );
    }
    return (
      <span
        style={{
          fontSize: "11px",
          fontWeight: 600,
          color: "#0D47A1",
          background: "#E3F2FD",
          padding: "2px 8px",
          borderRadius: "12px",
        }}
      >
        {status}
      </span>
    );
  };

  void getStatusBadge;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        flex: 1,
        background: "#F1F5F9",
        fontFamily: RB,
      }}
    >
      {/* ─── PAGE HEADER ────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #E5E7EB",
          padding: "20px 24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                color: "#64748B",
                marginBottom: "6px",
              }}
            >
              <span>Hospital</span>
              <span>&gt;</span>
              <span>Settings</span>
              <span>&gt;</span>
              <span style={{ color: "#0D47A1", fontWeight: 600 }}>
                General Settings
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
                <SettingsIcon size={20} style={{ color: "#0D47A1" }} />
              </div>
              <div>
                <h1
                  style={{
                    fontFamily: PP,
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#111827",
                    margin: 0,
                  }}
                >
                  General Settings
                </h1>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#64748B",
                    margin: "2px 0 0 0",
                  }}
                >
                  Configure hospital-wide default application preferences used
                  throughout the HMS.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => setShowResetWarning(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "9px 16px",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
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
              onClick={handleSave}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "9px 20px",
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
      </div>

      {/* ─── HORIZONTAL QUICK CONFIGURATION TOOLBAR ────────────────────── */}
      <div
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #E5E7EB",
          padding: "12px 24px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {quickConfigCards.map((item) => {
            const IconComp = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: isActive ? "1px solid #0D47A1" : "1px solid #E5E7EB",
                  background: isActive ? "#E3F2FD" : "#F8FAFC",
                  color: isActive ? "#0D47A1" : "#475569",
                  fontSize: "12px",
                  fontWeight: isActive ? 600 : 500,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap",
                  boxShadow: isActive
                    ? "0 1px 2px rgba(13,71,161,0.1)"
                    : "none",
                }}
              >
                <IconComp
                  size={13}
                  style={{ color: isActive ? "#0D47A1" : "#64748B" }}
                />
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── SINGLE FULL-WIDTH WORKSPACE CONTENT AREA ───────────────────── */}
      <div
        style={{
          flex: 1,
          padding: "24px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Render Active Settings Workspace Full Width */}
        <div style={{ width: "100%", transition: "opacity 0.2s ease-in-out" }}>
          {activeMenu === "general" ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {/* TOP CONFIGURATION HEALTH CARDS (4 Reusable Enterprise KPI Cards) */}
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
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#64748B",
                      }}
                    >
                      Configuration Status
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
                      <CheckCircle2 size={18} style={{ color: "#0D47A1" }} />
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: PP,
                      fontSize: "22px",
                      fontWeight: 800,
                      color: "#111827",
                    }}
                  >
                    92% Complete
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
                      Phase 1 Compliant
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
                      Configured
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
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#64748B",
                      }}
                    >
                      Regional Settings
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
                      <Globe size={18} style={{ color: "#009688" }} />
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: PP,
                      fontSize: "22px",
                      fontWeight: 800,
                      color: "#111827",
                    }}
                  >
                    Healthy
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
                      Last Updated Today
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
                      Active
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
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#64748B",
                      }}
                    >
                      Application Defaults
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
                      <Sliders size={18} style={{ color: "#0D47A1" }} />
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: PP,
                      fontSize: "22px",
                      fontWeight: 800,
                      color: "#111827",
                    }}
                  >
                    Configured
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
                      No Pending Changes
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        color: "#0D47A1",
                        background: "#E3F2FD",
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
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#64748B",
                      }}
                    >
                      System Preferences
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
                      <CheckCircle2 size={18} style={{ color: "#2E7D32" }} />
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: PP,
                      fontSize: "22px",
                      fontWeight: 800,
                      color: "#111827",
                    }}
                  >
                    Operational
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
                      Saved by Hospital Admin
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
                      Operational
                    </span>
                  </div>
                </div>
              </div>

              {/* CONFIGURATION WORKSPACE (EXPANDABLE ACCORDIONS) */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                {/* ACCORDION 01: Localization & Regional Preferences */}
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "16px",
                    border:
                      expandedAccordion === "accordion-1"
                        ? "2px solid #0D47A1"
                        : "1px solid #E5E7EB",
                    overflow: "hidden",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    onClick={() =>
                      setExpandedAccordion(
                        expandedAccordion === "accordion-1"
                          ? null
                          : "accordion-1",
                      )
                    }
                    style={{
                      padding: "18px 20px",
                      background:
                        expandedAccordion === "accordion-1"
                          ? "#F0F7FF"
                          : "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
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
                        <Globe size={18} style={{ color: "#009688" }} />
                      </div>
                      <div>
                        <h3
                          style={{
                            fontFamily: PP,
                            fontSize: "15px",
                            fontWeight: 700,
                            color: "#111827",
                            margin: 0,
                          }}
                        >
                          Localization & Regional Preferences
                        </h3>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#64748B",
                            margin: "2px 0 0 0",
                          }}
                        >
                          Configure hospital-wide regional preferences.
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          padding: "3px 8px",
                          borderRadius: "12px",
                          background: "#E8F5E9",
                          color: "#2E7D32",
                        }}
                      >
                        Configured
                      </span>
                      {expandedAccordion === "accordion-1" ? (
                        <ChevronDown size={18} style={{ color: "#0D47A1" }} />
                      ) : (
                        <ChevronRight size={18} style={{ color: "#94A3B8" }} />
                      )}
                    </div>
                  </div>

                  {expandedAccordion === "accordion-1" && (
                    <div
                      style={{
                        padding: "20px",
                        borderTop: "1px solid #E5E7EB",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: "16px",
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
                          Default Language
                        </label>
                        <select
                          value={generalSettings.defaultLanguage}
                          onChange={(e) =>
                            setGeneralSettings((prev) => ({
                              ...prev,
                              defaultLanguage: e.target.value,
                            }))
                          }
                          style={{
                            width: "100%",
                            padding: "9px 12px",
                            borderRadius: "8px",
                            border: "1px solid #D1D5DB",
                            fontSize: "13px",
                            background: "#FFFFFF",
                          }}
                        >
                          <option value="English">English</option>
                          <option value="Hindi">Hindi (हिंदी)</option>
                          <option value="Spanish">Spanish (Español)</option>
                          <option value="French">French (Français)</option>
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
                          Timezone
                        </label>
                        <select
                          value={generalSettings.timezone}
                          onChange={(e) =>
                            setGeneralSettings((prev) => ({
                              ...prev,
                              timezone: e.target.value,
                            }))
                          }
                          style={{
                            width: "100%",
                            padding: "9px 12px",
                            borderRadius: "8px",
                            border: "1px solid #D1D5DB",
                            fontSize: "13px",
                            background: "#FFFFFF",
                          }}
                        >
                          <option value="Asia/Kolkata (IST - UTC +05:30)">
                            Asia/Kolkata (IST - UTC +05:30)
                          </option>
                          <option value="UTC (Greenwich Mean Time)">
                            UTC (Greenwich Mean Time)
                          </option>
                          <option value="America/New_York (EST - UTC -05:00)">
                            America/New_York (EST - UTC -05:00)
                          </option>
                          <option value="Europe/London (BST - UTC +01:00)">
                            Europe/London (BST - UTC +01:00)
                          </option>
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
                          Date Format
                        </label>
                        <select
                          value={generalSettings.dateFormat}
                          onChange={(e) =>
                            setGeneralSettings((prev) => ({
                              ...prev,
                              dateFormat: e.target.value,
                            }))
                          }
                          style={{
                            width: "100%",
                            padding: "9px 12px",
                            borderRadius: "8px",
                            border: "1px solid #D1D5DB",
                            fontSize: "13px",
                            background: "#FFFFFF",
                          }}
                        >
                          <option value="DD/MM/YYYY">
                            DD/MM/YYYY (31/12/2026)
                          </option>
                          <option value="MM/DD/YYYY">
                            MM/DD/YYYY (12/31/2026)
                          </option>
                          <option value="YYYY-MM-DD">
                            YYYY-MM-DD (2026-12-31)
                          </option>
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
                          Time Format
                        </label>
                        <select
                          value={generalSettings.timeFormat}
                          onChange={(e) =>
                            setGeneralSettings((prev) => ({
                              ...prev,
                              timeFormat: e.target.value,
                            }))
                          }
                          style={{
                            width: "100%",
                            padding: "9px 12px",
                            borderRadius: "8px",
                            border: "1px solid #D1D5DB",
                            fontSize: "13px",
                            background: "#FFFFFF",
                          }}
                        >
                          <option value="12 Hour">
                            12 Hour (09:30 AM / 04:15 PM)
                          </option>
                          <option value="24 Hour">
                            24 Hour (09:30 / 16:15)
                          </option>
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
                          Week Starts On
                        </label>
                        <select
                          value={generalSettings.weekStartsOn}
                          onChange={(e) =>
                            setGeneralSettings((prev) => ({
                              ...prev,
                              weekStartsOn: e.target.value,
                            }))
                          }
                          style={{
                            width: "100%",
                            padding: "9px 12px",
                            borderRadius: "8px",
                            border: "1px solid #D1D5DB",
                            fontSize: "13px",
                            background: "#FFFFFF",
                          }}
                        >
                          <option value="Monday">Monday</option>
                          <option value="Sunday">Sunday</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* ACCORDION 02: Application Defaults */}
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "16px",
                    border:
                      expandedAccordion === "accordion-2"
                        ? "2px solid #0D47A1"
                        : "1px solid #E5E7EB",
                    overflow: "hidden",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    onClick={() =>
                      setExpandedAccordion(
                        expandedAccordion === "accordion-2"
                          ? null
                          : "accordion-2",
                      )
                    }
                    style={{
                      padding: "18px 20px",
                      background:
                        expandedAccordion === "accordion-2"
                          ? "#F0F7FF"
                          : "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
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
                        <Building2 size={18} style={{ color: "#0D47A1" }} />
                      </div>
                      <div>
                        <h3
                          style={{
                            fontFamily: PP,
                            fontSize: "15px",
                            fontWeight: 700,
                            color: "#111827",
                            margin: 0,
                          }}
                        >
                          Application Defaults
                        </h3>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#64748B",
                            margin: "2px 0 0 0",
                          }}
                        >
                          Configure basic HMS application defaults.
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          padding: "3px 8px",
                          borderRadius: "12px",
                          background: "#E8F5E9",
                          color: "#2E7D32",
                        }}
                      >
                        Configured
                      </span>
                      {expandedAccordion === "accordion-2" ? (
                        <ChevronDown size={18} style={{ color: "#0D47A1" }} />
                      ) : (
                        <ChevronRight size={18} style={{ color: "#94A3B8" }} />
                      )}
                    </div>
                  </div>

                  {expandedAccordion === "accordion-2" && (
                    <div
                      style={{
                        padding: "20px",
                        borderTop: "1px solid #E5E7EB",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          gap: "16px",
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
                            Hospital Display Name *
                          </label>
                          <input
                            type="text"
                            value={generalSettings.hospitalDisplayName}
                            onChange={(e) =>
                              setGeneralSettings((prev) => ({
                                ...prev,
                                hospitalDisplayName: e.target.value,
                              }))
                            }
                            placeholder="St. Jude Multispecialty Hospital"
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
                            Hospital Short Code *
                          </label>
                          <input
                            type="text"
                            value={generalSettings.hospitalShortCode}
                            onChange={(e) =>
                              setGeneralSettings((prev) => ({
                                ...prev,
                                hospitalShortCode: e.target.value,
                              }))
                            }
                            placeholder="SJH-01"
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
                            Default Landing Dashboard
                          </label>
                          <select
                            value={generalSettings.defaultLandingDashboard}
                            onChange={(e) =>
                              setGeneralSettings((prev) => ({
                                ...prev,
                                defaultLandingDashboard: e.target.value,
                              }))
                            }
                            style={{
                              width: "100%",
                              padding: "9px 12px",
                              borderRadius: "8px",
                              border: "1px solid #D1D5DB",
                              fontSize: "13px",
                              background: "#FFFFFF",
                            }}
                          >
                            <option value="Super Admin Operations Center">
                              Super Admin Operations Center
                            </option>
                            <option value="Hospital Executive Summary">
                              Hospital Executive Summary
                            </option>
                            <option value="OPD Clinical Dashboard">
                              OPD Clinical Dashboard
                            </option>
                            <option value="Reception Counter Dashboard">
                              Reception Counter Dashboard
                            </option>
                          </select>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          gap: "16px",
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
                            Default Working Shift
                          </label>
                          <select
                            value={generalSettings.defaultWorkingShift}
                            onChange={(e) =>
                              setGeneralSettings((prev) => ({
                                ...prev,
                                defaultWorkingShift: e.target.value,
                              }))
                            }
                            style={{
                              width: "100%",
                              padding: "9px 12px",
                              borderRadius: "8px",
                              border: "1px solid #D1D5DB",
                              fontSize: "13px",
                              background: "#FFFFFF",
                            }}
                          >
                            <option value="Morning (08:00 AM - 04:00 PM)">
                              Morning (08:00 AM - 04:00 PM)
                            </option>
                            <option value="Evening (04:00 PM - 12:00 AM)">
                              Evening (04:00 PM - 12:00 AM)
                            </option>
                            <option value="Night Shift (12:00 AM - 08:00 AM)">
                              Night Shift (12:00 AM - 08:00 AM)
                            </option>
                            <option value="24/7 Rotational Schedule">
                              24/7 Rotational Schedule
                            </option>
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
                            Auto Logout Duration
                          </label>
                          <select
                            value={generalSettings.autoLogoutDuration}
                            onChange={(e) =>
                              setGeneralSettings((prev) => ({
                                ...prev,
                                autoLogoutDuration: e.target.value,
                              }))
                            }
                            disabled={!generalSettings.enableAutoLogout}
                            style={{
                              width: "100%",
                              padding: "9px 12px",
                              borderRadius: "8px",
                              border: "1px solid #D1D5DB",
                              fontSize: "13px",
                              background: "#FFFFFF",
                              opacity: generalSettings.enableAutoLogout
                                ? 1
                                : 0.6,
                            }}
                          >
                            <option value="15 Minutes">
                              15 Minutes (HIPAA Standard)
                            </option>
                            <option value="30 Minutes">30 Minutes</option>
                            <option value="60 Minutes">60 Minutes</option>
                          </select>
                        </div>
                      </div>

                      <div
                        style={{
                          background: "#F8FAFC",
                          padding: "12px 14px",
                          borderRadius: "10px",
                          border: "1px solid #E2E8F0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: 600,
                              color: "#111827",
                            }}
                          >
                            Enable Auto Logout
                          </div>
                          <div style={{ fontSize: "11px", color: "#64748B" }}>
                            Automatically locks workstation session after period
                            of inactivity
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={generalSettings.enableAutoLogout}
                          onChange={(e) =>
                            setGeneralSettings((prev) => ({
                              ...prev,
                              enableAutoLogout: e.target.checked,
                            }))
                          }
                          style={{
                            accentColor: "#0D47A1",
                            width: "18px",
                            height: "18px",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* ACCORDION 03: Display Preferences */}
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "16px",
                    border:
                      expandedAccordion === "accordion-3"
                        ? "2px solid #0D47A1"
                        : "1px solid #E5E7EB",
                    overflow: "hidden",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    onClick={() =>
                      setExpandedAccordion(
                        expandedAccordion === "accordion-3"
                          ? null
                          : "accordion-3",
                      )
                    }
                    style={{
                      padding: "18px 20px",
                      background:
                        expandedAccordion === "accordion-3"
                          ? "#F0F7FF"
                          : "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          background: "#FEF3C7",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Sliders size={18} style={{ color: "#B45309" }} />
                      </div>
                      <div>
                        <h3
                          style={{
                            fontFamily: PP,
                            fontSize: "15px",
                            fontWeight: 700,
                            color: "#111827",
                            margin: 0,
                          }}
                        >
                          Display Preferences
                        </h3>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#64748B",
                            margin: "2px 0 0 0",
                          }}
                        >
                          Configure application appearance.
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          padding: "3px 8px",
                          borderRadius: "12px",
                          background: "#E8F5E9",
                          color: "#2E7D32",
                        }}
                      >
                        Configured
                      </span>
                      {expandedAccordion === "accordion-3" ? (
                        <ChevronDown size={18} style={{ color: "#0D47A1" }} />
                      ) : (
                        <ChevronRight size={18} style={{ color: "#94A3B8" }} />
                      )}
                    </div>
                  </div>

                  {expandedAccordion === "accordion-3" && (
                    <div
                      style={{
                        padding: "20px",
                        borderTop: "1px solid #E5E7EB",
                        display: "flex",
                        flexDirection: "column",
                        gap: "14px",
                      }}
                    >
                      <div style={{ maxWidth: "320px" }}>
                        <label
                          style={{
                            display: "block",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#374151",
                            marginBottom: "6px",
                          }}
                        >
                          Default Theme
                        </label>
                        <select
                          value={generalSettings.defaultTheme}
                          onChange={(e) =>
                            setGeneralSettings((prev) => ({
                              ...prev,
                              defaultTheme: e.target.value,
                            }))
                          }
                          style={{
                            width: "100%",
                            padding: "9px 12px",
                            borderRadius: "8px",
                            border: "1px solid #D1D5DB",
                            fontSize: "13px",
                            background: "#FFFFFF",
                          }}
                        >
                          <option value="Light">
                            Light (Healthcare Standard)
                          </option>
                          <option value="Dark">Dark Mode</option>
                          <option value="System">
                            System Preference Match
                          </option>
                        </select>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "12px",
                        }}
                      >
                        {[
                          {
                            title: "Compact Table View",
                            sub: "Reduces padding for high density data rosters",
                            key: "compactTableView",
                          },
                          {
                            title: "Enable Animations",
                            sub: "Smooth transitions and interactive micro-animations",
                            key: "enableAnimations",
                          },
                          {
                            title: "Show Breadcrumb Navigation",
                            sub: "Displays top contextual trail on all module headers",
                            key: "showBreadcrumbs",
                          },
                          {
                            title: "Enable Tooltips",
                            sub: "Shows informative hover tooltips across data tables",
                            key: "enableTooltips",
                          },
                        ].map((pref, idx) => (
                          <div
                            key={idx}
                            style={{
                              background: "#F8FAFC",
                              padding: "12px 14px",
                              borderRadius: "10px",
                              border: "1px solid #E2E8F0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  fontSize: "13px",
                                  fontWeight: 600,
                                  color: "#111827",
                                }}
                              >
                                {pref.title}
                              </div>
                              <div
                                style={{ fontSize: "11px", color: "#64748B" }}
                              >
                                {pref.sub}
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              checked={Boolean(
                                generalSettings[
                                  pref.key as keyof typeof generalSettings
                                ],
                              )}
                              onChange={(e) =>
                                setGeneralSettings((prev) => ({
                                  ...prev,
                                  [pref.key]: e.target.checked,
                                }))
                              }
                              style={{
                                accentColor: "#0D47A1",
                                width: "18px",
                                height: "18px",
                                cursor: "pointer",
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ACCORDION 04: Operational Preferences */}
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "16px",
                    border:
                      expandedAccordion === "accordion-4"
                        ? "2px solid #0D47A1"
                        : "1px solid #E5E7EB",
                    overflow: "hidden",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    onClick={() =>
                      setExpandedAccordion(
                        expandedAccordion === "accordion-4"
                          ? null
                          : "accordion-4",
                      )
                    }
                    style={{
                      padding: "18px 20px",
                      background:
                        expandedAccordion === "accordion-4"
                          ? "#F0F7FF"
                          : "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
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
                        <Clock size={18} style={{ color: "#2E7D32" }} />
                      </div>
                      <div>
                        <h3
                          style={{
                            fontFamily: PP,
                            fontSize: "15px",
                            fontWeight: 700,
                            color: "#111827",
                            margin: 0,
                          }}
                        >
                          Operational Preferences
                        </h3>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#64748B",
                            margin: "2px 0 0 0",
                          }}
                        >
                          Configure operational defaults.
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          padding: "3px 8px",
                          borderRadius: "12px",
                          background: "#E8F5E9",
                          color: "#2E7D32",
                        }}
                      >
                        Configured
                      </span>
                      {expandedAccordion === "accordion-4" ? (
                        <ChevronDown size={18} style={{ color: "#0D47A1" }} />
                      ) : (
                        <ChevronRight size={18} style={{ color: "#94A3B8" }} />
                      )}
                    </div>
                  </div>

                  {expandedAccordion === "accordion-4" && (
                    <div
                      style={{
                        padding: "20px",
                        borderTop: "1px solid #E5E7EB",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          gap: "16px",
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
                            Default Appointment Duration
                          </label>
                          <select
                            value={generalSettings.defaultApptDuration}
                            onChange={(e) =>
                              setGeneralSettings((prev) => ({
                                ...prev,
                                defaultApptDuration: e.target.value,
                              }))
                            }
                            style={{
                              width: "100%",
                              padding: "9px 12px",
                              borderRadius: "8px",
                              border: "1px solid #D1D5DB",
                              fontSize: "13px",
                              background: "#FFFFFF",
                            }}
                          >
                            <option value="15 Minutes">15 Minutes</option>
                            <option value="20 Minutes">20 Minutes</option>
                            <option value="30 Minutes">
                              30 Minutes (Standard)
                            </option>
                            <option value="45 Minutes">45 Minutes</option>
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
                            Queue Token Prefix
                          </label>
                          <input
                            type="text"
                            value={generalSettings.queueTokenPrefix}
                            onChange={(e) =>
                              setGeneralSettings((prev) => ({
                                ...prev,
                                queueTokenPrefix: e.target.value,
                              }))
                            }
                            placeholder="OPD"
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
                            Default Patient Search Mode
                          </label>
                          <select
                            value={generalSettings.defaultPatientSearchMode}
                            onChange={(e) =>
                              setGeneralSettings((prev) => ({
                                ...prev,
                                defaultPatientSearchMode: e.target.value,
                              }))
                            }
                            style={{
                              width: "100%",
                              padding: "9px 12px",
                              borderRadius: "8px",
                              border: "1px solid #D1D5DB",
                              fontSize: "13px",
                              background: "#FFFFFF",
                            }}
                          >
                            <option value="MRN / Name">
                              MRN / Name (Instant)
                            </option>
                            <option value="Phone Number">Phone Number</option>
                            <option value="National Identity ID">
                              National Identity ID
                            </option>
                          </select>
                        </div>
                      </div>

                      <div
                        style={{
                          background: "#F8FAFC",
                          padding: "12px 14px",
                          borderRadius: "10px",
                          border: "1px solid #E2E8F0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: 600,
                              color: "#111827",
                            }}
                          >
                            Enable Confirmation Dialogs
                          </div>
                          <div style={{ fontSize: "11px", color: "#64748B" }}>
                            Prompts safety confirmation before saving critical
                            record changes
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={generalSettings.enableConfirmationDialogs}
                          onChange={(e) =>
                            setGeneralSettings((prev) => ({
                              ...prev,
                              enableConfirmationDialogs: e.target.checked,
                            }))
                          }
                          style={{
                            accentColor: "#0D47A1",
                            width: "18px",
                            height: "18px",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RECENT CONFIGURATION ACTIVITY TIMELINE */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: "16px",
                  border: "1px solid #E5E7EB",
                  padding: "20px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: PP,
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#111827",
                      margin: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Clock size={18} style={{ color: "#0D47A1" }} /> Recent
                    Configuration Activity
                  </h3>
                  <span style={{ fontSize: "11px", color: "#64748B" }}>
                    Audit Event Trail
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {[
                    {
                      user: "Super Admin (Dr. Rajesh)",
                      date: "26/07/2026",
                      time: "10:15 AM",
                      action: "Hospital Name Updated",
                      status: "Success",
                    },
                    {
                      user: "Admin (Sarah Jenkins)",
                      date: "25/07/2026",
                      time: "04:30 PM",
                      action: "Theme Changed to Light Mode",
                      status: "Updated",
                    },
                    {
                      user: "Super Admin (Dr. Rajesh)",
                      date: "24/07/2026",
                      time: "11:00 AM",
                      action: "Timezone Updated to Asia/Kolkata",
                      status: "Success",
                    },
                    {
                      user: "Security Auditor",
                      date: "23/07/2026",
                      time: "02:15 PM",
                      action: "Session Timeout Modified to 15 Minutes",
                      status: "Configured",
                    },
                    {
                      user: "Admin (Sarah Jenkins)",
                      date: "22/07/2026",
                      time: "09:45 AM",
                      action: "Date Format Updated to DD/MM/YYYY",
                      status: "Updated",
                    },
                  ].map((act, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        background: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            background: "#E3F2FD",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Sliders size={16} style={{ color: "#0D47A1" }} />
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: 600,
                              color: "#111827",
                            }}
                          >
                            {act.action}
                          </div>
                          <div
                            style={{
                              fontSize: "11px",
                              color: "#64748B",
                              marginTop: "2px",
                            }}
                          >
                            User: <strong>{act.user}</strong>
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                        }}
                      >
                        <span style={{ fontSize: "11px", color: "#94A3B8" }}>
                          {act.date} • {act.time}
                        </span>
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: "4px",
                            background: "#E8F5E9",
                            color: "#2E7D32",
                          }}
                        >
                          {act.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CONFIGURATION SUMMARY CARD (In normal flow) */}
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
                    margin: "0 0 14px 0",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <CheckCircle2 size={18} style={{ color: "#009688" }} />{" "}
                  General Configuration Summary
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: "16px",
                    background: "#F8FAFC",
                    padding: "16px",
                    borderRadius: "12px",
                    border: "1px solid #E2E8F0",
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
                      Total Settings
                    </span>
                    <span
                      style={{
                        fontFamily: PP,
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "#111827",
                      }}
                    >
                      18 Parameters
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
                      Configured
                    </span>
                    <span
                      style={{
                        fontFamily: PP,
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "#2E7D32",
                      }}
                    >
                      17 Parameters
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
                      Pending
                    </span>
                    <span
                      style={{
                        fontFamily: PP,
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "#B45309",
                      }}
                    >
                      1 Parameter
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
                      Last Updated
                    </span>
                    <span
                      style={{
                        fontFamily: PP,
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      Today, 10:15 AM
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
                      Updated By
                    </span>
                    <span
                      style={{
                        fontFamily: PP,
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#0D47A1",
                      }}
                    >
                      Super Admin
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : activeMenu === "hospital-info" ? (
            <HospitalInformationWorkspace />
          ) : activeMenu === "roles-permissions" ? (
            <UserRolesPermissionsWorkspace />
          ) : activeMenu === "appointments" ? (
            <AppointmentConfigurationWorkspace />
          ) : activeMenu === "billing" ? (
            <BillingConfigurationWorkspace />
          ) : activeMenu === "notifications" ? (
            <NotificationCommunicationWorkspace />
          ) : activeMenu === "security" ? (
            <SecuritySettingsWorkspace />
          ) : activeMenu === "backup" ? (
            <BackupMaintenanceWorkspace />
          ) : null}
        </div>
      </div>

      {/* ─── BOTTOM STICKY ACTION BAR ────────────────────────────────────── */}
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
            Active View:{" "}
            <strong>
              {quickConfigCards.find((q) => q.id === activeMenu)?.title ||
                "Settings Workspace"}
            </strong>
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
            onClick={() => {
              setActiveMenu("general");
              setSaveStatus(null);
            }}
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
            onClick={() => setShowResetWarning(true)}
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
            onClick={handleSave}
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

      {/* RESET WARNING MODAL */}
      {showResetWarning && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.4)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 110,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              maxWidth: "440px",
              width: "100%",
              padding: "24px",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "14px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "#FEF3C7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <AlertTriangle size={20} style={{ color: "#B45309" }} />
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: PP,
                    fontSize: "16px",
                    fontWeight: 700,
                    margin: 0,
                    color: "#111827",
                  }}
                >
                  Reset General Settings?
                </h3>
                <span style={{ fontSize: "11px", color: "#64748B" }}>
                  Confirmation Required
                </span>
              </div>
            </div>

            <p
              style={{
                fontSize: "13px",
                color: "#475569",
                lineHeight: "1.5",
                margin: "0 0 20px 0",
              }}
            >
              Are you sure you want to reset all General Settings parameters
              back to default system values? Any unsaved regional, display, and
              operational changes will be discarded.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                onClick={() => setShowResetWarning(false)}
                style={{
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
                onClick={() => {
                  setGeneralSettings({
                    defaultLanguage: "English",
                    timezone: "Asia/Kolkata (IST - UTC +05:30)",
                    dateFormat: "DD/MM/YYYY",
                    timeFormat: "12 Hour",
                    weekStartsOn: "Monday",
                    hospitalDisplayName: "St. Jude Multispecialty Hospital",
                    hospitalShortCode: "SJH-01",
                    defaultLandingDashboard: "Super Admin Operations Center",
                    defaultWorkingShift: "Morning (08:00 AM - 04:00 PM)",
                    enableAutoLogout: true,
                    autoLogoutDuration: "15 Minutes",
                    compactTableView: false,
                    enableAnimations: true,
                    showBreadcrumbs: true,
                    enableTooltips: true,
                    defaultTheme: "Light",
                    defaultApptDuration: "30 Minutes",
                    queueTokenPrefix: "OPD",
                    defaultPatientSearchMode: "MRN / Name",
                    enableConfirmationDialogs: true,
                  });
                  setShowResetWarning(false);
                  setSaveStatus("Settings reset to default values");
                  setTimeout(() => setSaveStatus(null), 3000);
                }}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#EF4444",
                  color: "#FFFFFF",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(239,68,68,0.2)",
                }}
              >
                Reset All Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
