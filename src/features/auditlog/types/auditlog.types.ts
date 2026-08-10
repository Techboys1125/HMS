// ─── Domain Types (UI-facing, adapted from backend) ──────────────────────────

export type AuditCategory =
  | "All Logs"
  | "Login History"
  | "User Activities"
  | "Data Changes"
  | "Deleted Records"
  | "System Logs";

export type AuditSeverity = "Information" | "Success" | "Warning" | "Critical";

export type AuditStatus = "Success" | "Failed" | "Warning" | "Blocked";

export interface AuditRecord {
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
}

// ─── API Envelope ────────────────────────────────────────────────────────────

export interface ApiEnvelope<T> {
  success?: boolean;
  message?: string;
  timestamp?: string;
  data: T;
}

export interface PaginatedData<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// ─── Raw Backend Types (Tag 19: Audit Logs) ──────────────────────────────────

export interface RawAuditLog {
  id: number;
  action: string;
  severity: string;
  actorEmail: string;
  entityType: string;
  entityId?: string;
  flagged: boolean;
  flagReason?: string;
  createdAt: string;
}

export interface AuditLogSummary {
  totalLogs: number;
  flaggedLogs: number;
  infoLogs: number;
  warningLogs: number;
  criticalLogs: number;
}

// ─── Raw Backend Types (Tag 19 Workspaces) ───────────────────────────────────

export interface RawAuditEvent {
  eventId: string;
  timestamp: string;
  category: string;
  module: string;
  action: string;
  performedBy?: {
    userId: string;
    fullName: string;
    role: string;
  };
  severity: string;
  status: string;
  description?: string;
  ipAddress?: string;
}

export interface AuditDashboardData {
  totalAuditEvents: number;
  successfulLogins: number;
  userActivities: number;
  dataChanges: number;
  deletedRecords: number;
  criticalEvents: number;
  trends: {
    totalAuditEvents: number;
    successfulLogins: number;
    userActivities: number;
    dataChanges: number;
    deletedRecords: number;
    criticalEvents: number;
  };
}

export interface AuditFilterOptions {
  modules: string[];
  departments: Array<{ id: string; name: string }>;
  roles: string[];
  severities: string[];
  statuses: string[];
}

export interface AuditMetric {
  key: string;
  label: string;
  value: number;
  trendPercentage: number;
}

export interface AuditWorkspace {
  workspaceId: string;
  name: string;
  count: number;
}

// ─── Raw Backend Types (Login History) ───────────────────────────────────────

export interface RawActiveSession {
  sessionId: string;
  user: { userId: string; fullName: string; role: string };
  loginTime: string;
  ipAddress: string;
  status: string;
}

export interface LoginHistoryDashboard {
  totalLogins: number;
  successfulLogins: number;
  failedAttempts: number;
  lockedAccounts: number;
  trend: number;
}

export interface RawFailedAttempt {
  attemptId: string;
  email: string;
  reason: string;
  attemptedAt: string;
  ipAddress: string;
}

export interface RawLockedAccount {
  userId: string;
  fullName: string;
  role: string;
  email: string;
  lockedAt: string;
  failedAttemptCount: number;
  status: string;
}

export interface RawLoginLog {
  eventId: string;
  user: { userId: string; fullName: string; role: string };
  loginTime: string;
  status: string;
  ipAddress: string;
}

// ─── Raw Backend Types (User Activities) ─────────────────────────────────────

export interface UserActivitiesDashboard {
  totalActivities: number;
  highPriority: number;
  todayActions: number;
  mostActiveUser: {
    userId: string;
    fullName: string;
    role: string;
    activityCount: number;
  };
  trend: number;
}

// ─── Raw Backend Types (Data Changes) ────────────────────────────────────────

export interface DataChangesDashboard {
  modifiedRecords: number;
  patientUpdates: number;
  doctorUpdates: number;
  billingChanges: number;
  trend: number;
}

export interface RawDataChangeLog {
  eventId: string;
  timestamp: string;
  module: string;
  record: { type: string; id: string };
  field: string;
  oldValue: string;
  newValue: string;
  modifiedBy: { userId: string; fullName: string; role: string };
}

// ─── Raw Backend Types (Deleted Records) ─────────────────────────────────────

export interface DeletedRecordsDashboard {
  recordsDeleted: number;
  restored: number;
  permanentDelete: number;
  pendingReview: number;
  trend: number;
}

export interface RawDeletedRecord {
  eventId: string;
  record: { type: string; id: string };
  module: string;
  deletedBy: { userId: string; fullName: string; role: string };
  reason: string;
  deletedAt: string;
}

// ─── Raw Backend Types (System Logs) ─────────────────────────────────────────

export interface SystemLogsDashboard {
  servicesRunning: number;
  totalServices: number;
  backgroundJobs: number;
  warningEvents: number;
  criticalEvents: number;
  operationalPercentage: number;
  trend: number;
}

export interface RawSystemLog {
  eventId: string;
  severity: string;
  event: string;
  module: string;
  description: string;
  timestamp: string;
  status: string;
}

// ─── Query Params ────────────────────────────────────────────────────────────

export interface AuditLogListParams {
  page?: number;
  size?: number;
  fromDate?: string;
  toDate?: string;
}

export interface AuditLogStats {
  totalEvents: number;
  successfulLogins: number;
  failedLogins: number;
  userActivities: number;
  dataChanges: number;
  deletedRecords: number;
  criticalEvents: number;
  activeSessions: number;
}
