import type {
  NotificationRecord,
  NotificationListItem,
  NotificationStatus,
  NotificationPriority,
  UserRole,
} from "../types/notifications.types";
import { normalizeRole } from "./role.mapper";

const API_STATUS_TO_UI: Record<string, NotificationStatus> = {
  READ: "Read",
  DELIVERED: "Unread",
  UNREAD: "Unread",
  COMPLETED: "Completed",
};

const API_PRIORITY_TO_UI: Record<string, NotificationPriority> = {
  LOW: "Normal",
  MEDIUM: "Normal",
  NORMAL: "Normal",
  HIGH: "High",
  CRITICAL: "Critical",
};

function toCategory(eventType: string): string {
  if (!eventType) return "System";
  const et = eventType.toUpperCase();
  if (et.includes("APPOINTMENT")) return "Appointments";
  if (et.includes("PATIENT")) return "Patients";
  if (et.includes("DOCTOR")) return "Doctors";
  if (et.includes("PRESCRIPTION") || et.includes("MEDICINE"))
    return "Prescriptions";
  if (
    et.includes("BILL") ||
    et.includes("INVOICE") ||
    et.includes("PAYMENT") ||
    et.includes("REFUND")
  )
    return "Billing";
  if (et.includes("VITAL")) return "Vitals";
  if (et.includes("REPORT")) return "Reports";
  if (et.includes("SECURITY") || et.includes("AUDIT") || et.includes("LOGIN"))
    return "Security";
  if (et.includes("CONSULT")) return "Consultations";
  if (et.includes("QUEUE") || et.includes("CHECK")) return "Queue";
  if (et.includes("MAINTENANCE") || et.includes("SYSTEM")) return "System";
  if (et.includes("ANNOUNCEMENT")) return "Announcements";
  return "System";
}

function toDisplayTimestamp(createdAt: string): string {
  if (!createdAt) return "--";
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return createdAt;
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function mapApiNotificationToRecord(
  item: NotificationListItem,
  currentRole: UserRole,
): NotificationRecord {
  const uiStatus =
    API_STATUS_TO_UI[String(item.status ?? "").toUpperCase()] ?? "Unread";
  const uiPriority =
    API_PRIORITY_TO_UI[String(item.priority ?? "").toUpperCase()] ?? "Normal";
  return {
    id: item.id,
    title: item.title || "Notification",
    description: item.message || "",
    module: item.type || "Notifications",
    category: toCategory(item.eventType),
    priority: uiPriority,
    status: uiStatus,
    timestamp: toDisplayTimestamp(item.createdAt),
    targetModule: item.type || "Notifications",
    actionLabel: "Open",
    roleVisibility: [currentRole],
  };
}

export function mapApiNotificationsToRecords(
  items: NotificationListItem[] | undefined,
  currentRole: UserRole,
): NotificationRecord[] {
  return (items ?? []).map((item) =>
    mapApiNotificationToRecord(item, currentRole),
  );
}

export { normalizeRole };
