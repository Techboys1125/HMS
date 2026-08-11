import { useState, useMemo, useCallback } from "react";
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
  Info,
} from "lucide-react";
import {
  useMainAuditLogs,
  useLoginHistoryLogs,
  useUserActivityLogs,
  useDataChangeLogs,
  useDeletedRecordLogs,
  useSystemLogLogs,
  useAuditDashboard,
  useLoginHistoryDashboard,
  useUserActivitiesDashboard,
  useDataChangesDashboard,
  useDeletedRecordsDashboard,
  useSystemLogsDashboard,
} from "../hooks/useAuditLog";
import { QUICK_ACTION_CARDS } from "../constants/auditlog-cards";
import { SeverityBadge, StatusBadge } from "../components/AuditBadges";
import { AuditLogDetailsPage } from "./AuditLogDetailsPage";
import type { AuditCategory, AuditRecord } from "../types/auditlog.types";

const PP = "Poppins, sans-serif";
const RB = "Roboto, sans-serif";

function safeArray<T>(data: T[] | undefined | null): T[] {
  return Array.isArray(data) ? data : [];
}

function safeNum(val: number | undefined | null): number {
  return typeof val === "number" && !isNaN(val) ? val : 0;
}

export function AuditLogManagementPage() {
  const [currentWorkspace, setCurrentWorkspace] =
    useState<AuditCategory>("All Logs");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("All Time");
  const [selectedModule, setSelectedModule] = useState("All");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedUser, setSelectedUser] = useState("All");
  const [selectedSeverity, setSelectedSeverity] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedEventType, setSelectedEventType] = useState("All");
  const [activeDetailsRecord, setActiveDetailsRecord] =
    useState<AuditRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleWorkspaceChange = useCallback((ws: AuditCategory) => {
    setCurrentWorkspace(ws);
    setPage(0);
  }, []);

  const mainLogsQuery = useMainAuditLogs({ page, size: pageSize });
  const loginLogsQuery = useLoginHistoryLogs({ page, size: pageSize });
  const userActivityLogsQuery = useUserActivityLogs({ page, size: pageSize });
  const dataChangeLogsQuery = useDataChangeLogs({ page, size: pageSize });
  const deletedRecordLogsQuery = useDeletedRecordLogs({ page, size: pageSize });
  const systemLogLogsQuery = useSystemLogLogs({ page, size: pageSize });

  const allDashboardQuery = useAuditDashboard();
  const loginDashboardQuery = useLoginHistoryDashboard();
  const userActivitiesDashQuery = useUserActivitiesDashboard();
  const dataChangesDashQuery = useDataChangesDashboard();
  const deletedRecordsDashQuery = useDeletedRecordsDashboard();
  const systemLogsDashQuery = useSystemLogsDashboard();

  const activeQuery = useMemo(() => {
    switch (currentWorkspace) {
      case "Login History":
        return loginLogsQuery;
      case "User Activities":
        return userActivityLogsQuery;
      case "Data Changes":
        return dataChangeLogsQuery;
      case "Deleted Records":
        return deletedRecordLogsQuery;
      case "System Logs":
        return systemLogLogsQuery;
      default:
        return mainLogsQuery;
    }
  }, [
    currentWorkspace,
    mainLogsQuery,
    loginLogsQuery,
    userActivityLogsQuery,
    dataChangeLogsQuery,
    deletedRecordLogsQuery,
    systemLogLogsQuery,
  ]);

  const isLoading = activeQuery.isLoading;
  const apiRecords = safeArray(activeQuery.data?.content);
  const allRecords = safeArray(mainLogsQuery.data?.content);
  const totalElements = activeQuery.data?.totalElements ?? allRecords.length;

  const filteredRecords = useMemo(() => {
    return apiRecords.filter((record) => {
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const match =
          (record.id || "").toLowerCase().includes(q) ||
          (record.user || "").toLowerCase().includes(q) ||
          (record.module || "").toLowerCase().includes(q) ||
          (record.action || "").toLowerCase().includes(q) ||
          (record.description || "").toLowerCase().includes(q) ||
          (record.ipAddress || "").toLowerCase().includes(q) ||
          (record.recordId && record.recordId.toLowerCase().includes(q));
        if (!match) return false;
      }
      if (
        selectedModule !== "All" &&
        !(record.module || "")
          .toUpperCase()
          .includes(selectedModule.toUpperCase().replace(/_/g, " "))
      )
        return false;
      if (
        selectedRole !== "All" &&
        (record.userRole || "").toUpperCase().replace(/\s+/g, "_") !==
          selectedRole.toUpperCase().replace(/\s+/g, "_")
      )
        return false;
      if (selectedUser !== "All" && record.user !== selectedUser) return false;
      if (selectedSeverity !== "All" && record.severity !== selectedSeverity)
        return false;
      if (selectedStatus !== "All" && record.status !== selectedStatus)
        return false;
      return true;
    });
  }, [
    apiRecords,
    searchQuery,
    selectedModule,
    selectedRole,
    selectedUser,
    selectedSeverity,
    selectedStatus,
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

  const getKpiCards = () => {
    const dash = allDashboardQuery.data;
    const loginDash = loginDashboardQuery.data;
    const userDash = userActivitiesDashQuery.data;
    const dataDash = dataChangesDashQuery.data;
    const deletedDash = deletedRecordsDashQuery.data;
    const sysDash = systemLogsDashQuery.data;

    const fmtTrend = (v?: number) => {
      if (v === undefined || v === null) return "--";
      return v >= 0 ? `+${v}%` : `${v}%`;
    };

    switch (currentWorkspace) {
      case "Login History":
        return [
          {
            title: "Successful Logins",
            value: safeNum(loginDash?.successfulLogins),
            color: "bg-emerald-50 text-emerald-700",
            trend: fmtTrend(loginDash?.trend),
            Icon: LogIn,
          },
          {
            title: "Failed Logins",
            value: safeNum(loginDash?.failedAttempts),
            color: "bg-red-50 text-red-700",
            trend: fmtTrend(loginDash ? -loginDash.trend : undefined),
            Icon: AlertTriangle,
          },
          {
            title: "Locked Accounts",
            value: safeNum(loginDash?.lockedAccounts),
            color: "bg-amber-50 text-amber-700",
            trend: "0 Today",
            Icon: Lock,
          },
          {
            title: "Active Sessions",
            value: safeNum(loginDash?.totalLogins),
            color: "bg-blue-50 text-blue-700",
            trend: "Live",
            Icon: Users,
          },
        ];
      case "User Activities":
        return [
          {
            title: "Total Activities",
            value: safeNum(userDash?.totalActivities),
            color: "bg-purple-50 text-purple-700",
            trend: fmtTrend(userDash?.trend),
            Icon: Activity,
          },
          {
            title: "High Priority",
            value: safeNum(userDash?.highPriority),
            color: "bg-amber-50 text-amber-700",
            trend: fmtTrend(userDash?.trend),
            Icon: AlertTriangle,
          },
          {
            title: "Today's Actions",
            value: safeNum(userDash?.todayActions),
            color: "bg-blue-50 text-blue-700",
            trend: "Active",
            Icon: Clock,
          },
          {
            title: "Most Active User",
            value: userDash?.mostActiveUser?.fullName ?? "--",
            color: "bg-teal-50 text-teal-700",
            trend: userDash?.mostActiveUser?.role?.replace(/_/g, " ") || "--",
            Icon: Users,
          },
        ];
      case "Data Changes":
        return [
          {
            title: "Modified Records",
            value: safeNum(dataDash?.modifiedRecords),
            color: "bg-teal-50 text-teal-700",
            trend: fmtTrend(dataDash?.trend),
            Icon: Database,
          },
          {
            title: "Patient Updates",
            value: safeNum(dataDash?.patientUpdates),
            color: "bg-blue-50 text-blue-700",
            trend: fmtTrend(dataDash?.trend),
            Icon: Users,
          },
          {
            title: "Doctor Updates",
            value: safeNum(dataDash?.doctorUpdates),
            color: "bg-indigo-50 text-indigo-700",
            trend: fmtTrend(dataDash?.trend),
            Icon: Activity,
          },
          {
            title: "Billing Changes",
            value: safeNum(dataDash?.billingChanges),
            color: "bg-purple-50 text-purple-700",
            trend: fmtTrend(dataDash?.trend),
            Icon: FileText,
          },
        ];
      case "Deleted Records":
        return [
          {
            title: "Records Deleted",
            value: safeNum(deletedDash?.recordsDeleted),
            color: "bg-amber-50 text-amber-700",
            trend: fmtTrend(deletedDash?.trend),
            Icon: Trash2,
          },
          {
            title: "Restored",
            value: safeNum(deletedDash?.restored),
            color: "bg-gray-50 text-gray-700",
            trend: "Disabled",
            Icon: RotateCcw,
          },
          {
            title: "Permanent Delete",
            value: safeNum(deletedDash?.permanentDelete),
            color: "bg-red-50 text-red-700",
            trend: "Immutable",
            Icon: Lock,
          },
          {
            title: "Pending Review",
            value: safeNum(deletedDash?.pendingReview),
            color: "bg-blue-50 text-blue-700",
            trend: "Admin",
            Icon: Info,
          },
        ];
      case "System Logs":
        return [
          {
            title: "Services Running",
            value: `${safeNum(sysDash?.servicesRunning)}/${safeNum(sysDash?.totalServices)}`,
            color: "bg-emerald-50 text-emerald-700",
            trend: fmtTrend(sysDash?.trend),
            Icon: Server,
          },
          {
            title: "Background Jobs",
            value: safeNum(sysDash?.backgroundJobs),
            color: "bg-indigo-50 text-indigo-700",
            trend: "Completed",
            Icon: Activity,
          },
          {
            title: "Warning Events",
            value: safeNum(sysDash?.warningEvents),
            color: "bg-amber-50 text-amber-700",
            trend: fmtTrend(sysDash?.trend),
            Icon: AlertTriangle,
          },
          {
            title: "Critical Events",
            value: safeNum(sysDash?.criticalEvents),
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
            value: safeNum(dash?.totalAuditEvents),
            color: "bg-blue-50 text-blue-700",
            trend: fmtTrend(dash?.trends?.totalAuditEvents),
            Icon: Activity,
          },
          {
            title: "Successful Logins",
            value: safeNum(dash?.successfulLogins),
            color: "bg-emerald-50 text-emerald-700",
            trend: fmtTrend(dash?.trends?.successfulLogins),
            Icon: LogIn,
          },
          {
            title: "User Activities",
            value: safeNum(dash?.userActivities),
            color: "bg-purple-50 text-purple-700",
            trend: fmtTrend(dash?.trends?.userActivities),
            Icon: Users,
          },
          {
            title: "Data Changes",
            value: safeNum(dash?.dataChanges),
            color: "bg-teal-50 text-teal-700",
            trend: fmtTrend(dash?.trends?.dataChanges),
            Icon: Database,
          },
          {
            title: "Deleted Records",
            value: safeNum(dash?.deletedRecords),
            color: "bg-amber-50 text-amber-700",
            trend: fmtTrend(dash?.trends?.deletedRecords),
            Icon: Trash2,
          },
          {
            title: "Critical Events",
            value: safeNum(dash?.criticalEvents),
            color: "bg-red-50 text-red-700",
            trend: fmtTrend(dash?.trends?.criticalEvents),
            Icon: AlertTriangle,
          },
        ];
    }
  };

  if (activeDetailsRecord) {
    return (
      <AuditLogDetailsPage
        recordId={activeDetailsRecord.id}
        onBack={() => setActiveDetailsRecord(null)}
        onNavigateCategory={(cat) => {
          handleWorkspaceChange(cat);
          setActiveDetailsRecord(null);
        }}
      />
    );
  }

  const kpiCards = getKpiCards();

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]"
      style={{ fontFamily: RB }}
    >
      {toastMessage && (
        <div className="fixed bottom-16 right-6 z-50 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 border border-gray-700 text-sm animate-bounce">
          <AlertTriangle className="w-5 h-5 text-emerald-400" />
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
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span
                className="hover:text-gray-700 cursor-pointer"
                onClick={() => handleWorkspaceChange("All Logs")}
              >
                Hospital
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span
                className="hover:text-gray-700 cursor-pointer"
                onClick={() => handleWorkspaceChange("All Logs")}
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
                  onClick={() => handleWorkspaceChange("All Logs")}
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
          <div className="flex flex-wrap items-center gap-2.5">
            {currentWorkspace !== "All Logs" && (
              <button
                onClick={() => handleWorkspaceChange("All Logs")}
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
              onClick={() => {
                activeQuery.refetch();
                showToast("Refreshed audit event stream.");
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm"
              style={{ backgroundColor: "#0D47A1" }}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${kpiCards.length > 4 ? "6" : "4"} gap-4`}
      >
        {kpiCards.map((card) => {
          const CardIcon = card.Icon;
          const displayValue =
            typeof card.value === "number"
              ? card.value.toLocaleString()
              : card.value;
          return (
            <div
              key={card.title}
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
                  {displayValue}
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

      {/* RECENT CRITICAL EVENTS */}
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
              {allRecords.filter((r) => r.severity === "Critical").length}{" "}
              Priority Alerts
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {allRecords
              .filter((r) => r.severity === "Critical")
              .slice(0, 3)
              .map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 rounded-xl border border-gray-200 bg-red-50/30 hover:border-red-300 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <SeverityBadge severity={alert.severity} />
                    <span className="text-[11px] font-mono text-gray-500">
                      {(alert.timestamp || "").split(" ")[1] || alert.timestamp}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900">
                    {alert.action}
                  </h4>
                  <p className="text-[11px] text-gray-600 line-clamp-2">
                    {alert.description}
                  </p>
                  <div className="pt-2 flex justify-between items-center border-t border-gray-100">
                    <span className="text-[11px] font-semibold text-blue-900">
                      {alert.module}
                    </span>
                    <button
                      onClick={() => setActiveDetailsRecord(alert)}
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

      {/* QUICK ACTIONS */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {QUICK_ACTION_CARDS.map((card) => {
            const CardIcon = card.icon;
            const isActive = currentWorkspace === card.id;
            return (
              <button
                key={card.id}
                onClick={() => {
                  handleWorkspaceChange(card.id);
                  showToast(`Opened ${card.title} Workspace.`);
                }}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group relative overflow-hidden ${isActive ? "bg-blue-900 text-white border-blue-900 shadow-md ring-2 ring-blue-700 ring-offset-1" : "bg-white text-gray-900 border-gray-200 hover:border-blue-300 hover:shadow-md"}`}
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

      {/* SEARCH & FILTERS */}
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
                <option value="PATIENT_MANAGEMENT">Patient Management</option>
                <option value="DOCTOR_MANAGEMENT">Doctor Management</option>
                <option value="APPOINTMENTS">Appointments</option>
                <option value="CONSULTATION">Consultation</option>
                <option value="PRESCRIPTION">Prescription</option>
                <option value="BILLING">Billing</option>
                <option value="RECEPTION">Reception</option>
                <option value="REPORTS">Reports</option>
                <option value="SETTINGS">Settings</option>
                <option value="AUTHENTICATION">Authentication</option>
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
                <option value="ADMINISTRATION">Administration</option>
                <option value="CARDIOLOGY">Cardiology</option>
                <option value="PEDIATRICS">Pediatrics</option>
                <option value="OPD_RECEPTION">OPD Reception</option>
                <option value="ACCOUNTS_AND_BILLING">Accounts & Billing</option>
                <option value="IT_SYSTEMS">IT Systems</option>
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
                <option value="HOSPITAL_ADMIN">Hospital Admin</option>
                <option value="DOCTOR">Doctor</option>
                <option value="RECEPTIONIST">Receptionist</option>
                <option value="ACCOUNTANT">Accountant</option>
                <option value="NURSE">Nurse</option>
                <option value="SYSTEM">System</option>
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
                {[...new Set(allRecords.map((r) => r.user || "Unknown"))]
                  .sort()
                  .map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
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
                <option value="USER_LOGIN_SUCCESS">User Login Success</option>
                <option value="MULTIPLE_FAILED_LOGIN_ATTEMPTS">
                  Failed Logins
                </option>
                <option value="PATIENT_DETAILS_MODIFIED">Data Changes</option>
                <option value="CANCELLED_INVOICE_DELETED">
                  Deleted Records
                </option>
                <option value="AUTOMATED_REPORT_BACKUP">System Events</option>
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

      {/* AUDIT TABLE */}
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
            {isLoading
              ? "Loading..."
              : `${filteredRecords.length} Records Loaded`}
          </span>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto animate-spin">
                <RefreshCw className="w-8 h-8" />
              </div>
              <div>
                <h3
                  className="text-base font-bold text-gray-800"
                  style={{ fontFamily: PP }}
                >
                  Loading Audit Logs...
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                  Fetching audit records from the server.
                </p>
              </div>
            </div>
          ) : filteredRecords.length === 0 ? (
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
                            <SeverityBadge severity={rec.severity} />
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            <StatusBadge status={rec.status} />
                          </td>
                        </>
                      )}
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
                            <StatusBadge status={rec.status} />
                          </td>
                        </>
                      )}
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
                            <StatusBadge status={rec.status} />
                          </td>
                        </>
                      )}
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
                            <StatusBadge status={rec.status} />
                          </td>
                        </>
                      )}
                      {currentWorkspace === "System Logs" && (
                        <>
                          <td className="p-3.5 whitespace-nowrap">
                            <SeverityBadge severity={rec.severity} />
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
                            <StatusBadge status={rec.status} />
                          </td>
                        </>
                      )}
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

      {/* BOTTOM FOOTER */}
      <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur border-t border-gray-200 px-6 py-3 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>Last Updated: {new Date().toLocaleTimeString()}</span>
        </div>
        <div className="text-xs font-semibold text-gray-700">
          Workspace:{" "}
          <span className="text-blue-900 font-bold">{currentWorkspace}</span> (
          {filteredRecords.length} of {totalElements} Records)
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              activeQuery.refetch();
              showToast("Refreshed audit feed.");
            }}
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
