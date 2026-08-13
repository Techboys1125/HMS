export interface SecurityEvent {
  id: string;
  event: string;
  category: string;
  severity: string;
  triggeredBy: string;
  datetime: string;
  status: string;
}

export const SECURITY_EVENTS: SecurityEvent[] = [
  {
    id: "e1",
    event: "Failed Login Attempt",
    category: "Authentication",
    severity: "High",
    triggeredBy: "Unknown IP (192.168.1.105)",
    datetime: "Today, 18:22",
    status: "Blocked",
  },
  {
    id: "e2",
    event: "Password Reset Request",
    category: "Account Security",
    severity: "Low",
    triggeredBy: "Dr. Arjun Mehta",
    datetime: "Today, 14:10",
    status: "Completed",
  },
  {
    id: "e3",
    event: "Role Permission Modified",
    category: "RBAC Policy",
    severity: "Medium",
    triggeredBy: "Super Admin",
    datetime: "Yesterday, 16:45",
    status: "Audited",
  },
  {
    id: "e4",
    event: "New Unrecognized Device Login",
    category: "Authentication",
    severity: "High",
    triggeredBy: "Sarah Jenkins (Admin)",
    datetime: "Yesterday, 11:30",
    status: "2FA Verified",
  },
  {
    id: "e5",
    event: "Account Lock Triggered",
    category: "Protection",
    severity: "Critical",
    triggeredBy: "Nurse Practitioner #42",
    datetime: "2 days ago",
    status: "Locked",
  },
  {
    id: "e6",
    event: "Security Policy Updated",
    category: "Governance",
    severity: "Medium",
    triggeredBy: "Super Admin",
    datetime: "3 days ago",
    status: "Active",
  },
];
