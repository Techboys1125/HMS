import { apiClient } from "../../../lib/axios";
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
} from "../types/notifications.types";

interface ApiEnvelope<T> {
  data: T;
}

function unwrap<T>(response: { data: unknown }): T {
  const body = response.data;
  if (body && typeof body === "object" && "data" in body) {
    return (body as { data: T }).data;
  }
  return body as T;
}

// ─── Admin Notification Configuration ────────────────────────────────────────

export async function fetchNotificationRules(): Promise<NotificationRule[]> {
  const res = await apiClient.get<ApiEnvelope<NotificationRule[]>>(
    "/api/v1/admin/notifications/rules",
  );
  return unwrap<NotificationRule[]>(res);
}

export async function updateNotificationRule(
  id: number,
  payload: NotificationRulePayload,
): Promise<NotificationRule> {
  const res = await apiClient.put<ApiEnvelope<NotificationRule>>(
    `/api/v1/admin/notifications/rules/${id}`,
    payload,
  );
  return unwrap<NotificationRule>(res);
}

export async function fetchNotificationTemplates(): Promise<NotificationTemplate[]> {
  const res = await apiClient.get<ApiEnvelope<NotificationTemplate[]>>(
    "/api/v1/admin/notifications/templates",
  );
  return unwrap<NotificationTemplate[]>(res);
}

export async function updateNotificationTemplate(
  id: number,
  payload: NotificationTemplatePayload,
): Promise<NotificationTemplate> {
  const res = await apiClient.put<ApiEnvelope<NotificationTemplate>>(
    `/api/v1/admin/notifications/templates/${id}`,
    payload,
  );
  return unwrap<NotificationTemplate>(res);
}

export async function sendTestNotification(
  userId: string,
  eventType: string,
): Promise<TestNotificationResponse> {
  const res = await apiClient.post<ApiEnvelope<TestNotificationResponse>>(
    `/api/v1/admin/notifications/test?userId=${encodeURIComponent(userId)}&eventType=${encodeURIComponent(eventType)}`,
    {},
  );
  return unwrap<TestNotificationResponse>(res);
}

export async function fetchNotificationFailures(): Promise<NotificationFailureRecord[]> {
  const res = await apiClient.get<ApiEnvelope<NotificationFailureRecord[]>>(
    "/api/v1/admin/notifications/failures",
  );
  return unwrap<NotificationFailureRecord[]>(res);
}

// ─── User Notification Preferences ───────────────────────────────────────────

export async function fetchNotificationPreferences(): Promise<NotificationPreferences> {
  const res = await apiClient.get<ApiEnvelope<NotificationPreferences>>(
    "/api/v1/notifications/preferences",
  );
  return unwrap<NotificationPreferences>(res);
}

export async function updateNotificationPreferences(
  payload: NotificationPreferencesPayload,
): Promise<NotificationPreferences> {
  const res = await apiClient.put<ApiEnvelope<NotificationPreferences>>(
    "/api/v1/notifications/preferences",
    payload,
  );
  return unwrap<NotificationPreferences>(res);
}

// ─── User Notification Inbox ──────────────────────────────────────────────────

export async function fetchNotifications(
  page = 0,
  size = 20,
): Promise<NotificationPageResponse> {
  const res = await apiClient.get<ApiEnvelope<NotificationPageResponse>>(
    `/api/v1/notifications?page=${page}&size=${size}`,
  );
  return unwrap<NotificationPageResponse>(res);
}

export async function fetchNotificationDetail(
  id: string,
): Promise<NotificationDetailResponse> {
  const res = await apiClient.get<ApiEnvelope<NotificationDetailResponse>>(
    `/api/v1/notifications/${encodeURIComponent(id)}`,
  );
  return unwrap<NotificationDetailResponse>(res);
}

export async function fetchUnreadCount(): Promise<UnreadCountResponse> {
  const res = await apiClient.get<ApiEnvelope<UnreadCountResponse>>(
    "/api/v1/notifications/unread-count",
  );
  return unwrap<UnreadCountResponse>(res);
}

export async function markNotificationAsRead(id: string): Promise<MarkReadResponse> {
  const res = await apiClient.patch<ApiEnvelope<MarkReadResponse>>(
    `/api/v1/notifications/${encodeURIComponent(id)}/read`,
    {},
  );
  return unwrap<MarkReadResponse>(res);
}

export async function markNotificationAsUnread(id: string): Promise<MarkReadResponse> {
  const res = await apiClient.patch<ApiEnvelope<MarkReadResponse>>(
    `/api/v1/notifications/${encodeURIComponent(id)}/unread`,
    {},
  );
  return unwrap<MarkReadResponse>(res);
}

export async function markAllNotificationsAsRead(): Promise<{ count: number }> {
  const res = await apiClient.patch<ApiEnvelope<{ count: number }>>(
    "/api/v1/notifications/read-all",
    {},
  );
  return unwrap<{ count: number }>(res);
}

export async function deleteNotification(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/notifications/${encodeURIComponent(id)}`);
}
