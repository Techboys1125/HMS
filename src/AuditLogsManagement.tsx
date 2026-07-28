import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Printer,
  RefreshCw,
  ChevronRight,
  Activity,
  LogIn,
  Database,
  Trash2,
  Server,
  AlertTriangle,
  CheckCircle2,
  Info,
  Eye,
  X,
  RotateCcw,
  FileSpreadsheet,
  FileText,
  Layers,
  Clock,
  Lock,
  Users,
  ArrowUpRight,
  ArrowLeft,
} from "lucide-react";
import { AuditLogDetailsWorkspace } from "./AuditLogDetailsWorkspace";

// --- Typography Tokens ---
const PP = "Poppins, sans-serif";
const RB = "Roboto, sans-serif";

// --- Types ---
export type AuditCategory =
  | "All Logs"
  | "Login History"
  | "User Activities"
  | "Data Changes"
  | "Deleted Records"
  | "System Logs";

export type AuditSeverity = "Information" | "Success" | "Warning" | "Critical";

export type AuditStatus = "Success" | "Failed" | "Warning" | "Blocked";

export type AuditRecord = {
  id: string;
  timestamp: string;
  category: Exclude<AuditCategory, "All Logs">;
  module: string;
  user: string;
  userRole: string;
  userAvatar?: string;
  department: string;
  action: string;
  description: string;
  severity: AuditSeverity;
  status: AuditStatus;
  ipAddress: string;
  device: string;
  browser: string;
  sessionDuration?: string;
  loginTime?: string;
  logoutTime?: string;
  recordId?: string;
  fieldChanged?: string;
  oldValue?: string;
  newValue?: string;
  deletionReason?: string;
  systemEventCode?: string;
};

// Quick Actions Configuration Dataset
const QUICK_ACTION_CARDS: {
  id: AuditCategory;
  title: string;
  description: string;
  icon: typeof Layers;
  color: string;
  bg: string;
  border: string;
  badge: string;
}[] = [
  {
    id: "All Logs",
    title: "All Logs",
    description: "Comprehensive audit log view across all Phase 1 modules.",
    icon: Layers,
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    badge: "18,964 Records",
  },
  {
    id: "Login History",
    title: "Login History",
    description:
      "Track user authentication, login attempts, & session timeouts.",
    icon: LogIn,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    badge: "2,845 Events",
  },
  {
    id: "User Activities",
    title: "User Activities",
    description: "Monitor clinical, receptionist, & admin operational actions.",
    icon: Activity,
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
    badge: "8,326 Actions",
  },
  {
    id: "Data Changes",
    title: "Data Changes",
    description: "Field-level before/after diffs for patient & doctor records.",
    icon: Database,
    color: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-200",
    badge: "4,281 Changes",
  },
  {
    id: "Deleted Records",
    title: "Deleted Records",
    description: "Cancelled invoices & draft booking removals with reasons.",
    icon: Trash2,
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "842 Deletions",
  },
  {
    id: "System Logs",
    title: "System Logs",
    description: "Automated background tasks, security rules, & system events.",
    icon: Server,
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    badge: "2,670 Events",
  },
];

// Mock Audit Logs Dataset (18,964 Total Audit Records Snapshot - Phase 1 Only)
const MOCK_AUDIT_RECORDS: AuditRecord[] = [
  {
    id: "LOG-18964",
    timestamp: "2026-07-26 11:45:00",
    category: "Login History",
    module: "Authentication",
    user: "Dr. Arjun Mehta",
    userRole: "Doctor",
    department: "Cardiology",
    action: "User Login Success",
    description: "Successful multi-factor authentication session created.",
    severity: "Success",
    status: "Success",
    ipAddress: "192.168.1.104",
    device: "Desktop (Windows 11 Workstation)",
    browser: "Chrome 126.0 (64-bit)",
    sessionDuration: "Active (2h 15m)",
    loginTime: "2026-07-26 11:45:00",
    logoutTime: "-",
  },
  {
    id: "LOG-18963",
    timestamp: "2026-07-26 11:38:02",
    category: "Deleted Records",
    module: "Billing",
    user: "Sarah Jenkins",
    userRole: "Hospital Admin",
    department: "Administration",
    action: "Cancelled Invoice Deleted",
    description:
      "Cancelled duplicate draft invoice INV-2026-0892 removed permanently.",
    severity: "Critical",
    status: "Success",
    ipAddress: "192.168.1.12",
    device: "Desktop (macOS Sonoma Admin Workstation)",
    browser: "Edge 126.0 (Mac)",
    recordId: "INV-2026-0892",
    deletionReason:
      "Duplicate draft billing record created accidentally during system sync.",
  },
  {
    id: "LOG-18962",
    timestamp: "2026-07-26 11:30:45",
    category: "Data Changes",
    module: "Patient Management",
    user: "Elena Rostova",
    userRole: "Receptionist",
    department: "OPD Reception",
    action: "Patient Details Modified",
    description:
      "Updated emergency contact number and insurance policy number for patient P-10024.",
    severity: "Information",
    status: "Success",
    ipAddress: "192.168.1.45",
    device: "Desktop (Windows 10 Reception Terminal)",
    browser: "Chrome 126.0",
    recordId: "P-10024",
    fieldChanged: "Emergency Contact Phone",
    oldValue: "+1 (555) 019-2831",
    newValue: "+1 (555) 998-1122",
  },
  {
    id: "LOG-18961",
    timestamp: "2026-07-26 11:15:30",
    category: "User Activities",
    module: "Prescription",
    user: "Dr. Priya Sharma",
    userRole: "Doctor",
    department: "Pediatrics",
    action: "Prescription Issued",
    description:
      "Issued e-prescription RX-49201 for Patient P-10088 containing 3 medications.",
    severity: "Success",
    status: "Success",
    ipAddress: "192.168.1.112",
    device: "Tablet (iPad Pro Clinical Mobile)",
    browser: "Safari Mobile 17.4",
    recordId: "RX-49201",
  },
  {
    id: "LOG-18960",
    timestamp: "2026-07-26 11:02:18",
    category: "Login History",
    module: "Authentication",
    user: "Multiple Failed Attempts (admin_root)",
    userRole: "Hospital Admin",
    department: "Administration",
    action: "Multiple Failed Login Attempts",
    description:
      "Invalid password provided 5 consecutive times from unauthorized external IP.",
    severity: "Critical",
    status: "Failed",
    ipAddress: "185.220.101.5",
    device: "Unknown Linux Server Device",
    browser: "Automated Script (Python-urllib)",
    sessionDuration: "0s",
    loginTime: "2026-07-26 11:02:18",
    logoutTime: "2026-07-26 11:02:18",
  },
  {
    id: "LOG-18959",
    timestamp: "2026-07-26 10:55:40",
    category: "System Logs",
    module: "Reports",
    user: "System Automated Job",
    userRole: "System",
    department: "IT Systems",
    action: "Automated Report Backup",
    description:
      "Daily financial and operational audit backup snapshot compiled successfully.",
    severity: "Information",
    status: "Success",
    ipAddress: "127.0.0.1 (Localhost)",
    device: "Internal HMS Core App Server",
    browser: "HMS Engine Service v4.2",
    systemEventCode: "SYS-BACKUP-200",
  },
  {
    id: "LOG-18958",
    timestamp: "2026-07-26 10:48:12",
    category: "User Activities",
    module: "Appointments",
    user: "David Ross",
    userRole: "Accountant",
    department: "Accounts & Billing",
    action: "Appointment Rescheduled",
    description:
      "Rescheduled Appointment APT-8821 for Dr. Arjun Mehta per patient phone request.",
    severity: "Information",
    status: "Success",
    ipAddress: "192.168.1.33",
    device: "Desktop (Windows 11 Finance PC)",
    browser: "Firefox 127.0",
    recordId: "APT-8821",
  },
  {
    id: "LOG-18957",
    timestamp: "2026-07-26 10:30:00",
    category: "Data Changes",
    module: "Doctor Management",
    user: "Sarah Jenkins",
    userRole: "Hospital Admin",
    department: "Administration",
    action: "Doctor Consultation Fee Updated",
    description:
      "Doctor schedule and OPD consultation fee updated for Dr. Vikram Patel.",
    severity: "Warning",
    status: "Success",
    ipAddress: "192.168.1.12",
    device: "Desktop (macOS Sonoma Admin Workstation)",
    browser: "Edge 126.0 (Mac)",
    recordId: "DOC-104",
    fieldChanged: "OPD Consultation Fee",
    oldValue: "$120.00",
    newValue: "$150.00",
  },
  {
    id: "LOG-18956",
    timestamp: "2026-07-26 10:15:22",
    category: "User Activities",
    module: "Consultation",
    user: "Dr. Arjun Mehta",
    userRole: "Doctor",
    department: "Cardiology",
    action: "OPD Consultation Closed",
    description:
      "Completed consultation session CON-9041 and saved clinical notes.",
    severity: "Success",
    status: "Success",
    ipAddress: "192.168.1.104",
    device: "Desktop (Windows 11 Workstation)",
    browser: "Chrome 126.0 (64-bit)",
    recordId: "CON-9041",
  },
  {
    id: "LOG-18955",
    timestamp: "2026-07-26 09:50:11",
    category: "Deleted Records",
    module: "Appointments",
    user: "Elena Rostova",
    userRole: "Receptionist",
    department: "OPD Reception",
    action: "Draft Appointment Cancelled",
    description:
      "Removed unconfirmed draft booking APT-8810 due to patient no-show.",
    severity: "Warning",
    status: "Success",
    ipAddress: "192.168.1.45",
    device: "Desktop (Windows 10 Reception Terminal)",
    browser: "Chrome 126.0",
    recordId: "APT-8810",
    deletionReason: "Patient cancelled via telephone 2 hours prior.",
  },
  {
    id: "LOG-18954",
    timestamp: "2026-07-26 09:30:45",
    category: "System Logs",
    module: "Settings",
    user: "Sarah Jenkins",
    userRole: "Hospital Admin",
    department: "Administration",
    action: "Security Policy Updated",
    description:
      "Enforced mandatory 90-day password expiration rule for all clinical staff.",
    severity: "Warning",
    status: "Success",
    ipAddress: "192.168.1.12",
    device: "Desktop (macOS Sonoma Admin Workstation)",
    browser: "Edge 126.0 (Mac)",
    systemEventCode: "CFG-SEC-909",
  },
  {
    id: "LOG-18953",
    timestamp: "2026-07-26 09:12:00",
    category: "Login History",
    module: "Authentication",
    user: "Sarah Jenkins",
    userRole: "Hospital Admin",
    department: "Administration",
    action: "User Login Success",
    description:
      "Admin console initial daily session established successfully.",
    severity: "Success",
    status: "Success",
    ipAddress: "192.168.1.12",
    device: "Desktop (macOS Sonoma Admin Workstation)",
    browser: "Edge 126.0 (Mac)",
    sessionDuration: "Active (2h 33m)",
    loginTime: "2026-07-26 09:12:00",
    logoutTime: "-",
  },
  {
    id: "LOG-18952",
    timestamp: "2026-07-26 08:45:10",
    category: "User Activities",
    module: "Reception",
    user: "Elena Rostova",
    userRole: "Receptionist",
    department: "OPD Reception",
    action: "Patient Checked In",
    description: "Checked in patient P-10090 for scheduled OPD consultation.",
    severity: "Information",
    status: "Success",
    ipAddress: "192.168.1.45",
    device: "Desktop (Windows 10 Reception Terminal)",
    browser: "Chrome 126.0",
    recordId: "P-10090",
  },
  {
    id: "LOG-18951",
    timestamp: "2026-07-26 08:10:33",
    category: "System Logs",
    module: "Authentication",
    user: "System Gateway",
    userRole: "System",
    department: "IT Systems",
    action: "Permission Denied Alert",
    description:
      "Unauthorized access attempt to Restricted Role Management API blocked.",
    severity: "Critical",
    status: "Blocked",
    ipAddress: "192.168.1.88",
    device: "Unrecognized Client PC",
    browser: "PostmanRuntime/7.39",
    systemEventCode: "SYS-SEC-403",
  },
];

export default function AuditLogsManagementScreen() {
  // Navigation State: 'Dashboard' (Main Audit Center) or a Specific Workspace
  const [currentWorkspace, setCurrentWorkspace] =
    useState<AuditCategory>("All Logs");

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("All Time");
  const [selectedModule, setSelectedModule] = useState("All");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedUser, setSelectedUser] = useState("All");
  const [selectedSeverity, setSelectedSeverity] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedEventType, setSelectedEventType] = useState("All");

  // Full Details Workspace State
  const [activeDetailsRecord, setActiveDetailsRecord] =
    useState<AuditRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter Logic based on active workspace + search & dropdown filters
  const filteredRecords = useMemo(() => {
    return MOCK_AUDIT_RECORDS.filter((record) => {
      // Workspace / Category Filter
      if (
        currentWorkspace !== "All Logs" &&
        record.category !== currentWorkspace
      ) {
        return false;
      }

      // Search Query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const match =
          record.id.toLowerCase().includes(q) ||
          record.user.toLowerCase().includes(q) ||
          record.module.toLowerCase().includes(q) ||
          record.action.toLowerCase().includes(q) ||
          record.description.toLowerCase().includes(q) ||
          record.ipAddress.toLowerCase().includes(q) ||
          record.device.toLowerCase().includes(q) ||
          (record.recordId && record.recordId.toLowerCase().includes(q));
        if (!match) return false;
      }

      // Dropdown Filters
      if (
        selectedDepartment !== "All" &&
        record.department !== selectedDepartment
      )
        return false;
      if (selectedRole !== "All" && record.userRole !== selectedRole)
        return false;
      if (selectedModule !== "All" && record.module !== selectedModule)
        return false;
      if (selectedUser !== "All" && record.user !== selectedUser) return false;
      if (selectedSeverity !== "All" && record.severity !== selectedSeverity)
        return false;
      if (selectedStatus !== "All" && record.status !== selectedStatus)
        return false;
      if (selectedEventType !== "All" && record.action !== selectedEventType)
        return false;

      return true;
    });
  }, [
    currentWorkspace,
    searchQuery,
    selectedDepartment,
    selectedRole,
    selectedModule,
    selectedUser,
    selectedSeverity,
    selectedStatus,
    selectedEventType,
  ]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedDateRange("All Time");
    setSelectedDepartment("All");
    setSelectedRole("All");
    setSelectedModule("All");
    setSelectedUser("All");
    setSelectedSeverity("All");
    setSelectedStatus("All");
    setSelectedEventType("All");
    showToast("Filters reset to default.");
  };

  // Helper Badge Renderers
  const renderSeverityBadge = (severity: AuditSeverity) => {
    switch (severity) {
      case "Critical":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            Critical
          </span>
        );
      case "Warning":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Warning
          </span>
        );
      case "Success":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Success
          </span>
        );
      case "Information":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            Information
          </span>
        );
    }
  };

  const renderStatusBadge = (status: AuditStatus) => {
    switch (status) {
      case "Failed":
      case "Blocked":
        return (
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-600 border border-red-200">
            {status}
          </span>
        );
      case "Warning":
        return (
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            {status}
          </span>
        );
      case "Success":
      default:
        return (
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            {status}
          </span>
        );
    }
  };

  // Render Full Audit Details Workspace when activeDetailsRecord is selected
  if (activeDetailsRecord) {
    return (
      <AuditLogDetailsWorkspace
        record={activeDetailsRecord}
        onBack={() => setActiveDetailsRecord(null)}
        onNavigateCategory={(cat) => {
          setCurrentWorkspace(cat);
          setActiveDetailsRecord(null);
        }}
      />
    );
  }

  // Dynamic KPI Card Config depending on currentWorkspace
  const getKpiCards = () => {
    switch (currentWorkspace) {
      case "Login History":
        return [
          {
            title: "Successful Logins",
            value: "2,845",
            color: "bg-emerald-50 text-emerald-700",
            trend: "+5.2%",
            Icon: LogIn,
          },
          {
            title: "Failed Logins",
            value: "142",
            color: "bg-red-50 text-red-700",
            trend: "-2.1%",
            Icon: AlertTriangle,
          },
          {
            title: "Locked Accounts",
            value: "4",
            color: "bg-amber-50 text-amber-700",
            trend: "0 Today",
            Icon: Lock,
          },
          {
            title: "Active Sessions",
            value: "88",
            color: "bg-blue-50 text-blue-700",
            trend: "Live",
            Icon: Users,
          },
        ];
      case "User Activities":
        return [
          {
            title: "Total Activities",
            value: "8,326",
            color: "bg-purple-50 text-purple-700",
            trend: "+8.7%",
            Icon: Activity,
          },
          {
            title: "High Priority",
            value: "312",
            color: "bg-amber-50 text-amber-700",
            trend: "+1.2%",
            Icon: AlertTriangle,
          },
          {
            title: "Today's Actions",
            value: "689",
            color: "bg-blue-50 text-blue-700",
            trend: "Active",
            Icon: Clock,
          },
          {
            title: "Most Active User",
            value: "Sarah J.",
            color: "bg-teal-50 text-teal-700",
            trend: "Admin",
            Icon: Users,
          },
        ];
      case "Data Changes":
        return [
          {
            title: "Modified Records",
            value: "4,281",
            color: "bg-teal-50 text-teal-700",
            trend: "-1.4%",
            Icon: Database,
          },
          {
            title: "Patient Updates",
            value: "2,140",
            color: "bg-blue-50 text-blue-700",
            trend: "+4.5%",
            Icon: Users,
          },
          {
            title: "Doctor Updates",
            value: "980",
            color: "bg-indigo-50 text-indigo-700",
            trend: "+0.8%",
            Icon: Activity,
          },
          {
            title: "Billing Changes",
            value: "1,161",
            color: "bg-purple-50 text-purple-700",
            trend: "+2.0%",
            Icon: FileText,
          },
        ];
      case "Deleted Records":
        return [
          {
            title: "Records Deleted",
            value: "842",
            color: "bg-amber-50 text-amber-700",
            trend: "-3.1%",
            Icon: Trash2,
          },
          {
            title: "Restored",
            value: "0",
            color: "bg-gray-50 text-gray-700",
            trend: "Disabled",
            Icon: RotateCcw,
          },
          {
            title: "Permanent Delete",
            value: "842",
            color: "bg-red-50 text-red-700",
            trend: "Immutable",
            Icon: Lock,
          },
          {
            title: "Pending Review",
            value: "12",
            color: "bg-blue-50 text-blue-700",
            trend: "Admin",
            Icon: Info,
          },
        ];
      case "System Logs":
        return [
          {
            title: "Services Running",
            value: "24/24",
            color: "bg-emerald-50 text-emerald-700",
            trend: "100% Operational",
            Icon: Server,
          },
          {
            title: "Background Jobs",
            value: "1,420",
            color: "bg-indigo-50 text-indigo-700",
            trend: "Completed",
            Icon: Activity,
          },
          {
            title: "Warning Events",
            value: "142",
            color: "bg-amber-50 text-amber-700",
            trend: "-0.5%",
            Icon: AlertTriangle,
          },
          {
            title: "Critical Events",
            value: "18",
            color: "bg-red-50 text-red-700",
            trend: "Alert",
            Icon: AlertTriangle,
          },
        ];
      case "All Logs":
      default:
        return [
          {
            title: "Total Audit Events",
            value: "18,964",
            color: "bg-blue-50 text-blue-700",
            trend: "+12.4%",
            Icon: Activity,
          },
          {
            title: "Successful Logins",
            value: "2,845",
            color: "bg-emerald-50 text-emerald-700",
            trend: "+5.2%",
            Icon: LogIn,
          },
          {
            title: "User Activities",
            value: "8,326",
            color: "bg-purple-50 text-purple-700",
            trend: "+8.7%",
            Icon: Users,
          },
          {
            title: "Data Changes",
            value: "4,281",
            color: "bg-teal-50 text-teal-700",
            trend: "-1.4%",
            Icon: Database,
          },
          {
            title: "Deleted Records",
            value: "842",
            color: "bg-amber-50 text-amber-700",
            trend: "-3.1%",
            Icon: Trash2,
          },
          {
            title: "Critical Events",
            value: "34",
            color: "bg-red-50 text-red-700",
            trend: "+2 Today",
            Icon: AlertTriangle,
          },
        ];
    }
  };

  const kpiCards = getKpiCards();

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]"
      style={{ fontFamily: RB }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-16 right-6 z-50 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 border border-gray-700 text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* PAGE HEADER */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span
                className="hover:text-gray-700 cursor-pointer"
                onClick={() => setCurrentWorkspace("All Logs")}
              >
                Hospital
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span
                className="hover:text-gray-700 cursor-pointer"
                onClick={() => setCurrentWorkspace("All Logs")}
              >
                Audit Logs
              </span>
              {currentWorkspace !== "All Logs" && (
                <>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold text-gray-800">
                    {currentWorkspace}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              {currentWorkspace !== "All Logs" && (
                <button
                  onClick={() => setCurrentWorkspace("All Logs")}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  title="Back to All Audit Logs"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1
                  className="text-2xl font-bold text-gray-900"
                  style={{ fontFamily: PP }}
                >
                  {currentWorkspace === "All Logs"
                    ? "Audit Logs Workspace"
                    : `${currentWorkspace} Workspace`}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {currentWorkspace === "All Logs"
                    ? "Centralized audit dashboard to monitor user access, activities, data changes and system events."
                    : `Dedicated workspace displaying complete immutable logs for ${currentWorkspace}.`}
                </p>
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {currentWorkspace !== "All Logs" && (
              <button
                onClick={() => setCurrentWorkspace("All Logs")}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                All Logs Overview
              </button>
            )}
            <button
              onClick={() => showToast("Exporting PDF audit trail...")}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4 text-red-600" />
              Export PDF
            </button>
            <button
              onClick={() => showToast("Exporting Excel audit log...")}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Export Excel
            </button>
            <button
              onClick={() => showToast("Sending audit trail to printer...")}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4 text-gray-600" />
              Print
            </button>
            <button
              onClick={() => showToast("Refreshed audit event stream.")}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm"
              style={{ backgroundColor: "#0D47A1" }}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* ROW 1 — DYNAMIC WORKSPACE KPI CARDS */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${kpiCards.length > 4 ? "6" : "4"} gap-4`}
      >
        {kpiCards.map((card, idx) => {
          const CardIcon = card.Icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}
                >
                  <CardIcon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {card.trend}
                </span>
              </div>
              <div className="mt-4">
                <div
                  className="text-2xl font-bold text-gray-900"
                  style={{ fontFamily: PP }}
                >
                  {card.value}
                </div>
                <div className="text-xs font-medium text-gray-500 mt-1">
                  {card.title}
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                <span>Weekly trend</span>
                <div className="flex items-end gap-0.5 h-4">
                  <div className="w-1 bg-blue-300 h-2 rounded-t" />
                  <div className="w-1 bg-blue-400 h-3 rounded-t" />
                  <div className="w-1 bg-blue-500 h-2.5 rounded-t" />
                  <div className="w-1 bg-blue-600 h-4 rounded-t" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION: RECENT CRITICAL EVENTS (MAIN DASHBOARD VIEW) */}
      {currentWorkspace === "All Logs" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3
                className="text-base font-bold text-gray-900"
                style={{ fontFamily: PP }}
              >
                Recent Critical Events
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Immediate security, financial, and operational audit alerts.
              </p>
            </div>
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200">
              5 Priority Alerts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Multiple Failed Login Attempts",
                time: "2026-07-26 11:02:18",
                module: "Authentication",
                desc: "5 failed login attempts detected from IP 185.220.101.5.",
                severity: "Critical" as AuditSeverity,
              },
              {
                title: "Invoice Cancellation & Deletion",
                time: "2026-07-26 11:38:02",
                module: "Billing",
                desc: "Invoice INV-2026-0892 deleted by Admin Sarah Jenkins.",
                severity: "Critical" as AuditSeverity,
              },
              {
                title: "Permission Denied Alert",
                time: "2026-07-26 08:10:33",
                module: "Authentication",
                desc: "Unauthorized access attempt to Restricted Role API blocked.",
                severity: "Critical" as AuditSeverity,
              },
            ].map((alert, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-gray-200 bg-red-50/30 hover:border-red-300 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  {renderSeverityBadge(alert.severity)}
                  <span className="text-[11px] font-mono text-gray-500">
                    {alert.time.split(" ")[1]}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-gray-900">
                  {alert.title}
                </h4>
                <p className="text-[11px] text-gray-600 line-clamp-2">
                  {alert.desc}
                </p>
                <div className="pt-2 flex justify-between items-center border-t border-gray-100">
                  <span className="text-[11px] font-semibold text-blue-900">
                    {alert.module}
                  </span>
                  <button
                    onClick={() =>
                      setActiveDetailsRecord(MOCK_AUDIT_RECORDS[4])
                    }
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
                  >
                    View Details <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CHANGE 01: QUICK ACTIONS SECTION (REPLACES CATEGORY TABS) */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3
              className="text-base font-bold text-gray-900"
              style={{ fontFamily: PP }}
            >
              Audit Workspaces & Quick Actions
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Select an audit workspace to open dedicated log records, metrics,
              and filter streams.
            </p>
          </div>
          <span className="text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            6 Workspaces Available
          </span>
        </div>

        {/* 6 REUSABLE QUICK ACTION CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {QUICK_ACTION_CARDS.map((card) => {
            const CardIcon = card.icon;
            const isActive = currentWorkspace === card.id;
            return (
              <button
                key={card.id}
                onClick={() => {
                  setCurrentWorkspace(card.id);
                  showToast(`Opened ${card.title} Workspace.`);
                }}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group relative overflow-hidden ${
                  isActive
                    ? "bg-blue-900 text-white border-blue-900 shadow-md ring-2 ring-blue-700 ring-offset-1"
                    : "bg-white text-gray-900 border-gray-200 hover:border-blue-300 hover:shadow-md"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${isActive ? "bg-white/20 text-white" : `${card.bg} ${card.color}`}`}
                    >
                      <CardIcon className="w-5 h-5" />
                    </div>
                    <ArrowUpRight
                      className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${isActive ? "text-white" : "text-gray-400 group-hover:text-blue-900"}`}
                    />
                  </div>
                  <h4
                    className={`text-sm font-bold ${isActive ? "text-white" : "text-gray-900"}`}
                    style={{ fontFamily: PP }}
                  >
                    {card.title}
                  </h4>
                  <p
                    className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${isActive ? "text-blue-100" : "text-gray-500"}`}
                  >
                    {card.description}
                  </p>
                </div>
                <div
                  className={`mt-4 pt-2 border-t text-[10px] font-bold tracking-wider uppercase flex items-center justify-between ${isActive ? "border-white/20 text-blue-200" : "border-gray-100 text-gray-400"}`}
                >
                  <span>{card.badge}</span>
                  {isActive && (
                    <span className="px-1.5 py-0.5 rounded bg-white/20 text-white font-mono text-[9px]">
                      ACTIVE
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search in ${currentWorkspace} (User, Module, Patient, Doctor, Invoice, Record ID, Event ID)...`}
            className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
          />
        </div>

        {/* FILTER BAR DROPDOWNS */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Date Range
              </label>
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="w-full text-xs py-2 px-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All Time">All Time</option>
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Module
              </label>
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="w-full text-xs py-2 px-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All">All Modules</option>
                <option value="Patient Management">Patient Management</option>
                <option value="Doctor Management">Doctor Management</option>
                <option value="Appointments">Appointments</option>
                <option value="Consultation">Consultation</option>
                <option value="Prescription">Prescription</option>
                <option value="Billing">Billing</option>
                <option value="Reception">Reception</option>
                <option value="Reports">Reports</option>
                <option value="Settings">Settings</option>
                <option value="Authentication">Authentication</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full text-xs py-2 px-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All">All Departments</option>
                <option value="Administration">Administration</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="OPD Reception">OPD Reception</option>
                <option value="Accounts & Billing">Accounts & Billing</option>
                <option value="IT Systems">IT Systems</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full text-xs py-2 px-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All">All Roles</option>
                <option value="Hospital Admin">Hospital Admin</option>
                <option value="Doctor">Doctor</option>
                <option value="Receptionist">Receptionist</option>
                <option value="Accountant">Accountant</option>
                <option value="Nurse">Nurse</option>
                <option value="System">System</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                User
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full text-xs py-2 px-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All">All Users</option>
                <option value="Dr. Arjun Mehta">Dr. Arjun Mehta</option>
                <option value="Sarah Jenkins">Sarah Jenkins</option>
                <option value="Elena Rostova">Elena Rostova</option>
                <option value="Dr. Priya Sharma">Dr. Priya Sharma</option>
                <option value="David Ross">David Ross</option>
                <option value="System Automated Job">
                  System Automated Job
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Severity
              </label>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="w-full text-xs py-2 px-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All">All Severities</option>
                <option value="Information">Information</option>
                <option value="Success">Success</option>
                <option value="Warning">Warning</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full text-xs py-2 px-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All">All Statuses</option>
                <option value="Success">Success</option>
                <option value="Failed">Failed</option>
                <option value="Warning">Warning</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Event Type
              </label>
              <select
                value={selectedEventType}
                onChange={(e) => setSelectedEventType(e.target.value)}
                className="w-full text-xs py-2 px-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All">All Event Types</option>
                <option value="User Login Success">User Login Success</option>
                <option value="Multiple Failed Login Attempts">
                  Failed Logins
                </option>
                <option value="Patient Details Modified">Data Changes</option>
                <option value="Cancelled Invoice Deleted">
                  Deleted Records
                </option>
                <option value="Automated Report Backup">System Events</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 mt-3 border-t border-gray-100">
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
            <button
              onClick={() =>
                showToast(
                  `Applied filters. Showing ${filteredRecords.length} records.`,
                )
              }
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white rounded-lg transition-colors shadow-sm"
              style={{ backgroundColor: "#0D47A1" }}
            >
              <Filter className="w-3.5 h-3.5" />
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* DYNAMIC AUDIT TABLE FOR CURRENT WORKSPACE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-900" />
            <h3
              className="text-sm font-bold text-gray-900"
              style={{ fontFamily: PP }}
            >
              {currentWorkspace} Table Stream
            </h3>
          </div>
          <span className="text-xs font-semibold text-gray-500 font-mono">
            {filteredRecords.length} Records Loaded
          </span>
        </div>

        <div className="p-6">
          {filteredRecords.length === 0 ? (
            /* EMPTY STATE */
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h3
                  className="text-base font-bold text-gray-800"
                  style={{ fontFamily: PP }}
                >
                  No Audit Records Found
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                  No audit records match the selected filters in{" "}
                  {currentWorkspace}.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors"
                style={{ backgroundColor: "#0D47A1" }}
              >
                <RotateCcw className="w-4 h-4" />
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                    {currentWorkspace === "All Logs" && (
                      <>
                        <th className="p-3.5">Timestamp</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">User</th>
                        <th className="p-3.5">Role</th>
                        <th className="p-3.5">Module</th>
                        <th className="p-3.5">Action</th>
                        <th className="p-3.5">Severity</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">View</th>
                      </>
                    )}
                    {currentWorkspace === "Login History" && (
                      <>
                        <th className="p-3.5">User</th>
                        <th className="p-3.5">Role</th>
                        <th className="p-3.5">Login Time</th>
                        <th className="p-3.5">Logout Time</th>
                        <th className="p-3.5">IP Address</th>
                        <th className="p-3.5">Device</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">View</th>
                      </>
                    )}
                    {currentWorkspace === "User Activities" && (
                      <>
                        <th className="p-3.5">User</th>
                        <th className="p-3.5">Module</th>
                        <th className="p-3.5">Action</th>
                        <th className="p-3.5">Description</th>
                        <th className="p-3.5">Timestamp</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">View</th>
                      </>
                    )}
                    {currentWorkspace === "Data Changes" && (
                      <>
                        <th className="p-3.5">Module</th>
                        <th className="p-3.5">Record</th>
                        <th className="p-3.5">Field</th>
                        <th className="p-3.5 text-red-600">Old Value</th>
                        <th className="p-3.5 text-emerald-600">New Value</th>
                        <th className="p-3.5">Modified By</th>
                        <th className="p-3.5">Timestamp</th>
                        <th className="p-3.5 text-right">View</th>
                      </>
                    )}
                    {currentWorkspace === "Deleted Records" && (
                      <>
                        <th className="p-3.5">Record</th>
                        <th className="p-3.5">Module</th>
                        <th className="p-3.5">Deleted By</th>
                        <th className="p-3.5">Reason</th>
                        <th className="p-3.5">Deleted Time</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">View</th>
                      </>
                    )}
                    {currentWorkspace === "System Logs" && (
                      <>
                        <th className="p-3.5">Severity</th>
                        <th className="p-3.5">Event</th>
                        <th className="p-3.5">Module</th>
                        <th className="p-3.5">Description</th>
                        <th className="p-3.5">Timestamp</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">View</th>
                      </>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white font-medium text-gray-800">
                  {filteredRecords.map((rec) => (
                    <tr
                      key={rec.id}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      {/* ALL LOGS */}
                      {currentWorkspace === "All Logs" && (
                        <>
                          <td className="p-3.5 whitespace-nowrap text-gray-500 font-mono">
                            {rec.timestamp}
                          </td>
                          <td className="p-3.5 whitespace-nowrap font-semibold text-gray-700">
                            {rec.category}
                          </td>
                          <td className="p-3.5 whitespace-nowrap font-bold text-gray-900">
                            {rec.user}
                          </td>
                          <td className="p-3.5 whitespace-nowrap text-gray-600">
                            {rec.userRole}
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded bg-gray-100 font-medium text-gray-700">
                              {rec.module}
                            </span>
                          </td>
                          <td className="p-3.5 font-semibold text-blue-950">
                            {rec.action}
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            {renderSeverityBadge(rec.severity)}
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            {renderStatusBadge(rec.status)}
                          </td>
                        </>
                      )}

                      {/* LOGIN HISTORY */}
                      {currentWorkspace === "Login History" && (
                        <>
                          <td className="p-3.5 whitespace-nowrap font-bold text-gray-900">
                            {rec.user}
                          </td>
                          <td className="p-3.5 whitespace-nowrap text-gray-600">
                            {rec.userRole}
                          </td>
                          <td className="p-3.5 whitespace-nowrap font-mono text-gray-600">
                            {rec.loginTime || rec.timestamp}
                          </td>
                          <td className="p-3.5 whitespace-nowrap font-mono text-gray-500">
                            {rec.logoutTime || "-"}
                          </td>
                          <td className="p-3.5 whitespace-nowrap font-mono text-xs text-gray-600">
                            {rec.ipAddress}
                          </td>
                          <td className="p-3.5 whitespace-nowrap text-gray-600 max-w-xs truncate">
                            {rec.device}
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            {renderStatusBadge(rec.status)}
                          </td>
                        </>
                      )}

                      {/* USER ACTIVITIES */}
                      {currentWorkspace === "User Activities" && (
                        <>
                          <td className="p-3.5 whitespace-nowrap font-bold text-gray-900">
                            {rec.user}
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-medium border border-purple-100">
                              {rec.module}
                            </span>
                          </td>
                          <td className="p-3.5 font-semibold text-blue-950">
                            {rec.action}
                          </td>
                          <td
                            className="p-3.5 max-w-xs truncate text-gray-500"
                            title={rec.description}
                          >
                            {rec.description}
                          </td>
                          <td className="p-3.5 whitespace-nowrap text-gray-500 font-mono">
                            {rec.timestamp}
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            {renderStatusBadge(rec.status)}
                          </td>
                        </>
                      )}

                      {/* DATA CHANGES */}
                      {currentWorkspace === "Data Changes" && (
                        <>
                          <td className="p-3.5 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 font-medium border border-teal-100">
                              {rec.module}
                            </span>
                          </td>
                          <td className="p-3.5 whitespace-nowrap font-mono font-bold text-blue-700">
                            {rec.recordId || rec.id}
                          </td>
                          <td className="p-3.5 font-semibold text-gray-800">
                            {rec.fieldChanged || "General Data"}
                          </td>
                          <td className="p-3.5 font-mono text-red-600 bg-red-50/50 rounded px-2">
                            {rec.oldValue || "N/A"}
                          </td>
                          <td className="p-3.5 font-mono text-emerald-600 bg-emerald-50/50 rounded px-2">
                            {rec.newValue || "N/A"}
                          </td>
                          <td className="p-3.5 whitespace-nowrap font-bold text-gray-900">
                            {rec.user}
                          </td>
                          <td className="p-3.5 whitespace-nowrap text-gray-500 font-mono">
                            {rec.timestamp}
                          </td>
                        </>
                      )}

                      {/* DELETED RECORDS */}
                      {currentWorkspace === "Deleted Records" && (
                        <>
                          <td className="p-3.5 whitespace-nowrap font-mono font-bold text-red-700">
                            {rec.recordId || rec.id}
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-medium border border-amber-200">
                              {rec.module}
                            </span>
                          </td>
                          <td className="p-3.5 whitespace-nowrap font-bold text-gray-900">
                            {rec.user}
                          </td>
                          <td
                            className="p-3.5 text-gray-600 max-w-xs truncate"
                            title={rec.deletionReason || rec.description}
                          >
                            {rec.deletionReason || rec.description}
                          </td>
                          <td className="p-3.5 whitespace-nowrap text-gray-500 font-mono">
                            {rec.timestamp}
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            {renderStatusBadge(rec.status)}
                          </td>
                        </>
                      )}

                      {/* SYSTEM LOGS */}
                      {currentWorkspace === "System Logs" && (
                        <>
                          <td className="p-3.5 whitespace-nowrap">
                            {renderSeverityBadge(rec.severity)}
                          </td>
                          <td className="p-3.5 font-semibold text-gray-900">
                            {rec.action}
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium border border-indigo-100">
                              {rec.module}
                            </span>
                          </td>
                          <td
                            className="p-3.5 max-w-xs truncate text-gray-500"
                            title={rec.description}
                          >
                            {rec.description}
                          </td>
                          <td className="p-3.5 whitespace-nowrap text-gray-500 font-mono">
                            {rec.timestamp}
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            {renderStatusBadge(rec.status)}
                          </td>
                        </>
                      )}

                      {/* CHANGE 03: VIEW DETAILS OPENS WORKSPACE (NO MODALS) */}
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setActiveDetailsRecord(rec)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors shadow-sm"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM STICKY FOOTER */}
      <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur border-t border-gray-200 px-6 py-3 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>Last Updated: Today 11:52 AM</span>
        </div>

        {/* Center */}
        <div className="text-xs font-semibold text-gray-700">
          Workspace:{" "}
          <span className="text-blue-900 font-bold">{currentWorkspace}</span> (
          {filteredRecords.length} of 18,964 Records)
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast("Refreshed audit feed.")}
            className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={() => showToast("Exporting view...")}
            className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Export
          </button>
          <button
            onClick={() => showToast("Printing audit table...")}
            className="px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-colors shadow-sm"
            style={{ backgroundColor: "#0D47A1" }}
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
}
