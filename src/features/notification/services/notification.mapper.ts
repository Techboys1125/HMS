import type {
  NotificationRecord,
  NotificationListItem,
  NotificationStatus,
  NotificationPriority,
} from "../types/notifications.types";
import { ALL_ROLES } from "../constants/notifications.constants";

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

function toCategory(eventType: string, module?: string, type?: string): string {
  const et = `${eventType || ""} ${module || ""} ${type || ""}`.toUpperCase();
  if (!et.trim()) return "System";
  if (et.includes("APPOINTMENT")) return "Appointments";
  if (et.includes("PRESCRIPTION") || et.includes("MEDICINE"))
    return "Prescriptions";
  if (et.includes("CONSULT")) return "Consultations";
  if (et.includes("SCHEDULE") || et.includes("AVAILABILITY")) return "Schedule";
  if (et.includes("PATIENT")) return "Patients";
  if (et.includes("DOCTOR")) return "Doctors";
  if (et.includes("INVOICE")) return "Invoices";
  if (et.includes("PAYMENT") || et.includes("REFUND")) return "Payments";
  if (et.includes("BILL") || et.includes("BILLING") || et.includes("CHARGE"))
    return "Billing";
  if (et.includes("REVENUE") || et.includes("EARNING")) return "Revenue";
  if (et.includes("VITAL")) return "Vitals";
  if (et.includes("CLINICAL") && et.includes("ALERT")) return "Clinical Alerts";
  if (et.includes("CLINICAL")) return "Clinical Alerts";
  if (et.includes("REGISTRATION") || et.includes("REGISTER"))
    return "Registration";
  if (et.includes("REPORT")) return "Reports";
  if (et.includes("AUDIT")) return "Audit";
  if (et.includes("SECURITY") || et.includes("LOGIN")) return "Security";
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
    category: toCategory(item.eventType, item.module, item.type),
    priority: uiPriority,
    status: uiStatus,
    timestamp: toDisplayTimestamp(item.createdAt),
    targetModule: item.type || "Notifications",
    actionLabel: item.actionLabel || "Open",
    actionUrl: item.actionUrl,
    roleVisibility: ALL_ROLES,
  };
}

export function mapApiNotificationsToRecords(
  items: NotificationListItem[] | undefined,
): NotificationRecord[] {
  return (items ?? []).map((item) => mapApiNotificationToRecord(item));
}
