import { useCallback, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Database,
  Download,
  Eye,
  Layers,
  Lock,
  LogIn,
  Printer,
  RefreshCw,
  RotateCcw,
  Search,
  Server,
  Trash2,
  Users,
} from "lucide-react";
import {
  useActiveSessions,
  useAuditDashboard,
  useAuditFilterOptions,
  useAuditMetrics,
  useAuditWorkspaces,
  useCriticalEvents,
  useDataChangeLogs,
  useDataChangesDashboard,
  useDeletedRecordLogs,
  useDeletedRecordsDashboard,
  useFailedLoginAttempts,
  useLockedAccounts,
  useLoginHistoryDashboard,
  useLoginHistoryFilterOptions,
  useLoginHistoryLogs,
  useMainAuditLogs,
  useSystemLogLogs,
  useSystemLogsDashboard,
  useUserActivitiesDashboard,
  useUserActivityLogs,
} from "../hooks/useAuditLog";
import { QUICK_ACTION_CARDS } from "../constants/auditlog-cards";
import { SeverityBadge, StatusBadge } from "../components/AuditBadges";
import { AuditLogDetailsPage } from "./AuditLogDetailsPage";
import type {
  AuditCategory,
  AuditFilterOptions,
  AuditLogListParams,
  AuditMetric,
  AuditRecord,
  AuditSelectOption,
} from "../types/auditlog.types";

const PP = "Poppins, sans-serif";
const RB = "Roboto, sans-serif";
const PAGE_SIZE = 20;

type KpiCard = {
  title: string;
  value: number | string;
  trend?: number;
  Icon: typeof Activity;
};

function safeArray<T>(data: T[] | undefined | null): T[] {
  return Array.isArray(data) ? data : [];
}

function display(value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === "") return "—";
  return String(value);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unable to load audit data.";
}

function localDate(date: Date): string {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

function getDateRange(range: string): Pick<AuditLogListParams, "fromDate" | "toDate"> {
  if (range === "All Time") return {};

  const today = new Date();
  const from = new Date(today);

  if (range === "Yesterday") {
    from.setDate(from.getDate() - 1);
    const date = localDate(from);
    return { fromDate: date, toDate: date };
  }

  if (range === "Last 7 Days") from.setDate(from.getDate() - 6);
  if (range === "Last 30 Days") from.setDate(from.getDate() - 29);

  return { fromDate: localDate(from), toDate: localDate(today) };
}

function normalizeCode(value: string | undefined): string {
  return (value || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function matchesCode(value: string | undefined, selected: string): boolean {
  if (selected === "All") return true;
  const actual = normalizeCode(value);
  const expected = normalizeCode(selected);
  return Boolean(actual && expected && (actual === expected || actual.includes(expected) || expected.includes(actual)));
}

function matchesAnyCode(values: Array<string | undefined>, selected: string): boolean {
  return selected === "All" || values.some((value) => matchesCode(value, selected));
}

function isInDateRange(timestamp: string | undefined, range: string): boolean {
  if (range === "All Time" || !timestamp) return true;
  const value = new Date(timestamp).getTime();
  if (Number.isNaN(value)) return true;
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  if (range === "Yesterday") {
    start.setDate(start.getDate() - 1);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return value >= start.getTime() && value < end.getTime();
  }
  if (range === "Today") return value >= start.getTime();
  const days = range === "Last 7 Days" ? 7 : 30;
  start.setDate(start.getDate() - (days - 1));
  return value >= start.getTime();
}

function optionValue(option: AuditSelectOption): string {
  if (typeof option === "string") return option;
  return option.userId || option.code || option.id || option.name || "";
}

function optionLabel(option: AuditSelectOption): string {
  if (typeof option === "string") return option;
  if (option.fullName) {
    return option.role ? `${option.fullName} (${option.role})` : option.fullName;
  }
  return option.name || option.code || option.id || option.userId || "Unknown";
}

function formatTrend(trend: number | undefined): string | null {
  if (trend === undefined || Number.isNaN(trend)) return null;
  return `${trend > 0 ? "+" : ""}${trend}%`;
}

function metricIcon(metric: AuditMetric): typeof Activity {
  const code = `${metric.code} ${metric.label}`.toUpperCase();
  if (code.includes("LOGIN")) return LogIn;
  if (code.includes("CHANGE") || code.includes("UPDATE")) return Database;
  if (code.includes("DELETE")) return Trash2;
  if (code.includes("CRIT") || code.includes("ALERT")) return AlertTriangle;
  return Activity;
}

function downloadCsv(records: AuditRecord[], filename: string): void {
  const header = [
    "Event ID",
    "Timestamp",
    "Category",
    "User",
    "Role",
    "Module",
    "Action",
    "Severity",
    "Status",
    "Description",
  ];
  const rows = records.map((record) => [
    record.id,
    record.timestamp,
    record.category,
    record.user,
    record.userRole,
    record.module,
    record.action,
    record.severity,
    record.status,
    record.description,
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
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
  const [page, setPage] = useState(0);

  const dateRange = useMemo(
    () => getDateRange(selectedDateRange),
    [selectedDateRange],
  );
  const listParams = useMemo<AuditLogListParams>(
    () => ({ page, size: PAGE_SIZE, ...dateRange }),
    [dateRange, page],
  );

  const isAllWorkspace = currentWorkspace === "All Logs";
  const isCriticalWorkspace = currentWorkspace === "Critical Events";
  const isLoginWorkspace = currentWorkspace === "Login History";

  // Shared endpoints are loaded once. Stream and workspace-dashboard calls are
  // only enabled for the selected workspace, preventing unrelated API errors.
  const allDashboardQuery = useAuditDashboard(
    dateRange.fromDate,
    dateRange.toDate,
  );
  const auditMetricsQuery = useAuditMetrics(
    dateRange.fromDate,
    dateRange.toDate,
  );
  const auditWorkspacesQuery = useAuditWorkspaces();
  const auditFilterOptionsQuery = useAuditFilterOptions();
  const loginFilterOptionsQuery = useLoginHistoryFilterOptions(isLoginWorkspace);

  const mainLogsQuery = useMainAuditLogs(listParams, isAllWorkspace);
  const criticalEventsQuery = useCriticalEvents(
    listParams,
    isAllWorkspace || isCriticalWorkspace,
  );
  const loginLogsQuery = useLoginHistoryLogs(listParams, isLoginWorkspace);
  const userActivityLogsQuery = useUserActivityLogs(
    listParams,
    currentWorkspace === "User Activities",
  );
  const dataChangeLogsQuery = useDataChangeLogs(
    listParams,
    currentWorkspace === "Data Changes",
  );
  const deletedRecordLogsQuery = useDeletedRecordLogs(
    listParams,
    currentWorkspace === "Deleted Records",
  );
  const systemLogLogsQuery = useSystemLogLogs(
    listParams,
    currentWorkspace === "System Logs",
  );

  const loginDashboardQuery = useLoginHistoryDashboard(
    dateRange.fromDate,
    dateRange.toDate,
    isLoginWorkspace,
  );
  const userActivitiesDashboardQuery = useUserActivitiesDashboard(
    dateRange.fromDate,
    dateRange.toDate,
    currentWorkspace === "User Activities",
  );
  const dataChangesDashboardQuery = useDataChangesDashboard(
    dateRange.fromDate,
    dateRange.toDate,
    currentWorkspace === "Data Changes",
  );
  const deletedRecordsDashboardQuery = useDeletedRecordsDashboard(
    dateRange.fromDate,
    dateRange.toDate,
    currentWorkspace === "Deleted Records",
  );
  const systemLogsDashboardQuery = useSystemLogsDashboard(
    dateRange.fromDate,
    dateRange.toDate,
    currentWorkspace === "System Logs",
  );

  const activeSessionsQuery = useActiveSessions(listParams, isLoginWorkspace);
  const failedAttemptsQuery = useFailedLoginAttempts(listParams, isLoginWorkspace);
  const lockedAccountsQuery = useLockedAccounts(listParams, isLoginWorkspace);

  const activeQuery =
    currentWorkspace === "Critical Events"
      ? criticalEventsQuery
      : currentWorkspace === "Login History"
        ? loginLogsQuery
        : currentWorkspace === "User Activities"
          ? userActivityLogsQuery
          : currentWorkspace === "Data Changes"
            ? dataChangeLogsQuery
            : currentWorkspace === "Deleted Records"
              ? deletedRecordLogsQuery
              : currentWorkspace === "System Logs"
                ? systemLogLogsQuery
                : mainLogsQuery;

  const apiRecords = safeArray(activeQuery.data?.content);
  const totalElements = activeQuery.data?.totalElements ?? 0;
  const filterOptions: AuditFilterOptions | undefined = isLoginWorkspace
    ? loginFilterOptionsQuery.data ?? auditFilterOptionsQuery.data
    : auditFilterOptionsQuery.data;

  const filteredRecords = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();
    return apiRecords.filter((record) => {
      if (
        search &&
        ![
          record.id,
          record.user,
          record.userId,
          record.module,
          record.action,
          record.description,
          record.ipAddress,
          record.recordId,
          record.eventType,
        ]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(search))
      ) {
        return false;
      }
      if (!isInDateRange(record.timestamp, selectedDateRange)) return false;
      if (!matchesCode(record.module, selectedModule)) return false;
      if (!matchesCode(record.department, selectedDepartment)) return false;
      if (!matchesCode(record.userRole, selectedRole)) return false;
      if (
        selectedUser !== "All" &&
        ![record.userId, record.user].some(
          (value) => normalizeCode(value) === normalizeCode(selectedUser),
        )
      ) {
        return false;
      }
      if (!matchesAnyCode([record.severityCode, record.severity], selectedSeverity)) {
        return false;
      }
      if (!matchesAnyCode([record.statusCode, record.status], selectedStatus)) {
        return false;
      }
      if (
        selectedEventType !== "All" &&
        !matchesAnyCode([record.eventType, record.action, record.categoryCode], selectedEventType)
      ) {
        return false;
      }
      return true;
    });
  }, [
    apiRecords,
    searchQuery,
    selectedDateRange,
    selectedDepartment,
    selectedEventType,
    selectedModule,
    selectedRole,
    selectedSeverity,
    selectedStatus,
    selectedUser,
  ]);

  const criticalRecords = safeArray(criticalEventsQuery.data?.content);
  const workspaceCards = useMemo(() => {
    const workspaces = safeArray(auditWorkspacesQuery.data);
    return QUICK_ACTION_CARDS.map((card) => {
      const backendWorkspace = card.workspaceCode
        ? workspaces.find((workspace) => workspace.code === card.workspaceCode)
        : undefined;
      return {
        ...card,
        title: backendWorkspace?.name || card.title,
        count:
          card.id === "All Logs"
            ? allDashboardQuery.data?.totalAuditEvents
            : backendWorkspace?.count,
      };
    });
  }, [allDashboardQuery.data?.totalAuditEvents, auditWorkspacesQuery.data]);

  const kpiCards = useMemo<KpiCard[]>(() => {
    const metrics = safeArray(auditMetricsQuery.data);
    if ((isAllWorkspace || isCriticalWorkspace) && metrics.length > 0) {
      return metrics.map((metric) => ({
        title: metric.label,
        value: metric.value,
        trend: metric.trend,
        Icon: metricIcon(metric),
      }));
    }

    if (isAllWorkspace || isCriticalWorkspace) {
      const dashboard = allDashboardQuery.data;
      if (!dashboard) return [];
      return [
        { title: "Total Audit Events", value: dashboard.totalAuditEvents, Icon: Activity },
        {
          title: "Successful Logins",
          value: dashboard.successfulLogins,
          trend: dashboard.trends?.logins,
          Icon: LogIn,
        },
        {
          title: "User Activities",
          value: dashboard.userActivities,
          trend: dashboard.trends?.activities,
          Icon: Users,
        },
        { title: "Data Changes", value: dashboard.dataChanges, Icon: Database },
        { title: "Deleted Records", value: dashboard.deletedRecords, Icon: Trash2 },
        {
          title: "Critical Events",
          value: dashboard.criticalEvents,
          trend: dashboard.trends?.critical,
          Icon: AlertTriangle,
        },
      ];
    }

    if (isLoginWorkspace) {
      const dashboard = loginDashboardQuery.data;
      if (!dashboard) return [];
      return [
        {
          title: "Successful Logins",
          value: dashboard.successfulLogins,
          trend: dashboard.trends?.success,
          Icon: LogIn,
        },
        {
          title: "Failed Logins",
          value: dashboard.failedLogins,
          trend: dashboard.trends?.failed,
          Icon: AlertTriangle,
        },
        { title: "Locked Accounts", value: dashboard.lockedAccounts, Icon: Lock },
        { title: "Active Sessions", value: dashboard.activeSessions, Icon: Users },
      ];
    }

    if (currentWorkspace === "User Activities") {
      const dashboard = userActivitiesDashboardQuery.data;
      if (!dashboard) return [];
      return [
        {
          title: "Total Activities",
          value: dashboard.totalActivities,
          trend: dashboard.trend,
          Icon: Activity,
        },
        { title: "High Priority", value: dashboard.highPriority, Icon: AlertTriangle },
        { title: "Today's Actions", value: dashboard.todayActions, Icon: Users },
        {
          title: "Most Active User",
          value: dashboard.mostActiveUser?.fullName || "—",
          trend: dashboard.mostActiveUser?.activityCount,
          Icon: Users,
        },
      ];
    }

    if (currentWorkspace === "Data Changes") {
      const dashboard = dataChangesDashboardQuery.data;
      if (!dashboard) return [];
      return [
        {
          title: "Modified Records",
          value: dashboard.modifiedRecords,
          trend: dashboard.trend,
          Icon: Database,
        },
        { title: "Patient Updates", value: dashboard.patientUpdates, Icon: Users },
        { title: "Doctor Updates", value: dashboard.doctorUpdates, Icon: Activity },
        { title: "Billing Changes", value: dashboard.billingChanges, Icon: Database },
      ];
    }

    if (currentWorkspace === "Deleted Records") {
      const dashboard = deletedRecordsDashboardQuery.data;
      if (!dashboard) return [];
      return [
        {
          title: "Records Deleted",
          value: dashboard.recordsDeleted,
          trend: dashboard.trend,
          Icon: Trash2,
        },
        { title: "Restored", value: dashboard.restored, Icon: RotateCcw },
        { title: "Permanent Delete", value: dashboard.permanentDelete, Icon: Lock },
        { title: "Pending Review", value: dashboard.pendingReview, Icon: AlertTriangle },
      ];
    }

    const dashboard = systemLogsDashboardQuery.data;
    if (!dashboard) return [];
    return [
      {
        title: "Services Running",
        value: `${dashboard.servicesRunning}/${dashboard.totalServices}`,
        trend: dashboard.trend,
        Icon: Server,
      },
      { title: "Background Jobs", value: dashboard.backgroundJobs, Icon: Activity },
      { title: "Warning Events", value: dashboard.warningEvents, Icon: AlertTriangle },
      { title: "Critical Events", value: dashboard.criticalEvents, Icon: AlertTriangle },
    ];
  }, [
    allDashboardQuery.data,
    auditMetricsQuery.data,
    currentWorkspace,
    dataChangesDashboardQuery.data,
    deletedRecordsDashboardQuery.data,
    isAllWorkspace,
    isCriticalWorkspace,
    isLoginWorkspace,
    loginDashboardQuery.data,
    systemLogsDashboardQuery.data,
    userActivitiesDashboardQuery.data,
  ]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedDateRange("All Time");
    setSelectedModule("All");
    setSelectedDepartment("All");
    setSelectedRole("All");
    setSelectedUser("All");
    setSelectedSeverity("All");
    setSelectedStatus("All");
    setSelectedEventType("All");
    setPage(0);
  };

  const handleWorkspaceChange = useCallback((workspace: AuditCategory) => {
    setCurrentWorkspace(workspace);
    // Workspace streams use different server fields. Do not carry a module,
    // role, status, or event-type filter from another stream into this one.
    setSearchQuery("");
    setSelectedModule("All");
    setSelectedDepartment("All");
    setSelectedRole("All");
    setSelectedUser("All");
    setSelectedSeverity("All");
    setSelectedStatus("All");
    setSelectedEventType("All");
    setPage(0);
  }, []);

  const refreshAuditData = () => {
    void activeQuery.refetch();
    void allDashboardQuery.refetch();
    void auditMetricsQuery.refetch();
    void auditWorkspacesQuery.refetch();
    void auditFilterOptionsQuery.refetch();

    if (isAllWorkspace || isCriticalWorkspace) void criticalEventsQuery.refetch();
    if (isLoginWorkspace) {
      void loginDashboardQuery.refetch();
      void loginFilterOptionsQuery.refetch();
      void activeSessionsQuery.refetch();
      void failedAttemptsQuery.refetch();
      void lockedAccountsQuery.refetch();
    }
  };

  const isAllTable = isAllWorkspace || isCriticalWorkspace;
  const currentPage = activeQuery.data?.number ?? page;
  const totalPages = activeQuery.data?.totalPages ?? 0;
  const canGoNext = Boolean(
    activeQuery.data &&
      (activeQuery.data.last === false || currentPage + 1 < totalPages),
  );
  const lastUpdated = activeQuery.dataUpdatedAt
    ? new Date(activeQuery.dataUpdatedAt).toLocaleString()
    : "—";

  if (activeDetailsRecord) {
    return (
      <AuditLogDetailsPage
        recordId={activeDetailsRecord.id}
        sourceCategory={currentWorkspace}
        onBack={() => setActiveDetailsRecord(null)}
      />
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]"
      style={{ fontFamily: RB }}
    >
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span>Hospital</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <button
                onClick={() => handleWorkspaceChange("All Logs")}
                className="hover:text-gray-700"
              >
                Audit Logs
              </button>
              {!isAllWorkspace && (
                <>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold text-gray-800">{currentWorkspace}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              {!isAllWorkspace && (
                <button
                  onClick={() => handleWorkspaceChange("All Logs")}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  title="Back to all audit logs"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: PP }}>
                  {isAllWorkspace ? "Audit Logs" : currentWorkspace}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Audit records are loaded directly from the hospital administration API.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={() => downloadCsv(filteredRecords, "audit-logs.csv")}
              disabled={filteredRecords.length === 0}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              Export CSV
            </button>
            <button
              onClick={refreshAuditData}
              disabled={activeQuery.isFetching}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm disabled:opacity-70"
              style={{ backgroundColor: "#0D47A1" }}
            >
              <RefreshCw className={`w-4 h-4 ${activeQuery.isFetching ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        {kpiCards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {kpiCards.map((card) => {
              const CardIcon = card.Icon;
              const trend = formatTrend(card.trend);
              return (
                <div
                  key={card.title}
                  className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-700">
                      <CardIcon className="w-5 h-5" />
                    </div>
                    {trend && (
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${card.trend && card.trend < 0 ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}
                      >
                        {trend}
                      </span>
                    )}
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl font-bold text-gray-900" style={{ fontFamily: PP }}>
                      {typeof card.value === "number" ? card.value.toLocaleString() : card.value}
                    </div>
                    <div className="text-xs font-medium text-gray-500 mt-1">{card.title}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 px-5 py-4 text-sm text-gray-500">
            {allDashboardQuery.isLoading ? "Loading audit summary…" : "No audit summary was returned by the server."}
          </div>
        )}
      </section>

      {isAllWorkspace && (
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: PP }}>
                Recent Critical Events
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Records from the critical-events audit endpoint.
              </p>
            </div>
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200">
              {(criticalEventsQuery.data?.totalElements ?? criticalRecords.length).toLocaleString()} alerts
            </span>
          </div>
          {criticalEventsQuery.isLoading ? (
            <p className="text-sm text-gray-500">Loading critical events…</p>
          ) : criticalEventsQuery.isError ? (
            <p className="text-sm text-red-700">{getErrorMessage(criticalEventsQuery.error)}</p>
          ) : criticalRecords.length === 0 ? (
            <p className="text-sm text-gray-500">No critical events were returned by the server.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {criticalRecords.slice(0, 3).map((record) => (
                <article key={record.id} className="p-4 rounded-xl border border-red-200 bg-red-50/40 space-y-2">
                  <div className="flex justify-between gap-3">
                    <SeverityBadge severity={record.severity} />
                    <span className="text-[11px] font-mono text-gray-500">{display(record.timestamp)}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">{record.action}</h3>
                  <p className="text-xs text-gray-600 line-clamp-2">{display(record.description)}</p>
                  <div className="pt-2 flex justify-between items-center border-t border-red-100">
                    <span className="text-[11px] font-semibold text-blue-900">{record.module}</span>
                    <button
                      onClick={() => setActiveDetailsRecord(record)}
                      className="text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
                    >
                      View details <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: PP }}>
              Audit Workspaces
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Workspace names and record counts are supplied by the audit API.
            </p>
          </div>
          <span className="text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            {auditWorkspacesQuery.isLoading ? "Loading…" : `${workspaceCards.length} workspaces`}
          </span>
        </div>
        {auditWorkspacesQuery.isError && (
          <p className="text-xs text-red-700">{getErrorMessage(auditWorkspacesQuery.error)}</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {workspaceCards.map((card) => {
            const CardIcon = card.icon;
            const isActive = currentWorkspace === card.id;
            return (
              <button
                key={card.id}
                onClick={() => handleWorkspaceChange(card.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group ${isActive ? "bg-blue-900 text-white border-blue-900 shadow-md" : "bg-white text-gray-900 border-gray-200 hover:border-blue-300 hover:shadow-md"}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isActive ? "bg-white/20 text-white" : `${card.bg} ${card.color}`}`}>
                      <CardIcon className="w-5 h-5" />
                    </div>
                    <ArrowUpRight className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-400"}`} />
                  </div>
                  <h3 className={`text-sm font-bold ${isActive ? "text-white" : "text-gray-900"}`} style={{ fontFamily: PP }}>
                    {card.title}
                  </h3>
                  <p className={`text-[11px] mt-1 leading-relaxed ${isActive ? "text-blue-100" : "text-gray-500"}`}>
                    {card.description}
                  </p>
                </div>
                <div className={`mt-4 pt-2 border-t text-[11px] font-bold flex items-center justify-between ${isActive ? "border-white/20 text-blue-100" : "border-gray-100 text-gray-500"}`}>
                  <span>
                    {typeof card.count === "number" ? `${card.count.toLocaleString()} records` : "Count unavailable"}
                  </span>
                  {isActive && <span className="text-[9px] tracking-wider">ACTIVE</span>}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search loaded records by event, user, module, action, or record ID"
            className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
          />
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            <FilterSelect label="Date range" value={selectedDateRange} onChange={(value) => { setSelectedDateRange(value); setPage(0); }}>
              <option value="All Time">All time</option>
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="Last 7 Days">Last 7 days</option>
              <option value="Last 30 Days">Last 30 days</option>
            </FilterSelect>
            <ApiFilterSelect label="Module" value={selectedModule} onChange={setSelectedModule} options={filterOptions?.modules} allLabel="All modules" />
            <ApiFilterSelect label="Department" value={selectedDepartment} onChange={setSelectedDepartment} options={filterOptions?.departments} allLabel="All departments" />
            <ApiFilterSelect label="Role" value={selectedRole} onChange={setSelectedRole} options={filterOptions?.roles} allLabel="All roles" />
            <ApiFilterSelect label="User" value={selectedUser} onChange={setSelectedUser} options={filterOptions?.users} allLabel="All users" />
            <ApiFilterSelect label="Severity" value={selectedSeverity} onChange={setSelectedSeverity} options={filterOptions?.severities} allLabel="All severities" />
            <ApiFilterSelect label="Status" value={selectedStatus} onChange={setSelectedStatus} options={filterOptions?.statuses} allLabel="All statuses" />
            <ApiFilterSelect label="Event type" value={selectedEventType} onChange={setSelectedEventType} options={filterOptions?.eventTypes} allLabel="All event types" />
          </div>
          <div className="flex items-center justify-between gap-3 pt-3 mt-3 border-t border-gray-100">
            <p className="text-[11px] text-gray-500">
              Date range is sent to the backend; the remaining filters apply to the loaded API records.
            </p>
            <button
              onClick={resetFilters}
              className="inline-flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset filters
            </button>
          </div>
        </div>
      </section>

      {isLoginWorkspace && (
        <LoginSupplementaryData
          activeSessions={safeArray(activeSessionsQuery.data?.content)}
          failedAttempts={safeArray(failedAttemptsQuery.data?.content)}
          lockedAccounts={safeArray(lockedAccountsQuery.data?.content)}
          loading={activeSessionsQuery.isLoading || failedAttemptsQuery.isLoading || lockedAccountsQuery.isLoading}
          error={
            activeSessionsQuery.isError
              ? activeSessionsQuery.error
              : failedAttemptsQuery.isError
                ? failedAttemptsQuery.error
                : lockedAccountsQuery.isError
                  ? lockedAccountsQuery.error
                  : undefined
          }
        />
      )}

      <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-900" />
            <h2 className="text-sm font-bold text-gray-900" style={{ fontFamily: PP }}>
              {currentWorkspace} stream
            </h2>
          </div>
          <span className="text-xs font-semibold text-gray-500 font-mono">
            {activeQuery.isLoading ? "Loading…" : `${filteredRecords.length} shown of ${totalElements.toLocaleString()}`}
          </span>
        </div>
        <div className="p-6">
          {activeQuery.isLoading ? (
            <LoadingState label="Loading audit records…" />
          ) : activeQuery.isError ? (
            <ErrorState error={activeQuery.error} onRetry={() => void activeQuery.refetch()} />
          ) : filteredRecords.length === 0 ? (
            <EmptyState onReset={resetFilters} />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                    {isAllTable && <AllLogHeaders />}
                    {isLoginWorkspace && <LoginHeaders />}
                    {currentWorkspace === "User Activities" && <UserActivityHeaders />}
                    {currentWorkspace === "Data Changes" && <DataChangeHeaders />}
                    {currentWorkspace === "Deleted Records" && <DeletedRecordHeaders />}
                    {currentWorkspace === "System Logs" && <SystemLogHeaders />}
                    <th className="p-3.5 text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white font-medium text-gray-800">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-blue-50/40 transition-colors">
                      {isAllTable && <AllLogCells record={record} />}
                      {isLoginWorkspace && <LoginCells record={record} />}
                      {currentWorkspace === "User Activities" && <UserActivityCells record={record} />}
                      {currentWorkspace === "Data Changes" && <DataChangeCells record={record} />}
                      {currentWorkspace === "Deleted Records" && <DeletedRecordCells record={record} />}
                      {currentWorkspace === "System Logs" && <SystemLogCells record={record} />}
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => setActiveDetailsRecord(record)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <footer className="sticky bottom-0 z-30 bg-white/95 backdrop-blur border-t border-gray-200 px-6 py-3 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>Last loaded: {lastUpdated}</span>
        </div>
        <div className="text-xs font-semibold text-gray-700">
          Page {currentPage + 1}{totalPages ? ` of ${totalPages}` : ""}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            disabled={page === 0 || activeQuery.isFetching}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Previous
          </button>
          <button
            onClick={() => setPage((current) => current + 1)}
            disabled={!canGoNext || activeQuery.isFetching}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            style={{ backgroundColor: "#0D47A1" }}
          >
            Next
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-xs font-semibold text-gray-600">
      <span className="block mb-1">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full text-xs py-2 px-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {children}
      </select>
    </label>
  );
}

function ApiFilterSelect({
  label,
  value,
  onChange,
  options,
  allLabel,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: AuditSelectOption[] | undefined;
  allLabel: string;
}) {
  return (
    <FilterSelect label={label} value={value} onChange={onChange}>
      <option value="All">{allLabel}</option>
      {safeArray(options).map((option, index) => {
        const optionId = optionValue(option);
        return (
          <option key={`${optionId}-${index}`} value={optionId}>
            {optionLabel(option)}
          </option>
        );
      })}
    </FilterSelect>
  );
}

function LoginSupplementaryData({
  activeSessions,
  failedAttempts,
  lockedAccounts,
  loading,
  error,
}: {
  activeSessions: Array<{
    sessionId: string;
    user?: { fullName?: string; userId?: string; role?: string };
    loginTime?: string;
    lastActivityTime?: string;
    device?: string;
    status?: string;
  }>;
  failedAttempts: Array<{
    eventId?: string;
    userName?: string;
    userId?: string;
    failureReason?: string;
    attemptCount?: number;
    timestamp?: string;
  }>;
  lockedAccounts: Array<{
    userId?: string;
    fullName?: string;
    email?: string;
    lockedAt?: string;
    failedAttemptCount?: number;
    reason?: string;
  }>;
  loading: boolean;
  error: unknown;
}) {
  return (
    <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
      <div>
        <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: PP }}>
          Login Security Data
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Active sessions, failed attempts, and locked accounts from the login-history endpoints.
        </p>
      </div>
      {loading ? (
        <p className="text-sm text-gray-500">Loading login security data…</p>
      ) : error ? (
        <p className="text-sm text-red-700">{getErrorMessage(error)}</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <LoginDataPanel title="Active Sessions" count={activeSessions.length}>
            {activeSessions.map((session) => (
              <div key={session.sessionId} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                <p className="font-semibold text-gray-900">{session.user?.fullName || session.user?.userId || "—"}</p>
                <p className="text-gray-500">{display(session.device)} · {display(session.status)}</p>
                <p className="font-mono text-[10px] text-gray-400">{display(session.loginTime)}</p>
              </div>
            ))}
          </LoginDataPanel>
          <LoginDataPanel title="Failed Attempts" count={failedAttempts.length}>
            {failedAttempts.map((attempt, index) => (
              <div key={attempt.eventId || `${attempt.userId}-${index}`} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                <p className="font-semibold text-gray-900">{attempt.userName || attempt.userId || "—"}</p>
                <p className="text-gray-500">{display(attempt.failureReason)} · {display(attempt.attemptCount)} attempts</p>
                <p className="font-mono text-[10px] text-gray-400">{display(attempt.timestamp)}</p>
              </div>
            ))}
          </LoginDataPanel>
          <LoginDataPanel title="Locked Accounts" count={lockedAccounts.length}>
            {lockedAccounts.map((account, index) => (
              <div key={account.userId || `${account.email}-${index}`} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                <p className="font-semibold text-gray-900">{account.fullName || account.userId || "—"}</p>
                <p className="text-gray-500">{display(account.reason)} · {display(account.failedAttemptCount)} attempts</p>
                <p className="font-mono text-[10px] text-gray-400">{display(account.lockedAt)}</p>
              </div>
            ))}
          </LoginDataPanel>
        </div>
      )}
    </section>
  );
}

function LoginDataPanel({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 p-4 space-y-3 text-xs">
      <div className="flex justify-between items-center border-b border-gray-100 pb-2">
        <h3 className="font-bold text-gray-900">{title}</h3>
        <span className="font-mono text-gray-500">{count}</span>
      </div>
      {count ? <div className="space-y-2">{children}</div> : <p className="text-gray-500">No records returned.</p>}
    </div>
  );
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="py-16 text-center space-y-3">
      <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  return (
    <div className="py-16 text-center space-y-3">
      <AlertTriangle className="w-8 h-8 text-red-600 mx-auto" />
      <p className="text-sm text-red-700 max-w-xl mx-auto">{getErrorMessage(error)}</p>
      <button onClick={onRetry} className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 rounded-lg">
        Retry request
      </button>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="py-16 text-center space-y-3">
      <Search className="w-8 h-8 text-gray-400 mx-auto" />
      <div>
        <h3 className="text-base font-bold text-gray-800" style={{ fontFamily: PP }}>
          No Audit Records Found
        </h3>
        <p className="text-xs text-gray-500 mt-1">The server returned no records matching the current filters.</p>
      </div>
      <button onClick={onReset} className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-lg bg-blue-900">
        <RotateCcw className="w-4 h-4" />
        Reset filters
      </button>
    </div>
  );
}

function AllLogHeaders() {
  return <><th className="p-3.5">Timestamp</th><th className="p-3.5">Category</th><th className="p-3.5">User</th><th className="p-3.5">Role</th><th className="p-3.5">Module</th><th className="p-3.5">Action</th><th className="p-3.5">Severity</th><th className="p-3.5">Status</th></>;
}

function LoginHeaders() {
  return <><th className="p-3.5">User</th><th className="p-3.5">Role</th><th className="p-3.5">Login Time</th><th className="p-3.5">Logout Time</th><th className="p-3.5">IP Address</th><th className="p-3.5">Device</th><th className="p-3.5">Status</th></>;
}

function UserActivityHeaders() {
  return <><th className="p-3.5">User</th><th className="p-3.5">Module</th><th className="p-3.5">Action</th><th className="p-3.5">Description</th><th className="p-3.5">Timestamp</th><th className="p-3.5">Status</th></>;
}

function DataChangeHeaders() {
  return <><th className="p-3.5">Module</th><th className="p-3.5">Record</th><th className="p-3.5">Field</th><th className="p-3.5 text-red-600">Old Value</th><th className="p-3.5 text-emerald-600">New Value</th><th className="p-3.5">Modified By</th><th className="p-3.5">Timestamp</th></>;
}

function DeletedRecordHeaders() {
  return <><th className="p-3.5">Record</th><th className="p-3.5">Module</th><th className="p-3.5">Deleted By</th><th className="p-3.5">Reason</th><th className="p-3.5">Deleted Time</th><th className="p-3.5">Status</th></>;
}

function SystemLogHeaders() {
  return <><th className="p-3.5">Severity</th><th className="p-3.5">Event</th><th className="p-3.5">Module</th><th className="p-3.5">Description</th><th className="p-3.5">Timestamp</th><th className="p-3.5">Status</th></>;
}

function AllLogCells({ record }: { record: AuditRecord }) {
  return <><td className="p-3.5 whitespace-nowrap text-gray-500 font-mono">{display(record.timestamp)}</td><td className="p-3.5 whitespace-nowrap font-semibold text-gray-700">{record.category}</td><td className="p-3.5 whitespace-nowrap font-bold text-gray-900">{record.user}</td><td className="p-3.5 whitespace-nowrap text-gray-600">{record.userRole}</td><td className="p-3.5 whitespace-nowrap"><span className="px-2 py-0.5 rounded bg-gray-100 font-medium text-gray-700">{record.module}</span></td><td className="p-3.5 font-semibold text-blue-950">{record.action}</td><td className="p-3.5 whitespace-nowrap"><SeverityBadge severity={record.severity} /></td><td className="p-3.5 whitespace-nowrap"><StatusBadge status={record.status} /></td></>;
}

function LoginCells({ record }: { record: AuditRecord }) {
  return <><td className="p-3.5 whitespace-nowrap font-bold text-gray-900">{record.user}</td><td className="p-3.5 whitespace-nowrap text-gray-600">{record.userRole}</td><td className="p-3.5 whitespace-nowrap font-mono text-gray-600">{display(record.loginTime || record.timestamp)}</td><td className="p-3.5 whitespace-nowrap font-mono text-gray-500">{display(record.logoutTime)}</td><td className="p-3.5 whitespace-nowrap font-mono text-xs text-gray-600">{display(record.ipAddress)}</td><td className="p-3.5 whitespace-nowrap text-gray-600 max-w-xs truncate">{display(record.device)}</td><td className="p-3.5 whitespace-nowrap"><StatusBadge status={record.status} /></td></>;
}

function UserActivityCells({ record }: { record: AuditRecord }) {
  return <><td className="p-3.5 whitespace-nowrap font-bold text-gray-900">{record.user}</td><td className="p-3.5 whitespace-nowrap"><span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-medium border border-purple-100">{record.module}</span></td><td className="p-3.5 font-semibold text-blue-950">{record.action}</td><td className="p-3.5 max-w-xs truncate text-gray-500" title={record.description}>{display(record.description)}</td><td className="p-3.5 whitespace-nowrap text-gray-500 font-mono">{display(record.timestamp)}</td><td className="p-3.5 whitespace-nowrap"><StatusBadge status={record.status} /></td></>;
}

function DataChangeCells({ record }: { record: AuditRecord }) {
  return <><td className="p-3.5 whitespace-nowrap"><span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 font-medium border border-teal-100">{record.module}</span></td><td className="p-3.5 whitespace-nowrap font-mono font-bold text-blue-700">{display(record.recordId)}</td><td className="p-3.5 font-semibold text-gray-800">{display(record.fieldChanged)}</td><td className="p-3.5 font-mono text-red-600 max-w-48 truncate" title={record.oldValue}>{display(record.oldValue)}</td><td className="p-3.5 font-mono text-emerald-600 max-w-48 truncate" title={record.newValue}>{display(record.newValue)}</td><td className="p-3.5 whitespace-nowrap font-bold text-gray-900">{record.user}</td><td className="p-3.5 whitespace-nowrap text-gray-500 font-mono">{display(record.timestamp)}</td></>;
}

function DeletedRecordCells({ record }: { record: AuditRecord }) {
  return <><td className="p-3.5 whitespace-nowrap font-mono font-bold text-red-700">{display(record.recordId)}</td><td className="p-3.5 whitespace-nowrap"><span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-medium border border-amber-200">{record.module}</span></td><td className="p-3.5 whitespace-nowrap font-bold text-gray-900">{record.user}</td><td className="p-3.5 text-gray-600 max-w-xs truncate" title={record.deletionReason || record.description}>{display(record.deletionReason || record.description)}</td><td className="p-3.5 whitespace-nowrap text-gray-500 font-mono">{display(record.timestamp)}</td><td className="p-3.5 whitespace-nowrap"><StatusBadge status={record.status} /></td></>;
}

function SystemLogCells({ record }: { record: AuditRecord }) {
  return <><td className="p-3.5 whitespace-nowrap"><SeverityBadge severity={record.severity} /></td><td className="p-3.5 font-semibold text-gray-900">{record.action}</td><td className="p-3.5 whitespace-nowrap"><span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium border border-indigo-100">{record.module}</span></td><td className="p-3.5 max-w-xs truncate text-gray-500" title={record.description}>{display(record.description)}</td><td className="p-3.5 whitespace-nowrap text-gray-500 font-mono">{display(record.timestamp)}</td><td className="p-3.5 whitespace-nowrap"><StatusBadge status={record.status} /></td></>;
}
