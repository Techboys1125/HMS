import { apiClient } from "../../../lib/axios";
import type {
  ApiEnvelope,
  PaginatedData,
  AuditRecord,
  AuditLogListParams,
  RawAuditLog,
  AuditLogSummary,
  RawAuditEvent,
  AuditDashboardData,
  AuditFilterOptions,
  AuditMetric,
  AuditWorkspace,
  RawActiveSession,
  LoginHistoryDashboard,
  RawFailedAttempt,
  RawLockedAccount,
  RawLoginLog,
  UserActivitiesDashboard,
  DataChangesDashboard,
  RawDataChangeLog,
  DeletedRecordsDashboard,
  RawDeletedRecord,
  SystemLogsDashboard,
  RawSystemLog,
} from "../types/auditlog.types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function unwrap<T>(response: { data: unknown }): T {
  const body = response.data;
  if (body && typeof body === "object" && "data" in body) {
    return (body as ApiEnvelope<T>).data;
  }
  return body as T;
}

function unwrapPaginated<T>(response: { data: unknown }): PaginatedData<T> {
  const body = response.data;
  const inner =
    body && typeof body === "object" && "data" in body
      ? (body as ApiEnvelope<PaginatedData<T>>).data
      : (body as PaginatedData<T>);
  return inner;
}

function buildQuery(
  params?: Record<string, string | number | undefined>,
): string {
  if (!params) return "";
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== "" && v !== "All",
  );
  if (entries.length === 0) return "";
  return (
    "?" +
    entries
      .map(
        ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
      )
      .join("&")
  );
}

function normalizeSeverity(s: string): AuditRecord["severity"] {
  const up = s.toUpperCase();
  if (up === "CRITICAL") return "Critical";
  if (up === "WARNING") return "Warning";
  if (up === "SUCCESS") return "Success";
  return "Information";
}

function normalizeStatus(s: string): AuditRecord["status"] {
  const up = s.toUpperCase();
  if (up === "FAILED") return "Failed";
  if (up === "BLOCKED") return "Blocked";
  if (up === "WARNING") return "Warning";
  return "Success";
}

function normalizeCategory(c: string): AuditRecord["category"] {
  const up = c.toUpperCase().replace(/[_\s]/g, "");
  if (up.includes("LOGINHISTORY") || up.includes("LOGIN"))
    return "Login History";
  if (up.includes("USERACTIVITY") || up.includes("USERACTIVITIES"))
    return "User Activities";
  if (up.includes("DATACHANGE") || up.includes("DATACHANGES"))
    return "Data Changes";
  if (up.includes("DELETEDRECORD") || up.includes("DELETEDRECORDS"))
    return "Deleted Records";
  if (up.includes("SYSTEMLOG") || up.includes("SYSTEMLOGS"))
    return "System Logs";
  return "User Activities";
}

// ─── Adapter: RawAuditLog → AuditRecord ──────────────────────────────────────

function adaptAuditLog(raw: RawAuditLog): AuditRecord {
  return {
    id: String(raw.id),
    timestamp: raw.createdAt,
    category: "User Activities",
    module: raw.entityType || "System",
    user: raw.actorEmail,
    userRole: "Hospital Admin",
    department: "Administration",
    action: raw.action,
    description: `${raw.action} on ${raw.entityType}${raw.entityId ? ` ${raw.entityId}` : ""}`,
    severity: normalizeSeverity(raw.severity),
    status: raw.flagged ? "Warning" : "Success",
    ipAddress: "",
    device: "",
    browser: "",
    recordId: raw.entityId,
  };
}

// ─── Adapter: RawAuditEvent → AuditRecord ────────────────────────────────────

function adaptAuditEvent(raw: RawAuditEvent): AuditRecord {
  return {
    id: raw.eventId,
    timestamp: raw.timestamp,
    category: normalizeCategory(raw.category),
    module: raw.module?.replace(/_/g, " ") || "",
    user: raw.performedBy?.fullName || raw.performedBy?.userId || "System",
    userRole: raw.performedBy?.role?.replace(/_/g, " ") || "System",
    department: "",
    action: raw.action?.replace(/_/g, " ") || "",
    description: raw.description || raw.action?.replace(/_/g, " ") || "",
    severity: normalizeSeverity(raw.severity),
    status: normalizeStatus(raw.status),
    ipAddress: raw.ipAddress || "",
    device: "",
    browser: "",
  };
}

// ─── Adapter: RawLoginLog → AuditRecord ──────────────────────────────────────

function adaptLoginLog(raw: RawLoginLog): AuditRecord {
  return {
    id: raw.eventId,
    timestamp: raw.loginTime,
    category: "Login History",
    module: "Authentication",
    user: raw.user?.fullName || raw.user?.userId || "Unknown",
    userRole: raw.user?.role?.replace(/_/g, " ") || "",
    department: "",
    action: raw.status === "SUCCESS" ? "User Login Success" : "Login Failed",
    description: `Login attempt from IP ${raw.ipAddress}`,
    severity: raw.status === "SUCCESS" ? "Success" : "Critical",
    status: normalizeStatus(raw.status),
    ipAddress: raw.ipAddress,
    device: "",
    browser: "",
    loginTime: raw.loginTime,
  };
}

// ─── Adapter: RawDataChangeLog → AuditRecord ─────────────────────────────────

function adaptDataChangeLog(raw: RawDataChangeLog): AuditRecord {
  return {
    id: raw.eventId,
    timestamp: raw.timestamp,
    category: "Data Changes",
    module: raw.module?.replace(/_/g, " ") || "",
    user: raw.modifiedBy?.fullName || raw.modifiedBy?.userId || "",
    userRole: raw.modifiedBy?.role?.replace(/_/g, " ") || "",
    department: "",
    action: `${raw.record?.type || "Record"} Updated`,
    description: `Field "${raw.field}" changed`,
    severity: "Information",
    status: "Success",
    ipAddress: "",
    device: "",
    browser: "",
    recordId: raw.record?.id,
    fieldChanged: raw.field,
    oldValue: raw.oldValue,
    newValue: raw.newValue,
  };
}

// ─── Adapter: RawDeletedRecord → AuditRecord ─────────────────────────────────

function adaptDeletedRecord(raw: RawDeletedRecord): AuditRecord {
  return {
    id: raw.eventId,
    timestamp: raw.deletedAt,
    category: "Deleted Records",
    module: raw.module?.replace(/_/g, " ") || "",
    user: raw.deletedBy?.fullName || raw.deletedBy?.userId || "",
    userRole: raw.deletedBy?.role?.replace(/_/g, " ") || "",
    department: "",
    action: `${raw.record?.type || "Record"} Deleted`,
    description: raw.reason || "Record deleted",
    severity: "Critical",
    status: "Success",
    ipAddress: "",
    device: "",
    browser: "",
    recordId: raw.record?.id,
    deletionReason: raw.reason,
  };
}

// ─── Adapter: RawSystemLog → AuditRecord ─────────────────────────────────────

function adaptSystemLog(raw: RawSystemLog): AuditRecord {
  return {
    id: raw.eventId,
    timestamp: raw.timestamp,
    category: "System Logs",
    module: raw.module?.replace(/_/g, " ") || "",
    user: "System",
    userRole: "System",
    department: "IT Systems",
    action: raw.event?.replace(/_/g, " ") || "",
    description: raw.description || "",
    severity: normalizeSeverity(raw.severity),
    status: normalizeStatus(raw.status),
    ipAddress: "",
    device: "",
    browser: "",
    systemEventCode: raw.eventId,
  };
}

// ═════════════════════════════════════════════════════════════════════════════
// API Functions — Tag 19: Audit Logs
// ═════════════════════════════════════════════════════════════════════════════

export async function fetchAuditLogs(
  params?: AuditLogListParams,
): Promise<PaginatedData<AuditRecord>> {
  const query = buildQuery(
    params as Record<string, string | number | undefined>,
  );
  const res = await apiClient.get(`/api/v1/admin/audit-logs${query}`);
  const raw = unwrapPaginated(res);
  return {
    ...raw,
    content: raw.content.map(adaptAuditLog),
  };
}

export async function fetchAuditLogSummary(): Promise<AuditLogSummary> {
  const res = await apiClient.get("/api/v1/admin/audit-logs/summary");
  return unwrap(res) as AuditLogSummary;
}

export async function fetchAuditLogById(id: string): Promise<AuditRecord> {
  const res = await apiClient.get(`/api/v1/admin/audit/logs/${id}`);
  return adaptAuditLog(unwrap(res) as RawAuditLog);
}

export async function flagAuditLog(
  id: string,
  flagged: boolean,
  flagReason?: string,
): Promise<{ id: number; flagged: boolean; flagReason?: string }> {
  const res = await apiClient.patch(`/api/v1/admin/audit-logs/${id}/flag`, {
    flagged,
    flagReason,
  });
  return unwrap(res) as { id: number; flagged: boolean; flagReason?: string };
}

// ═════════════════════════════════════════════════════════════════════════════
// API Functions — Tag 19 Workspaces
// ═════════════════════════════════════════════════════════════════════════════

export async function fetchCriticalEvents(
  params?: AuditLogListParams,
): Promise<PaginatedData<AuditRecord>> {
  const query = buildQuery(
    params as Record<string, string | number | undefined>,
  );
  const res = await apiClient.get(
    `/api/v1/admin/audit/critical-events${query}`,
  );
  const raw = unwrapPaginated(res);
  return {
    ...raw,
    content: raw.content.map(adaptAuditEvent),
  };
}

export async function fetchAuditDashboard(
  fromDate?: string,
  toDate?: string,
): Promise<AuditDashboardData> {
  const query = buildQuery({ fromDate, toDate });
  const res = await apiClient.get(`/api/v1/admin/audit/dashboard${query}`);
  return unwrap(res) as AuditDashboardData;
}

export async function fetchAuditFilterOptions(): Promise<AuditFilterOptions> {
  const res = await apiClient.get("/api/v1/admin/audit/filter-options");
  return unwrap(res) as AuditFilterOptions;
}

export async function fetchMainAuditLogs(
  params?: AuditLogListParams,
): Promise<PaginatedData<AuditRecord>> {
  const query = buildQuery(
    params as Record<string, string | number | undefined>,
  );
  const res = await apiClient.get(`/api/v1/admin/audit/logs${query}`);
  const raw = unwrapPaginated(res);
  return {
    ...raw,
    content: raw.content.map(adaptAuditEvent),
  };
}

export async function fetchAuditEventDetail(
  eventId: string,
): Promise<AuditRecord> {
  const res = await apiClient.get(`/api/v1/admin/audit/logs/${eventId}`);
  return adaptAuditEvent(unwrap(res) as RawAuditEvent);
}

export async function fetchAuditMetrics(): Promise<AuditMetric[]> {
  const res = await apiClient.get("/api/v1/admin/audit/metrics");
  return unwrap(res) as AuditMetric[];
}

export async function fetchAuditWorkspaces(): Promise<AuditWorkspace[]> {
  const res = await apiClient.get("/api/v1/admin/audit/workspaces");
  return unwrap(res) as AuditWorkspace[];
}

// ═════════════════════════════════════════════════════════════════════════════
// API Functions — Tag 19b: Login History
// ═════════════════════════════════════════════════════════════════════════════

export async function fetchActiveSessions(
  params?: AuditLogListParams,
): Promise<PaginatedData<RawActiveSession>> {
  const query = buildQuery(
    params as Record<string, string | number | undefined>,
  );
  const res = await apiClient.get(
    `/api/v1/admin/audit/login-history/active-sessions${query}`,
  );
  return unwrapPaginated(res);
}

export async function fetchLoginHistoryDashboard(): Promise<LoginHistoryDashboard> {
  const res = await apiClient.get(
    "/api/v1/admin/audit/login-history/dashboard",
  );
  return unwrap(res) as LoginHistoryDashboard;
}

export async function fetchFailedLoginAttempts(
  params?: AuditLogListParams,
): Promise<PaginatedData<RawFailedAttempt>> {
  const query = buildQuery(
    params as Record<string, string | number | undefined>,
  );
  const res = await apiClient.get(
    `/api/v1/admin/audit/login-history/failed-attempts${query}`,
  );
  return unwrapPaginated(res);
}

export async function fetchLockedAccounts(
  params?: AuditLogListParams,
): Promise<PaginatedData<RawLockedAccount>> {
  const query = buildQuery(
    params as Record<string, string | number | undefined>,
  );
  const res = await apiClient.get(
    `/api/v1/admin/audit/login-history/locked-accounts${query}`,
  );
  return unwrapPaginated(res);
}

export async function fetchLoginHistoryLogs(
  params?: AuditLogListParams,
): Promise<PaginatedData<AuditRecord>> {
  const query = buildQuery(
    params as Record<string, string | number | undefined>,
  );
  const res = await apiClient.get(
    `/api/v1/admin/audit/login-history/logs${query}`,
  );
  const raw = unwrapPaginated(res);
  return {
    ...raw,
    content: raw.content.map(adaptLoginLog),
  };
}

export async function fetchLoginEventDetail(
  eventId: string,
): Promise<AuditRecord> {
  const res = await apiClient.get(
    `/api/v1/admin/audit/login-history/logs/${eventId}`,
  );
  return adaptAuditEvent(unwrap(res) as RawAuditEvent);
}

// ═════════════════════════════════════════════════════════════════════════════
// API Functions — Tag 19c: User Activities
// ═════════════════════════════════════════════════════════════════════════════

export async function fetchUserActivitiesDashboard(): Promise<UserActivitiesDashboard> {
  const res = await apiClient.get(
    "/api/v1/admin/audit/user-activities/dashboard",
  );
  return unwrap(res) as UserActivitiesDashboard;
}

export async function fetchUserActivityLogs(
  params?: AuditLogListParams,
): Promise<PaginatedData<AuditRecord>> {
  const query = buildQuery(
    params as Record<string, string | number | undefined>,
  );
  const res = await apiClient.get(
    `/api/v1/admin/audit/user-activities/logs${query}`,
  );
  const raw = unwrapPaginated(res);
  return {
    ...raw,
    content: raw.content.map(adaptAuditEvent),
  };
}

export async function fetchUserActivityDetail(
  eventId: string,
): Promise<AuditRecord> {
  const res = await apiClient.get(
    `/api/v1/admin/audit/user-activities/logs/${eventId}`,
  );
  return adaptAuditEvent(unwrap(res) as RawAuditEvent);
}

// ═════════════════════════════════════════════════════════════════════════════
// API Functions — Tag 19d: Data Changes
// ═════════════════════════════════════════════════════════════════════════════

export async function fetchDataChangesDashboard(): Promise<DataChangesDashboard> {
  const res = await apiClient.get("/api/v1/admin/audit/data-changes/dashboard");
  return unwrap(res) as DataChangesDashboard;
}

export async function fetchDataChangeLogs(
  params?: AuditLogListParams,
): Promise<PaginatedData<AuditRecord>> {
  const query = buildQuery(
    params as Record<string, string | number | undefined>,
  );
  const res = await apiClient.get(
    `/api/v1/admin/audit/data-changes/logs${query}`,
  );
  const raw = unwrapPaginated(res);
  return {
    ...raw,
    content: raw.content.map(adaptDataChangeLog),
  };
}

export async function fetchDataChangeDetail(
  eventId: string,
): Promise<AuditRecord> {
  const res = await apiClient.get(
    `/api/v1/admin/audit/data-changes/logs/${eventId}`,
  );
  return adaptAuditEvent(unwrap(res) as RawAuditEvent);
}

// ═════════════════════════════════════════════════════════════════════════════
// API Functions — Tag 19e: Deleted Records
// ═════════════════════════════════════════════════════════════════════════════

export async function fetchDeletedRecordsDashboard(): Promise<DeletedRecordsDashboard> {
  const res = await apiClient.get(
    "/api/v1/admin/audit/deleted-records/dashboard",
  );
  return unwrap(res) as DeletedRecordsDashboard;
}

export async function fetchDeletedRecordLogs(
  params?: AuditLogListParams,
): Promise<PaginatedData<AuditRecord>> {
  const query = buildQuery(
    params as Record<string, string | number | undefined>,
  );
  const res = await apiClient.get(
    `/api/v1/admin/audit/deleted-records/logs${query}`,
  );
  const raw = unwrapPaginated(res);
  return {
    ...raw,
    content: raw.content.map(adaptDeletedRecord),
  };
}

export async function fetchDeletedRecordDetail(
  eventId: string,
): Promise<AuditRecord> {
  const res = await apiClient.get(
    `/api/v1/admin/audit/deleted-records/logs/${eventId}`,
  );
  return adaptAuditEvent(unwrap(res) as RawAuditEvent);
}

// ═════════════════════════════════════════════════════════════════════════════
// API Functions — Tag 19f: System Logs
// ═════════════════════════════════════════════════════════════════════════════

export async function fetchSystemLogsDashboard(): Promise<SystemLogsDashboard> {
  const res = await apiClient.get("/api/v1/admin/audit/system-logs/dashboard");
  return unwrap(res) as SystemLogsDashboard;
}

export async function fetchSystemLogLogs(
  params?: AuditLogListParams,
): Promise<PaginatedData<AuditRecord>> {
  const query = buildQuery(
    params as Record<string, string | number | undefined>,
  );
  const res = await apiClient.get(
    `/api/v1/admin/audit/system-logs/logs${query}`,
  );
  const raw = unwrapPaginated(res);
  return {
    ...raw,
    content: raw.content.map(adaptSystemLog),
  };
}

export async function fetchSystemLogDetail(
  eventId: string,
): Promise<AuditRecord> {
  const res = await apiClient.get(
    `/api/v1/admin/audit/system-logs/logs/${eventId}`,
  );
  return adaptAuditEvent(unwrap(res) as RawAuditEvent);
}
