import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../auth";
import type { NotificationSettings } from "../types/notifications.types";
import {
  fetchNotificationRules,
  updateNotificationRule,
  fetchNotificationTemplates,
  updateNotificationTemplate,
  sendTestNotification,
  fetchNotificationFailures,
  fetchNotificationPreferences,
  updateNotificationPreferences,
  fetchNotifications,
  fetchNotificationDetail,
  fetchUnreadCount,
  markNotificationAsRead,
  markNotificationAsUnread,
  markAllNotificationsAsRead,
  deleteNotification,
  triggerInternalNotification,
} from "../services/notifications.service";
import { normalizeRole } from "../services/role.mapper";
import type { UserRole } from "../types/notifications.types";

export const notificationKeys = {
  all: ["notifications"] as const,
  rules: () => [...notificationKeys.all, "rules"] as const,
  templates: () => [...notificationKeys.all, "templates"] as const,
  failures: () => [...notificationKeys.all, "failures"] as const,
  preferences: () => [...notificationKeys.all, "preferences"] as const,
  list: (page = 0, size = 20, type?: string, isRead?: boolean) =>
    [...notificationKeys.all, "list", page, size, type, isRead] as const,
  detail: (id: string) => [...notificationKeys.all, "detail", id] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};

// ─── Admin Configuration Hooks ────────────────────────────────────────────────

export function useNotificationRules() {
  return useQuery({
    queryKey: notificationKeys.rules(),
    queryFn: fetchNotificationRules,
  });
}

export function useUpdateNotificationRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Parameters<typeof updateNotificationRule>[1];
    }) => updateNotificationRule(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.rules() });
    },
  });
}

export function useNotificationTemplates() {
  return useQuery({
    queryKey: notificationKeys.templates(),
    queryFn: fetchNotificationTemplates,
  });
}

export function useUpdateNotificationTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Parameters<typeof updateNotificationTemplate>[1];
    }) => updateNotificationTemplate(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.templates() });
    },
  });
}

export function useSendTestNotification() {
  return useMutation({
    mutationFn: ({
      userId,
      eventType,
      payload,
    }: {
      userId: string;
      eventType: string;
      payload?: Parameters<typeof sendTestNotification>[2];
    }) => sendTestNotification(userId, eventType, payload),
  });
}

export function useTriggerInternalNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: triggerInternalNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useNotificationFailures() {
  return useQuery({
    queryKey: notificationKeys.failures(),
    queryFn: fetchNotificationFailures,
  });
}

// ─── User Preferences Hooks ───────────────────────────────────────────────────

export function useNotificationPreferences() {
  return useQuery({
    queryKey: notificationKeys.preferences(),
    queryFn: fetchNotificationPreferences,
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      payload: Parameters<typeof updateNotificationPreferences>[0],
    ) => updateNotificationPreferences(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.preferences(),
      });
    },
  });
}

// ─── Inbox Hooks ──────────────────────────────────────────────────────────────

export function useNotifications(
  page = 0,
  size = 20,
  type?: string,
  isRead?: boolean,
) {
  return useQuery({
    queryKey: notificationKeys.list(page, size, type, isRead),
    queryFn: () => fetchNotifications(page, size, type, isRead),
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useNotificationDetail(id: string) {
  return useQuery({
    queryKey: notificationKeys.detail(id),
    queryFn: () => fetchNotificationDetail(id),
    enabled: !!id,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: fetchUnreadCount,
    refetchInterval: 30000,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useMarkNotificationAsUnread() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationAsUnread(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

// ─── Role & Settings Helpers ──────────────────────────────────────────────────

export function useCurrentRole(): UserRole {
  const user = useAuthStore((s) => s.user);
  return normalizeRole(String(user?.role ?? "HOSPITAL_ADMIN"));
}

export function useCurrentUserId(): string {
  const user = useAuthStore((s) => s.user);
  return String(user?.id ?? user?.employeeId ?? "");
}

export function useNotificationSettingsState() {
  const { data: preferences, isLoading } = useNotificationPreferences();
  const updatePreferences = useUpdateNotificationPreferences();

  const [localSettings, setLocalSettings] = useState({
    appointmentNotifs: true,
    patientNotifs: true,
    billingNotifs: true,
    reportsNotifs: true,
    soundAlerts: false,
  });

  const [localOverrides, setLocalOverrides] = useState<
    Partial<Pick<NotificationSettings, "emailNotifs" | "pushNotifs" | "securityAlerts">>
  >({});

  const settings: NotificationSettings = useMemo(
    () => ({
      ...localSettings,
      emailNotifs: localOverrides.emailNotifs ?? preferences?.emailEnabled ?? true,
      pushNotifs: localOverrides.pushNotifs ?? preferences?.inAppEnabled ?? true,
      securityAlerts:
        localOverrides.securityAlerts ?? preferences?.criticalAlertsEnabled ?? true,
    }),
    [localSettings, localOverrides, preferences],
  );

  const updateSetting = useCallback(
    (key: keyof NotificationSettings, value: boolean) => {
      switch (key) {
        case "emailNotifs":
        case "pushNotifs":
        case "securityAlerts":
          setLocalOverrides((prev) => ({ ...prev, [key]: value }));
          break;
        default:
          setLocalSettings((prev) => ({ ...prev, [key]: value }));
      }
    },
    [],
  );

  const saveSettings = useCallback(async () => {
    await updatePreferences.mutateAsync({
      emailEnabled: settings.emailNotifs,
      inAppEnabled: settings.pushNotifs,
      criticalAlertsEnabled: settings.securityAlerts,
    });
  }, [settings, updatePreferences]);

  return { settings, updateSetting, saveSettings, isLoading };
}
