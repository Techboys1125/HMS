import { useQuery } from "@tanstack/react-query";
import {
  fetchAuditLogs,
  fetchAuditLogById,
  fetchAuditLogSummary,
  fetchCriticalEvents,
  fetchAuditDashboard,
  fetchAuditFilterOptions,
  fetchMainAuditLogs,
  fetchAuditEventDetail,
  fetchAuditMetrics,
  fetchAuditWorkspaces,
  fetchLoginHistoryDashboard,
  fetchLoginHistoryLogs,
  fetchLoginEventDetail,
  fetchActiveSessions,
  fetchFailedLoginAttempts,
  fetchLockedAccounts,
  fetchUserActivitiesDashboard,
  fetchUserActivityLogs,
  fetchUserActivityDetail,
  fetchDataChangesDashboard,
  fetchDataChangeLogs,
  fetchDataChangeDetail,
  fetchDeletedRecordsDashboard,
  fetchDeletedRecordLogs,
  fetchDeletedRecordDetail,
  fetchSystemLogsDashboard,
  fetchSystemLogLogs,
  fetchSystemLogDetail,
} from "../services/auditlog.service";
import type { AuditLogListParams } from "../types/auditlog.types";

// ─── Query Key Factories ────────────────────────────────────────────────────

const auditLogKeys = {
  all: ["audit-logs"] as const,

  // Tag 19
  list: (p?: AuditLogListParams) => [...auditLogKeys.all, "list", p] as const,
  summary: () => [...auditLogKeys.all, "summary"] as const,
  detail: (id: string) => [...auditLogKeys.all, "detail", id] as const,

  // Workspaces
  criticalEvents: (p?: AuditLogListParams) => [...auditLogKeys.all, "critical-events", p] as const,
  dashboard: (from?: string, to?: string) => [...auditLogKeys.all, "dashboard", from, to] as const,
  filterOptions: () => [...auditLogKeys.all, "filter-options"] as const,
  mainLogs: (p?: AuditLogListParams) => [...auditLogKeys.all, "main-logs", p] as const,
  eventDetail: (id: string) => [...auditLogKeys.all, "event-detail", id] as const,
  metrics: () => [...auditLogKeys.all, "metrics"] as const,
  workspaces: () => [...auditLogKeys.all, "workspaces"] as const,

  // Login History
  loginDashboard: () => [...auditLogKeys.all, "login-dashboard"] as const,
  loginLogs: (p?: AuditLogListParams) => [...auditLogKeys.all, "login-logs", p] as const,
  loginDetail: (id: string) => [...auditLogKeys.all, "login-detail", id] as const,
  activeSessions: (p?: AuditLogListParams) => [...auditLogKeys.all, "active-sessions", p] as const,
  failedAttempts: (p?: AuditLogListParams) => [...auditLogKeys.all, "failed-attempts", p] as const,
  lockedAccounts: (p?: AuditLogListParams) => [...auditLogKeys.all, "locked-accounts", p] as const,

  // User Activities
  userActivitiesDashboard: () => [...auditLogKeys.all, "user-activities-dashboard"] as const,
  userActivityLogs: (p?: AuditLogListParams) => [...auditLogKeys.all, "user-activity-logs", p] as const,
  userActivityDetail: (id: string) => [...auditLogKeys.all, "user-activity-detail", id] as const,

  // Data Changes
  dataChangesDashboard: () => [...auditLogKeys.all, "data-changes-dashboard"] as const,
  dataChangeLogs: (p?: AuditLogListParams) => [...auditLogKeys.all, "data-change-logs", p] as const,
  dataChangeDetail: (id: string) => [...auditLogKeys.all, "data-change-detail", id] as const,

  // Deleted Records
  deletedRecordsDashboard: () => [...auditLogKeys.all, "deleted-records-dashboard"] as const,
  deletedRecordLogs: (p?: AuditLogListParams) => [...auditLogKeys.all, "deleted-record-logs", p] as const,
  deletedRecordDetail: (id: string) => [...auditLogKeys.all, "deleted-record-detail", id] as const,

  // System Logs
  systemLogsDashboard: () => [...auditLogKeys.all, "system-logs-dashboard"] as const,
  systemLogLogs: (p?: AuditLogListParams) => [...auditLogKeys.all, "system-log-logs", p] as const,
  systemLogDetail: (id: string) => [...auditLogKeys.all, "system-log-detail", id] as const,
};

// ─── Hooks ───────────────────────────────────────────────────────────────────

// Tag 19: Audit Logs
export function useAuditLogs(params?: AuditLogListParams) {
  return useQuery({
    queryKey: auditLogKeys.list(params),
    queryFn: () => fetchAuditLogs(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAuditLogSummary() {
  return useQuery({
    queryKey: auditLogKeys.summary(),
    queryFn: fetchAuditLogSummary,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAuditLogDetail(id: string | null) {
  return useQuery({
    queryKey: auditLogKeys.detail(id ?? ""),
    queryFn: () => fetchAuditLogById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Workspaces
export function useCriticalEvents(params?: AuditLogListParams) {
  return useQuery({
    queryKey: auditLogKeys.criticalEvents(params),
    queryFn: () => fetchCriticalEvents(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAuditDashboard(fromDate?: string, toDate?: string) {
  return useQuery({
    queryKey: auditLogKeys.dashboard(fromDate, toDate),
    queryFn: () => fetchAuditDashboard(fromDate, toDate),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAuditFilterOptions() {
  return useQuery({
    queryKey: auditLogKeys.filterOptions(),
    queryFn: fetchAuditFilterOptions,
    staleTime: 10 * 60 * 1000,
  });
}

export function useMainAuditLogs(params?: AuditLogListParams) {
  return useQuery({
    queryKey: auditLogKeys.mainLogs(params),
    queryFn: () => fetchMainAuditLogs(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAuditEventDetail(eventId: string | null) {
  return useQuery({
    queryKey: auditLogKeys.eventDetail(eventId ?? ""),
    queryFn: () => fetchAuditEventDetail(eventId!),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAuditMetrics() {
  return useQuery({
    queryKey: auditLogKeys.metrics(),
    queryFn: fetchAuditMetrics,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAuditWorkspaces() {
  return useQuery({
    queryKey: auditLogKeys.workspaces(),
    queryFn: fetchAuditWorkspaces,
    staleTime: 5 * 60 * 1000,
  });
}

// Login History
export function useLoginHistoryDashboard() {
  return useQuery({
    queryKey: auditLogKeys.loginDashboard(),
    queryFn: fetchLoginHistoryDashboard,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLoginHistoryLogs(params?: AuditLogListParams) {
  return useQuery({
    queryKey: auditLogKeys.loginLogs(params),
    queryFn: () => fetchLoginHistoryLogs(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useLoginEventDetail(eventId: string | null) {
  return useQuery({
    queryKey: auditLogKeys.loginDetail(eventId ?? ""),
    queryFn: () => fetchLoginEventDetail(eventId!),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useActiveSessions(params?: AuditLogListParams) {
  return useQuery({
    queryKey: auditLogKeys.activeSessions(params),
    queryFn: () => fetchActiveSessions(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useFailedLoginAttempts(params?: AuditLogListParams) {
  return useQuery({
    queryKey: auditLogKeys.failedAttempts(params),
    queryFn: () => fetchFailedLoginAttempts(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useLockedAccounts(params?: AuditLogListParams) {
  return useQuery({
    queryKey: auditLogKeys.lockedAccounts(params),
    queryFn: () => fetchLockedAccounts(params),
    staleTime: 5 * 60 * 1000,
  });
}

// User Activities
export function useUserActivitiesDashboard() {
  return useQuery({
    queryKey: auditLogKeys.userActivitiesDashboard(),
    queryFn: fetchUserActivitiesDashboard,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUserActivityLogs(params?: AuditLogListParams) {
  return useQuery({
    queryKey: auditLogKeys.userActivityLogs(params),
    queryFn: () => fetchUserActivityLogs(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUserActivityDetail(eventId: string | null) {
  return useQuery({
    queryKey: auditLogKeys.userActivityDetail(eventId ?? ""),
    queryFn: () => fetchUserActivityDetail(eventId!),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
  });
}

// Data Changes
export function useDataChangesDashboard() {
  return useQuery({
    queryKey: auditLogKeys.dataChangesDashboard(),
    queryFn: fetchDataChangesDashboard,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDataChangeLogs(params?: AuditLogListParams) {
  return useQuery({
    queryKey: auditLogKeys.dataChangeLogs(params),
    queryFn: () => fetchDataChangeLogs(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDataChangeDetail(eventId: string | null) {
  return useQuery({
    queryKey: auditLogKeys.dataChangeDetail(eventId ?? ""),
    queryFn: () => fetchDataChangeDetail(eventId!),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
  });
}

// Deleted Records
export function useDeletedRecordsDashboard() {
  return useQuery({
    queryKey: auditLogKeys.deletedRecordsDashboard(),
    queryFn: fetchDeletedRecordsDashboard,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDeletedRecordLogs(params?: AuditLogListParams) {
  return useQuery({
    queryKey: auditLogKeys.deletedRecordLogs(params),
    queryFn: () => fetchDeletedRecordLogs(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDeletedRecordDetail(eventId: string | null) {
  return useQuery({
    queryKey: auditLogKeys.deletedRecordDetail(eventId ?? ""),
    queryFn: () => fetchDeletedRecordDetail(eventId!),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
  });
}

// System Logs
export function useSystemLogsDashboard() {
  return useQuery({
    queryKey: auditLogKeys.systemLogsDashboard(),
    queryFn: fetchSystemLogsDashboard,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSystemLogLogs(params?: AuditLogListParams) {
  return useQuery({
    queryKey: auditLogKeys.systemLogLogs(params),
    queryFn: () => fetchSystemLogLogs(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSystemLogDetail(eventId: string | null) {
  return useQuery({
    queryKey: auditLogKeys.systemLogDetail(eventId ?? ""),
    queryFn: () => fetchSystemLogDetail(eventId!),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
  });
}

export { auditLogKeys };
