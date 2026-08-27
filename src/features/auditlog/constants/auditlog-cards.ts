import {
  Layers,
  LogIn,
  Activity,
  Database,
  Trash2,
  Server,
  AlertTriangle,
} from "lucide-react";
import type { AuditCategory } from "../types/auditlog.types";

export interface QuickActionCard {
  id: AuditCategory;
  title: string;
  description: string;
  icon: typeof Layers;
  color: string;
  bg: string;
  border: string;
  workspaceCode?: string;
}

export const QUICK_ACTION_CARDS: QuickActionCard[] = [
  {
    id: "All Logs",
    title: "All Logs",
    description: "Comprehensive audit log view across all modules.",
    icon: Layers,
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    id: "Login History",
    title: "Login History",
    description:
      "Track user authentication, login attempts, & session timeouts.",
    icon: LogIn,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    workspaceCode: "LOGIN_HISTORY",
  },
  {
    id: "User Activities",
    title: "User Activities",
    description: "Monitor clinical, receptionist, & admin operational actions.",
    icon: Activity,
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
    workspaceCode: "USER_ACTIVITIES",
  },
  {
    id: "Data Changes",
    title: "Data Changes",
    description: "Field-level before/after diffs for patient & doctor records.",
    icon: Database,
    color: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-200",
    workspaceCode: "DATA_CHANGES",
  },
  {
    id: "Deleted Records",
    title: "Deleted Records",
    description: "Cancelled invoices & draft booking removals with reasons.",
    icon: Trash2,
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    workspaceCode: "DELETED_RECORDS",
  },
  {
    id: "System Logs",
    title: "System Logs",
    description: "Automated background tasks, security rules, & system events.",
    icon: Server,
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    workspaceCode: "SYSTEM_LOGS",
  },
  {
    id: "Critical Events",
    title: "Critical Events",
    description: "Security and operational events requiring immediate review.",
    icon: AlertTriangle,
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    workspaceCode: "CRITICAL_EVENTS",
  },
];
