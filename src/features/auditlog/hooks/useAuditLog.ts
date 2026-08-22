import { useQuery } from "@tanstack/react-query";
import {
  fetchActiveSessions,
  fetchAuditDashboard,
  fetchAuditFilterOptions,
  fetchAuditMetrics,
  fetchAuditRecordDetail,
  fetchAuditWorkspaces,
  fetchCriticalEvents,
  fetchDataChangeLogs,
  fetchDataChangesDashboard,
  fetchDeletedRecordLogs,
  fetchDeletedRecordsDashboard,
  fetchFailedLoginAttempts,
  fetchLockedAccounts,
  fetchLoginHistoryDashboard,
  fetchLoginHistoryFilterOptions,
  fetchLoginHistoryLogs,
  fetchMainAuditLogs,
  fetchSystemLogLogs,
  fetchSystemLogsDashboard,
  fetchUserActivitiesDashboard,
  fetchUserActivityLogs,
} from "../services/auditlog.service";
import type {
  AuditCategory,
  AuditLogListParams,
} from "../types/auditlog.types";

const STALE_TIME = 5 * 60 * 1000;

const auditLogKeys = {
  all: ["audit-logs"] as const,
  criticalEvents: (params?: AuditLogListParams) =>
    [...auditLogKeys.all, "critical-events", params] as const,
  dashboard: (fromDate?: string, toDate?: string) =>
    [...auditLogKeys.all, "dashboard", fromDate, toDate] as const,
  filterOptions: () => [...auditLogKeys.all, "filter-options"] as const,
  mainLogs: (params?: AuditLogListParams) =>
    [...auditLogKeys.all, "main-logs", params] as const,
  detail: (id: string, category: AuditCategory) =>
    [...auditLogKeys.all, "detail", category, id] as const,
  metrics: (fromDate?: string, toDate?: string) =>
    [...auditLogKeys.all, "metrics", fromDate, toDate] as const,
  workspaces: () => [...auditLogKeys.all, "workspaces"] as const,
  loginDashboard: (fromDate?: string, toDate?: string) =>
    [...auditLogKeys.all, "login-dashboard", fromDate, toDate] as const,
  loginFilterOptions: () =>
    [...auditLogKeys.all, "login-filter-options"] as const,
  loginLogs: (params?: AuditLogListParams) =>
    [...auditLogKeys.all, "login-logs", params] as const,
  loginDetail: (id: string) =>
    [...auditLogKeys.all, "login-detail", id] as const,
  activeSessions: (params?: AuditLogListParams) =>
    [...auditLogKeys.all, "active-sessions", params] as const,
  failedAttempts: (params?: AuditLogListParams) =>
    [...auditLogKeys.all, "failed-attempts", params] as const,
  lockedAccounts: (params?: AuditLogListParams) =>
    [...auditLogKeys.all, "locked-accounts", params] as const,
  userActivitiesDashboard: (fromDate?: string, toDate?: string) =>
    [
      ...auditLogKeys.all,
      "user-activities-dashboard",
      fromDate,
      toDate,
    ] as const,
  userActivityLogs: (params?: AuditLogListParams) =>
    [...auditLogKeys.all, "user-activity-logs", params] as const,
  userActivityDetail: (id: string) =>
    [...auditLogKeys.all, "user-activity-detail", id] as const,
  dataChangesDashboard: (fromDate?: string, toDate?: string) =>
    [...auditLogKeys.all, "data-changes-dashboard", fromDate, toDate] as const,
  dataChangeLogs: (params?: AuditLogListParams) =>
    [...auditLogKeys.all, "data-change-logs", params] as const,
  dataChangeDetail: (id: string) =>
    [...auditLogKeys.all, "data-change-detail", id] as const,
  deletedRecordsDashboard: (fromDate?: string, toDate?: string) =>
    [
      ...auditLogKeys.all,
      "deleted-records-dashboard",
      fromDate,
      toDate,
    ] as const,
  deletedRecordLogs: (params?: AuditLogListParams) =>
    [...auditLogKeys.all, "deleted-record-logs", params] as const,
  deletedRecordDetail: (id: string) =>
    [...auditLogKeys.all, "deleted-record-detail", id] as const,
  systemLogsDashboard: (fromDate?: string, toDate?: string) =>
    [...auditLogKeys.all, "system-logs-dashboard", fromDate, toDate] as const,
  systemLogLogs: (params?: AuditLogListParams) =>
    [...auditLogKeys.all, "system-log-logs", params] as const,
  systemLogDetail: (id: string) =>
    [...auditLogKeys.all, "system-log-detail", id] as const,
};

export function useCriticalEvents(params?: AuditLogListParams, enabled = true) {
  return useQuery({
    queryKey: auditLogKeys.criticalEvents(params),
    queryFn: () => fetchCriticalEvents(params),
    enabled,
    staleTime: STALE_TIME,
  });
}

export function useAuditDashboard(
  fromDate?: string,
  toDate?: string,
  enabled = true,
) {
  return useQuery({
    queryKey: auditLogKeys.dashboard(fromDate, toDate),
    queryFn: () => fetchAuditDashboard(fromDate, toDate),
    enabled,
    staleTime: STALE_TIME,
  });
}

export function useAuditFilterOptions(enabled = true) {
  return useQuery({
    queryKey: auditLogKeys.filterOptions(),
    queryFn: fetchAuditFilterOptions,
    enabled,
    staleTime: 10 * 60 * 1000,
  });
}

export function useMainAuditLogs(params?: AuditLogListParams, enabled = true) {
  return useQuery({
    queryKey: auditLogKeys.mainLogs(params),
    queryFn: () => fetchMainAuditLogs(params),
    enabled,
    staleTime: STALE_TIME,
  });
}

export function useAuditLogDetail(
  id: string | null,
  category: AuditCategory = "All Logs",
) {
  return useQuery({
    queryKey: auditLogKeys.detail(id ?? "", category),
    queryFn: () => fetchAuditRecordDetail(id!, category),
    enabled: Boolean(id),
    staleTime: STALE_TIME,
    retry: false,
  });
}

export function useAuditMetrics(
  fromDate?: string,
  toDate?: string,
  enabled = true,
) {
  return useQuery({
    queryKey: auditLogKeys.metrics(fromDate, toDate),
    queryFn: () => fetchAuditMetrics(fromDate, toDate),
    enabled,
    staleTime: STALE_TIME,
  });
}

export function useAuditWorkspaces(enabled = true) {
  return useQuery({
    queryKey: auditLogKeys.workspaces(),
    queryFn: fetchAuditWorkspaces,
    enabled,
    staleTime: STALE_TIME,
  });
}

export function useLoginHistoryDashboard(
  fromDate?: string,
  toDate?: string,
  enabled = true,
) {
  return useQuery({
    queryKey: auditLogKeys.loginDashboard(fromDate, toDate),
    queryFn: () => fetchLoginHistoryDashboard(fromDate, toDate),
    enabled,
    staleTime: STALE_TIME,
  });
}

export function useLoginHistoryFilterOptions(enabled = true) {
  return useQuery({
    queryKey: auditLogKeys.loginFilterOptions(),
    queryFn: fetchLoginHistoryFilterOptions,
    enabled,
    staleTime: 10 * 60 * 1000,
  });
}

export function useLoginHistoryLogs(
  params?: AuditLogListParams,
  enabled = true,
) {
  return useQuery({
    queryKey: auditLogKeys.loginLogs(params),
    queryFn: () => fetchLoginHistoryLogs(params),
    enabled,
    refetchOnMount: "always",
    staleTime: STALE_TIME,
  });
}

export function useActiveSessions(params?: AuditLogListParams, enabled = true) {
  return useQuery({
    queryKey: auditLogKeys.activeSessions(params),
    queryFn: () => fetchActiveSessions(params),
    enabled,
    staleTime: STALE_TIME,
  });
}

export function useFailedLoginAttempts(
  params?: AuditLogListParams,
  enabled = true,
) {
  return useQuery({
    queryKey: auditLogKeys.failedAttempts(params),
    queryFn: () => fetchFailedLoginAttempts(params),
    enabled,
    staleTime: STALE_TIME,
  });
}

export function useLockedAccounts(params?: AuditLogListParams, enabled = true) {
  return useQuery({
    queryKey: auditLogKeys.lockedAccounts(params),
    queryFn: () => fetchLockedAccounts(params),
    enabled,
    staleTime: STALE_TIME,
  });
}

export function useUserActivitiesDashboard(
  fromDate?: string,
  toDate?: string,
  enabled = true,
) {
  return useQuery({
    queryKey: auditLogKeys.userActivitiesDashboard(fromDate, toDate),
    queryFn: () => fetchUserActivitiesDashboard(fromDate, toDate),
    enabled,
    staleTime: STALE_TIME,
  });
}

export function useUserActivityLogs(
  params?: AuditLogListParams,
  enabled = true,
) {
  return useQuery({
    queryKey: auditLogKeys.userActivityLogs(params),
    queryFn: () => fetchUserActivityLogs(params),
    enabled,
    refetchOnMount: "always",
    staleTime: STALE_TIME,
  });
}

export function useDataChangesDashboard(
  fromDate?: string,
  toDate?: string,
  enabled = true,
) {
  return useQuery({
    queryKey: auditLogKeys.dataChangesDashboard(fromDate, toDate),
    queryFn: () => fetchDataChangesDashboard(fromDate, toDate),
    enabled,
    staleTime: STALE_TIME,
  });
}

export function useDataChangeLogs(params?: AuditLogListParams, enabled = true) {
  return useQuery({
    queryKey: auditLogKeys.dataChangeLogs(params),
    queryFn: () => fetchDataChangeLogs(params),
    enabled,
    refetchOnMount: "always",
    staleTime: STALE_TIME,
  });
}

export function useDeletedRecordsDashboard(
  fromDate?: string,
  toDate?: string,
  enabled = true,
) {
  return useQuery({
    queryKey: auditLogKeys.deletedRecordsDashboard(fromDate, toDate),
    queryFn: () => fetchDeletedRecordsDashboard(fromDate, toDate),
    enabled,
    staleTime: STALE_TIME,
  });
}

export function useDeletedRecordLogs(
  params?: AuditLogListParams,
  enabled = true,
) {
  return useQuery({
    queryKey: auditLogKeys.deletedRecordLogs(params),
    queryFn: () => fetchDeletedRecordLogs(params),
    enabled,
    refetchOnMount: "always",
    staleTime: STALE_TIME,
  });
}

export function useSystemLogsDashboard(
  fromDate?: string,
  toDate?: string,
  enabled = true,
) {
  return useQuery({
    queryKey: auditLogKeys.systemLogsDashboard(fromDate, toDate),
    queryFn: () => fetchSystemLogsDashboard(fromDate, toDate),
    enabled,
    staleTime: STALE_TIME,
  });
}

export function useSystemLogLogs(params?: AuditLogListParams, enabled = true) {
  return useQuery({
    queryKey: auditLogKeys.systemLogLogs(params),
    queryFn: () => fetchSystemLogLogs(params),
    enabled,
    refetchOnMount: "always",
    staleTime: STALE_TIME,
  });
}

export { auditLogKeys };

// Aliases for backward-compat consumers that import these names
