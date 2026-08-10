import {
  Layers,
  LogIn,
  Activity,
  Database,
  Trash2,
  Server,
} from "lucide-react";
import type { AuditCategory } from "../types/auditlog.types";

interface QuickActionCard {
  id: AuditCategory;
  title: string;
  description: string;
  icon: typeof Layers;
  color: string;
  bg: string;
  border: string;
  badge: string;
}

export const QUICK_ACTION_CARDS: QuickActionCard[] = [
  {
    id: "All Logs",
    title: "All Logs",
    description: "Comprehensive audit log view across all Phase 1 modules.",
    icon: Layers,
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    badge: "All Records",
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
    badge: "Auth Events",
  },
  {
    id: "User Activities",
    title: "User Activities",
    description: "Monitor clinical, receptionist, & admin operational actions.",
    icon: Activity,
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
    badge: "User Actions",
  },
  {
    id: "Data Changes",
    title: "Data Changes",
    description: "Field-level before/after diffs for patient & doctor records.",
    icon: Database,
    color: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-200",
    badge: "Modifications",
  },
  {
    id: "Deleted Records",
    title: "Deleted Records",
    description: "Cancelled invoices & draft booking removals with reasons.",
    icon: Trash2,
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "Deletions",
  },
  {
    id: "System Logs",
    title: "System Logs",
    description: "Automated background tasks, security rules, & system events.",
    icon: Server,
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    badge: "System Events",
  },
];
