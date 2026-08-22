import type {
  NotificationRule,
  NotificationRulePayload,
  NotificationTemplate,
  NotificationTemplatePayload,
  NotificationPreferences,
  NotificationPreferencesPayload,
  NotificationPageResponse,
  UnreadCountResponse,
  NotificationDetailResponse,
  TestNotificationResponse,
  NotificationFailureRecord,
  MarkReadResponse,
  TestNotificationPayload,
  InternalNotificationPayload,
} from "../types/notifications.types";

export {
  fetchNotificationRules,
  updateNotificationRule,
  fetchNotificationTemplates,
  updateNotificationTemplate,
  sendTestNotification,
  fetchNotificationFailures,
  fetchNotificationPreferences,
  updateNotificationPreferences,
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markNotificationAsUnread,
  markAllNotificationsAsRead,
  deleteNotification,
  triggerInternalNotification,
} from "../api/notification.api";

export {
  mapApiNotificationToRecord,
  mapApiNotificationsToRecords,
} from "./notification.mapper";
export { normalizeRole } from "./role.mapper";

// ─── Typed re-exports for consumers of the service layer ─────────────────────
export type {
  NotificationRule,
  NotificationRulePayload,
  NotificationTemplate,
  NotificationTemplatePayload,
  NotificationPreferences,
  NotificationPreferencesPayload,
  NotificationPageResponse,
  UnreadCountResponse,
  NotificationDetailResponse,
  TestNotificationResponse,
  NotificationFailureRecord,
  MarkReadResponse,
  TestNotificationPayload,
  InternalNotificationPayload,
};
