import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { RB } from "../constants/notifications.constants";
import {
  NotificationPageHeader,
  NotificationKpiCards,
  NotificationQuickFilters,
  NotificationFilterBar,
  NotificationList,
  NotificationSettingsDrawer,
} from "../components";
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useMarkNotificationAsUnread,
  useDeleteNotification,
  useNotifications,
  useNotificationSettingsState,
} from "../hooks/useNotifications";
import { mapApiNotificationsToRecords } from "../services/notification.mapper";
import { ROLE_QUICK_FILTERS } from "../constants/notifications.constants";
import { ROUTES } from "../../../app/routes/routes";
import type {
  NotificationRecord,
} from "../types/notifications.types";

const PAGE_SIZE = 100;

function resolvePatientRoute(record: NotificationRecord): string {
  const category = String(record.category || "").toUpperCase();
  switch (category) {
    case "APPOINTMENTS":
      return ROUTES.PATIENT_APPOINTMENTS;
    case "PRESCRIPTIONS":
      return ROUTES.PATIENT_PRESCRIPTIONS;
    case "INVOICES":
    case "BILLING":
    case "PAYMENTS":
      return ROUTES.PATIENT_BILLING;
    case "ANNOUNCEMENTS":
      return ROUTES.PATIENT_NOTIFICATIONS;
    default:
      return ROUTES.PATIENT_NOTIFICATIONS;
  }
}

export function PatientNotificationsPage() {
  const navigate = useNavigate();
  const currentRole = "Patient Portal";
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { settings, updateSetting, saveSettings } =
    useNotificationSettingsState();
  const {
    data: pageData,
    isLoading,
    error,
    refetch,
  } = useNotifications(currentPage - 1, PAGE_SIZE);
  const markAllReadMutation = useMarkAllNotificationsAsRead();
  const markReadMutation = useMarkNotificationAsRead();
  const markUnreadMutation = useMarkNotificationAsUnread();
  const deleteMutation = useDeleteNotification();

  const roleNotifications = useMemo(() => {
    return mapApiNotificationsToRecords(pageData?.notifications);
  }, [pageData]);

  const activeQuickFilters = ROLE_QUICK_FILTERS[currentRole];

  const quickFilterCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    activeQuickFilters.forEach((filter) => {
      if (filter.id === "All") {
        counts.All = roleNotifications.length;
      } else if (filter.id === "Unread") {
        counts.Unread = roleNotifications.filter((n) => n.status === "Unread").length;
      } else {
        counts[filter.id] = roleNotifications.filter((n) => n.category === filter.id).length;
      }
    });
    return counts;
  }, [activeQuickFilters, roleNotifications]);

  const filteredNotifications = useMemo(() => {
    return roleNotifications.filter((n) => {
      if (selectedCategory === "Unread" && n.status !== "Unread") return false;
      if (
        selectedCategory !== "All" &&
        selectedCategory !== "Unread" &&
        n.category !== selectedCategory
      )
        return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = n.title.toLowerCase().includes(query);
        const matchDesc = n.description.toLowerCase().includes(query);
        const matchModule = n.module.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchModule) return false;
      }

      if (priorityFilter !== "All" && n.priority !== priorityFilter)
        return false;
      if (statusFilter !== "All" && n.status !== statusFilter) return false;

      return true;
    });
  }, [roleNotifications, selectedCategory, searchQuery, priorityFilter, statusFilter]);

  const kpiMetrics = useMemo(() => {
    const unread = roleNotifications.filter((n) => n.status === "Unread").length;
    const today = roleNotifications.filter(
      (n) =>
        n.timestamp.includes("minute") ||
        n.timestamp.includes("hour") ||
        n.timestamp === "Just now",
    ).length;
    const critical = roleNotifications.filter(
      (n) => n.priority === "Critical" || n.priority === "High",
    ).length;
    const completed = roleNotifications.filter(
      (n) => n.status === "Completed",
    ).length;

    return { unread, today, critical, completed };
  }, [roleNotifications]);

  const totalElements = pageData?.totalCount ?? roleNotifications.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / PAGE_SIZE));

  const handleMarkAllAsRead = async () => {
    await markAllReadMutation.mutateAsync();
  };

  const handleToggleReadStatus = async (id: string) => {
    const item = roleNotifications.find((n) => n.id === id);
    if (!item) return;
    if (item.status === "Unread") {
      await markReadMutation.mutateAsync(id);
    } else {
      await markUnreadMutation.mutateAsync(id);
    }
  };

  const handleOpenAction = async (n: NotificationRecord) => {
    if (n.status === "Unread") {
      await markReadMutation.mutateAsync(n.id);
    }
    navigate(resolvePatientRoute(n));
  };

  const handleOpenModule = async (n: NotificationRecord) => {
    navigate(resolvePatientRoute(n));
  };

  const handleDeleteNotification = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setPriorityFilter("All");
    setStatusFilter("All");
  };

  const handleSaveSettings = async () => {
    await saveSettings();
    setIsSettingsOpen(false);
  };

  return (
    <div
      style={{ fontFamily: RB }}
      className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9] text-[#111827]"
    >
      <NotificationPageHeader
        currentRole={currentRole}
        onMarkAllAsRead={handleMarkAllAsRead}
        markAllPending={markAllReadMutation.isPending}
        onRefresh={() => refetch()}
        onOpenSettings={() => setIsSettingsOpen(true)}
        canExport={false}
        onExport={() => void 0}
      />

      <NotificationKpiCards metrics={kpiMetrics} />

      <NotificationQuickFilters
        filters={activeQuickFilters}
        counts={quickFilterCounts}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <NotificationFilterBar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onResetFilters={handleResetFilters}
      />

      <NotificationList
        items={filteredNotifications}
        currentRole={currentRole}
        isLoading={isLoading}
        error={error instanceof Error ? error.message : undefined}
        onOpenAction={handleOpenAction}
        onOpenModule={handleOpenModule}
        onToggleRead={handleToggleReadStatus}
        onDelete={handleDeleteNotification}
        onPreviousPage={() => setCurrentPage((p) => Math.max(1, p - 1))}
        onNextPage={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        canGoPrevious={currentPage > 1}
        canGoNext={currentPage < totalPages}
      />

      <NotificationSettingsDrawer
        open={isSettingsOpen}
        currentRole={currentRole}
        settings={settings}
        updateSetting={updateSetting}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
      />
    </div>
  );
}
