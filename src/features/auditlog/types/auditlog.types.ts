export type AuditCategory =
  | "All Logs"
  | "Critical Events"
  | "Login History"
  | "User Activities"
  | "Data Changes"
  | "Deleted Records"
  | "System Logs";

export type AuditSeverity = "Information" | "Success" | "Warning" | "Critical";

/**
 * The API exposes several valid states (for example OPEN, HEALTHY, ARCHIVED,
 * and LOCKED), so this remains a string instead of reducing server states to a
 * small UI-only enum.
 */
export type AuditStatus = string;

export interface AuditUser {
  userId?: string;
  fullName?: string;
  role?: string;
}

export interface AuditEntity {
  type?: string;
  id?: string;
}

export interface AuditChange {
  field: string;
  before: string;
  after: string;
}

/** UI-facing record adapted from the audit API responses. */
export interface AuditRecord {
  id: string;
  timestamp: string;
  category: AuditCategory;
  categoryCode?: string;
  module: string;
  user: string;
  userId?: string;
  userRole: string;
  department?: string;
  action: string;
  description: string;
  severity: AuditSeverity;
  severityCode?: string;
  status: AuditStatus;
  statusCode?: string;
  ipAddress?: string;
  device?: string;
  browser?: string;
  userAgent?: string;
  sessionId?: string;
  sessionDuration?: string;
  loginTime?: string;
  logoutTime?: string;
  authenticationMethod?: string;
  recordId?: string;
  recordType?: string;
  fieldChanged?: string;
  oldValue?: string;
  newValue?: string;
  deletionReason?: string;
  systemEventCode?: string;
  eventType?: string;
  requestId?: string;
  source?: string;
  service?: string;
  failureReason?: string;
  failedAttemptCount?: number;
  changes?: AuditChange[];
  metadata?: Record<string, unknown>;
  raw?: Record<string, unknown>;
}

export interface ApiEnvelope<T> {
  success?: boolean;
  code?: string;
  message?: string;
  timestamp?: string;
  data: T;
  errors?: Record<string, unknown>;
  traceId?: string;
}

export interface PaginatedData<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first?: boolean;
  last?: boolean;
  numberOfElements?: number;
}

export interface RawAuditEvent {
  eventId: string;
  timestamp?: string;
  eventType?: string;
  category?: string;
  severity?: string;
  status?: string;
  title?: string;
  description?: string;
  module?: string;
  action?: string;
  user?: AuditUser;
  performedBy?: AuditUser;
  entityType?: string;
  entityId?: string;
  entity?: AuditEntity;
  changes?: Array<{
    field?: string;
    before?: unknown;
    after?: unknown;
  }>;
  ipAddress?: string;
  device?: string;
  userAgent?: string;
  requestId?: string;
  metadata?: Record<string, unknown>;
}

export interface AuditDashboardData {
  totalAuditEvents: number;
  successfulLogins: number;
  userActivities: number;
  dataChanges: number;
  deletedRecords: number;
  criticalEvents: number;
  trends?: Record<string, number>;
}

export type AuditSelectOption =
  | string
  | {
      id?: string;
      code?: string;
      name?: string;
      userId?: string;
      fullName?: string;
      role?: string;
    };

export interface AuditFilterOptions {
  modules: AuditSelectOption[];
  departments: AuditSelectOption[];
  roles: AuditSelectOption[];
  users: AuditSelectOption[];
  severities: AuditSelectOption[];
  statuses: AuditSelectOption[];
  eventTypes: AuditSelectOption[];
}

export interface AuditMetric {
  code: string;
  label: string;
  value: number;
  trend?: number;
  trendDirection?: "UP" | "DOWN" | "FLAT" | string;
}

export interface AuditWorkspace {
  code: string;
  name: string;
  count: number;
}

export interface RawActiveSession {
  sessionId: string;
  user?: AuditUser;
  loginTime?: string;
  lastActivityTime?: string;
  ipAddress?: string;
  device?: string;
  status?: string;
}

export interface LoginHistoryDashboard {
  successfulLogins: number;
  failedLogins: number;
  lockedAccounts: number;
  activeSessions: number;
  trends?: {
    success?: number;
    failed?: number;
  };
}

export interface RawFailedAttempt {
  eventId?: string;
  timestamp?: string;
  userId?: string;
  userName?: string;
  role?: string;
  ipAddress?: string;
  device?: string;
  attemptCount?: number;
  failureReason?: string;
  status?: string;
  severity?: string;
}

export interface RawLockedAccount {
  userId?: string;
  fullName?: string;
  role?: string;
  email?: string;
  lockedAt?: string;
  lockedUntil?: string;
  failedAttemptCount?: number;
  reason?: string;
  status?: string;
}

export interface RawLoginLog {
  eventId: string;
  user?: AuditUser;
  loginTime?: string;
  logoutTime?: string;
  ipAddress?: string;
  device?: string;
  userAgent?: string;
  status?: string;
  eventType?: string;
  authenticationMethod?: string;
  sessionId?: string;
  requestId?: string;
  location?: string;
  failureReason?: string | null;
  failedAttemptCount?: number;
}

export interface UserActivitiesDashboard {
  totalActivities: number;
  highPriority: number;
  todayActions: number;
  mostActiveUser?: AuditUser & { activityCount?: number };
  trend?: number;
}

export interface DataChangesDashboard {
  modifiedRecords: number;
  patientUpdates: number;
  doctorUpdates: number;
  billingChanges: number;
  trend?: number;
}

export interface RawDataChangeLog {
  eventId: string;
  timestamp?: string;
  module?: string;
  record?: AuditEntity;
  field?: string;
  oldValue?: unknown;
  newValue?: unknown;
  modifiedBy?: AuditUser;
  severity?: string;
  status?: string;
}

export interface DeletedRecordsDashboard {
  recordsDeleted: number;
  restored: number;
  permanentDelete: number;
  pendingReview: number;
  trend?: number;
}

export interface RawDeletedRecord {
  eventId: string;
  timestamp?: string;
  category?: string;
  action?: string;
  record?: AuditEntity;
  module?: string;
  deletedBy?: AuditUser;
  reason?: string;
  deletedAt?: string;
  severity?: string;
  status?: string;
  ipAddress?: string;
  requestId?: string;
}

export interface SystemLogsDashboard {
  servicesRunning: number;
  totalServices: number;
  backgroundJobs: number;
  warningEvents: number;
  criticalEvents: number;
  operationalPercentage: number;
  trend?: number;
}

export interface RawSystemLog {
  eventId: string;
  severity?: string;
  event?: string;
  module?: string;
  description?: string;
  timestamp?: string;
  status?: string;
  source?: string;
  service?: string;
  requestId?: string;
}

export interface AuditLogListParams {
  page?: number;
  size?: number;
  fromDate?: string;
  toDate?: string;
}
