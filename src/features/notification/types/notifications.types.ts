// ─── Notification Domain Types ────────────────────────────────────────────────

export type UserRole =
  | "Hospital Admin"
  | "Doctor"
  | "Receptionist"
  | "Accountant"
  | "Nurse"
  | "Patient Portal";

export type NotificationPriority = "Normal" | "High" | "Critical";

export type NotificationStatus = "Unread" | "Read" | "Completed";

export type NotificationCategory =
  | "Appointments"
  | "Patients"
  | "Doctors"
  | "Consultations"
  | "Prescriptions"
  | "Billing"
  | "Invoices"
  | "Payments"
  | "Revenue"
  | "Vitals"
  | "Clinical Alerts"
  | "Reports"
  | "Security"
  | "Audit"
  | "System"
  | "Registration"
  | "Queue"
  | "Announcements";

export interface NotificationRecord {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  module: string;
  category: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  targetModule: string;
  actionLabel?: string;
  targetId?: string;
  roleVisibility: UserRole[];
}

// ─── API Types (mirrors backend contract) ─────────────────────────────────────

export type NotificationEventType = string;

export type NotificationPriorityLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface NotificationRule {
  id: number;
  eventType: string;
  enabled: boolean;
  priority: string;
  targetRoles: string;
}

export interface NotificationRulePayload {
  id: number;
  eventType: string;
  enabled: boolean;
  priority: string;
  targetRoles: string;
}

export interface NotificationTemplate {
  id: number;
  eventType: string;
  title: string;
  body: string;
  priority: string;
  language: string;
  version: number;
  active: boolean;
}

export interface NotificationTemplatePayload {
  id: number;
  eventType: string;
  title: string;
  body: string;
  priority: string;
  language: string;
  version: number;
  active: boolean;
}

export interface NotificationPreferences {
  role: string;
  inAppEnabled: boolean;
  emailEnabled: boolean;
  criticalAlertsEnabled: boolean;
}

export interface NotificationPreferencesPayload {
  inAppEnabled: boolean;
  emailEnabled: boolean;
  criticalAlertsEnabled: boolean;
}

export interface NotificationListItem {
  id: string;
  eventType: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  status: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPageResponse {
  notifications: NotificationListItem[];
  totalCount: number;
  unreadCount: number;
}

export interface UnreadCountResponse {
  count: number;
}

export interface NotificationDetailResponse {
  id: string;
  eventType: string;
  module: string;
  receiverId: string;
  receiverRole: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  status: string;
  isRead: boolean;
  createdAt: string;
}

export interface TestNotificationResponse {
  id: string;
  eventType: string;
  module: string;
  receiverId: string;
  receiverRole: string;
  title: string;
  message: string;
  priority: string;
  status: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationFailureRecord {
  id: string;
  notificationId?: string;
  channel?: string;
  recipient?: string;
  error?: string;
  status?: string;
  createdAt?: string;
}

export interface MarkReadResponse {
  id: string;
  status: string;
  isRead: boolean;
  readAt: string | null;
}

// ─── Settings / Communication Workspace Types ─────────────────────────────────

export interface NotificationSettings {
  appointmentNotifs: boolean;
  patientNotifs: boolean;
  billingNotifs: boolean;
  reportsNotifs: boolean;
  securityAlerts: boolean;
  emailNotifs: boolean;
  pushNotifs: boolean;
  soundAlerts: boolean;
}

export interface CommunicationChannel {
  id: string;
  name: string;
  desc: string;
  enabled: boolean;
  isDefault: boolean;
  icon: React.ElementType;
}

export type RolePreferenceKey =
  | "inApp"
  | "email"
  | "sms"
  | "push"
  | "critical"
  | "appointment"
  | "billing"
  | "system";

export type RolePreferenceMatrix = Record<UserRole, Record<RolePreferenceKey, boolean>>;

export interface ReminderConfig {
  appointmentReminderTime: string;
  billingReminderTime: string;
  followupReminderTime: string;
  enableAutoReminders: boolean;
}

export interface CommRule {
  label: string;
  sub: string;
  key: string;
}

export interface QuickFilterItem {
  id: string;
  title: string;
  icon: React.ElementType;
}

export interface NotificationKpiMetrics {
  unread: number;
  today: number;
  critical: number;
  completed: number;
}

export interface NotificationPageFilters {
  searchQuery: string;
  priority: string;
  status: string;
  department: string;
  category: string;
}
