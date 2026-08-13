import type { LucideIcon } from "lucide-react";

export interface BackupHistory {
  id: string;
  type: string;
  createdOn: string;
  createdBy: string;
  size: string;
  duration: string;
  status: string;
}

export const BACKUP_HISTORY: BackupHistory[] = [];

export interface MaintConfig {
  enableMaintenanceMode: boolean;
  maintenanceMessage: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  notifyUsers: boolean;
}

export const DEFAULT_MAINT_CONFIG: MaintConfig = {
  enableMaintenanceMode: false,
  maintenanceMessage: "",
  scheduledDate: "",
  startTime: "",
  endTime: "",
  notifyUsers: false,
};

export interface StorageBreakdownItem {
  label: string;
  used: string;
  total: string;
  pct: number;
  color: string;
}

export const STORAGE_BREAKDOWN: StorageBreakdownItem[] = [];

export interface ServiceHealthItem {
  service: string;
  status: string;
  latency: string;
  icon: LucideIcon;
  bg: string;
  color: string;
}

export const SERVICE_HEALTH: ServiceHealthItem[] = [];

export interface TimelineActivity {
  title: string;
  user: string;
  time: string;
  module: string;
  status: string;
}

export const SYSTEM_TIMELINE: TimelineActivity[] = [];
