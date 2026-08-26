import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { RB } from "../constants/notifications.constants";
import { NotificationPageHeader } from "../components/NotificationPageHeader";
import { NotificationKpiCards } from "../components/NotificationKpiCards";
import { NotificationQuickFilters } from "../components/NotificationQuickFilters";
import { NotificationFilterBar } from "../components/NotificationFilterBar";
import { NotificationList } from "../components/NotificationList";
import { NotificationSettingsDrawer } from "../components/NotificationSettingsDrawer";
import {
  useNotifications,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useMarkNotificationAsUnread,
  useDeleteNotification,
  useCurrentRole,
  useNotificationSettingsState,
} from "../hooks/useNotifications";
import { getNotificationPermission } from "../permissions/notifications.permissions";
import { mapApiNotificationsToRecords } from "../services/notification.mapper";
import { ROLE_QUICK_FILTERS } from "../constants/notifications.constants";
import { ROUTES } from "../../../app/routes/routes";
import type {
  NotificationRecord,
  UserRole,
} from "../types/notifications.types";

export interface NotificationCenterPageProps {
  currentRole?: UserRole;
  onNavigateToModule?: (module: string, targetId?: string) => void;
}

const PAGE_SIZE = 100;

function resolveModuleRoute(record: NotificationRecord): string {
  const actionUrl = String(record.actionUrl || "").trim();
  if (actionUrl.startsWith("/")) return actionUrl;

  const text =
    `${record.targetModule || ""} ${record.module || ""} ${record.category || ""} ${record.title || ""} ${record.description || ""}`.toUpperCase();

  if (
    text.includes("APPOINTMENT") ||
    text.includes("CHECK-IN") ||
    text.includes("SLOT") ||
    text.includes("BOOKING")
  ) {
    return ROUTES.APPOINTMENTS;
  }
  if (
    text.includes("PATIENT") ||
    text.includes("MRN") ||
    text.includes("REGISTRATION")
  ) {
    return ROUTES.PATIENTS;
  }
  if (
    text.includes("DOCTOR") ||
    text.includes("PHYSICIAN") ||
    text.includes("SCHEDULE")
  ) {
    return ROUTES.DOCTORS;
  }
  if (
    text.includes("BILL") ||
    text.includes("INVOICE") ||
    text.includes("PAYMENT") ||
    text.includes("COLLECT") ||
    text.includes("FINANCIAL")
  ) {
    return ROUTES.BILLING;
  }
  if (
    text.includes("REPORT") ||
    text.includes("REVENUE") ||
    text.includes("ANALYTICS")
  ) {
    return ROUTES.REPORTS;
  }
  if (text.includes("QUEUE") || text.includes("WAITING")) {
    return ROUTES.QUEUE;
  }
  if (text.includes("VITAL") || text.includes("TRIAGE")) {
    return ROUTES.VITALS;
  }
  if (
    text.includes("PRESCRIPTION") ||
    text.includes("MEDICATION") ||
    text.includes("DRUG")
  ) {
    return ROUTES.PRESCRIPTIONS;
  }
  if (text.includes("CONSULTATION") || text.includes("ENCOUNTER")) {
    return ROUTES.CONSULTATION;
  }
  if (text.includes("SETTING")) {
    return ROUTES.SETTINGS;
  }

  return ROUTES.DASHBOARD;
}

export function NotificationCenterPage({
  currentRole: externalRole,
  onNavigateToModule,
}: NotificationCenterPageProps) {
  const navigate = useNavigate();
  const role = useCurrentRole();
  const currentRole = externalRole || role;
  const permissions = getNotificationPermission(String(role));

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
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

  const activeQuickFilters = useMemo(() => {
    return (
      ROLE_QUICK_FILTERS[currentRole] || ROLE_QUICK_FILTERS["Hospital Admin"]
    );
  }, [currentRole]);

  const quickFilterCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    activeQuickFilters.forEach((filter) => {
      if (filter.id === "All") {
        counts["All"] = roleNotifications.length;
      } else if (filter.id === "Unread") {
        counts["Unread"] = roleNotifications.filter(
          (n) => n.status === "Unread",
        ).length;
      } else {
        counts[filter.id] = roleNotifications.filter(
          (n) => n.category === filter.id,
        ).length;
      }
    });
    return counts;
  }, [roleNotifications, activeQuickFilters]);

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
      if (departmentFilter !== "All" && n.module !== departmentFilter)
        return false;

      return true;
    });
  }, [
    roleNotifications,
    selectedCategory,
    searchQuery,
    priorityFilter,
    statusFilter,
    departmentFilter,
  ]);

  const kpiMetrics = useMemo(() => {
    const unread = roleNotifications.filter(
      (n) => n.status === "Unread",
    ).length;
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
    const route = resolveModuleRoute(n);
    if (onNavigateToModule) onNavigateToModule(route, n.targetId);
    else navigate(route);
  };

  const handleOpenModule = async (n: NotificationRecord) => {
    const route = resolveModuleRoute(n);
    if (onNavigateToModule) onNavigateToModule(route, n.targetId);
    else navigate(route);
  };

  const handleDeleteNotification = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleExport = () => {
    const rows = filteredNotifications.map((n) => [
      n.id,
      n.title,
      n.description,
      n.module,
      n.category,
      n.priority,
      n.status,
      n.timestamp,
    ]);
    const header = [
      "ID",
      "Title",
      "Description",
      "Module",
      "Category",
      "Priority",
      "Status",
      "Timestamp",
    ];
    const csv = [header, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `notification-log-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveSettings = async () => {
    await saveSettings();
    setIsSettingsOpen(false);
  };

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setPriorityFilter("All");
    setStatusFilter("All");
    setDepartmentFilter("All");
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
        canExport={permissions.canExport}
        onExport={handleExport}
      />

      <NotificationKpiCards metrics={kpiMetrics} />

      <NotificationQuickFilters
        filters={activeQuickFilters}
        counts={quickFilterCounts}
        selected={selectedCategory}
        onSelect={handleSelectCategory}
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
