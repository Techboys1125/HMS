import { useState, useMemo } from "react";
import {
  Search,
  RefreshCw,
  ChevronRight,
  CheckCircle2,
  Bell,
  AlertTriangle,
  Info,
  Clock,
  Shield,
  Calendar,
  Users,
  UserCheck,
  CreditCard,
  FileText,
  Settings,
  Download,
  X,
  Activity,
  Pill,
  MessageSquare,
  Megaphone,
  Receipt,
  DollarSign,
} from "lucide-react";

// --- Typography Tokens ---
const PP = "Poppins, sans-serif";
const RB = "Roboto, sans-serif";

// --- Types ---
export type UserRole =
  | "Hospital Admin"
  | "Doctor"
  | "Receptionist"
  | "Accountant"
  | "Nurse"
  | "Patient Portal";

export type NotificationPriority = "Normal" | "High" | "Critical";
export type NotificationStatus = "Unread" | "Read" | "Completed";

export type NotificationRecord = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  module: string;
  category: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  targetModule: string; // ID or name of the module to route on "Open" click
  actionLabel?: string;
  targetId?: string;
  roleVisibility: UserRole[]; // strictly role-scoped
};

interface NotificationCenterManagementProps {
  currentRole?: UserRole;
  onNavigateToModule?: (module: string, targetId?: string) => void;
}

// Master Role-Based Notifications Dataset matching Phase 1 SRS & CRD
const INITIAL_NOTIFICATIONS: NotificationRecord[] = [
  // --- Hospital Admin Notifications ---
  {
    id: "NOT-ADM-01",
    title: "Patient Registered",
    description:
      "Patient Emma Reyes (MRN: P-90823) successfully registered in the system.",
    timestamp: "10 minutes ago",
    module: "Patients Module",
    category: "Patients",
    priority: "Normal",
    status: "Unread",
    targetModule: "Patients",
    actionLabel: "Open Patient",
    targetId: "P-90823",
    roleVisibility: ["Hospital Admin"],
  },
  {
    id: "NOT-ADM-02",
    title: "Doctor Added",
    description: "Dr. Ananya Roy assigned to Cardiology OPD Department.",
    timestamp: "25 minutes ago",
    module: "Doctor Module",
    category: "Doctors",
    priority: "Normal",
    status: "Unread",
    targetModule: "Doctors",
    actionLabel: "Open Doctor",
    targetId: "DOC-108",
    roleVisibility: ["Hospital Admin"],
  },
  {
    id: "NOT-ADM-03",
    title: "Doctor Updated",
    description: "Dr. Arjun Mehta profile & specialization details modified.",
    timestamp: "1 hour ago",
    module: "Doctor Module",
    category: "Doctors",
    priority: "Normal",
    status: "Read",
    targetModule: "Doctors",
    actionLabel: "Open Doctor",
    targetId: "DOC-101",
    roleVisibility: ["Hospital Admin"],
  },
  {
    id: "NOT-ADM-04",
    title: "Appointment Cancelled",
    description: "OPD Appointment APT-8072 requested cancellation by patient.",
    timestamp: "1 hour ago",
    module: "Appointments Module",
    category: "Appointments",
    priority: "Normal",
    status: "Unread",
    targetModule: "Appointments",
    actionLabel: "Open Appointment",
    targetId: "APT-8072",
    roleVisibility: ["Hospital Admin"],
  },
  {
    id: "NOT-ADM-05",
    title: "Invoice Generated",
    description: "Batch OPD invoices compiled for morning consultation queue.",
    timestamp: "2 hours ago",
    module: "Billing Module",
    category: "Billing",
    priority: "Normal",
    status: "Read",
    targetModule: "Billing",
    actionLabel: "Open Billing",
    roleVisibility: ["Hospital Admin"],
  },
  {
    id: "NOT-ADM-06",
    title: "Payment Received",
    description: "Daily collection total ₹1,42,850 successfully reconciled.",
    timestamp: "2 hours ago",
    module: "Billing Module",
    category: "Billing",
    priority: "Normal",
    status: "Completed",
    targetModule: "Billing",
    actionLabel: "Open Billing",
    roleVisibility: ["Hospital Admin"],
  },
  {
    id: "NOT-ADM-07",
    title: "Revenue Report Ready",
    description: "Weekly financial performance analytics report generated.",
    timestamp: "3 hours ago",
    module: "Reports Module",
    category: "Reports",
    priority: "Normal",
    status: "Read",
    targetModule: "Reports",
    actionLabel: "Open Report",
    roleVisibility: ["Hospital Admin"],
  },
  {
    id: "NOT-ADM-08",
    title: "Audit Warning",
    description: "Unusual permission alteration detected on User ADM-04.",
    timestamp: "3 hours ago",
    module: "Audit Module",
    category: "Audit",
    priority: "High",
    status: "Unread",
    targetModule: "Audit Logs",
    actionLabel: "Open Audit Log",
    roleVisibility: ["Hospital Admin"],
  },
  {
    id: "NOT-ADM-09",
    title: "Deleted Record",
    description: "Draft prescription record deleted by Dr. Rajesh Sharma.",
    timestamp: "4 hours ago",
    module: "Audit Module",
    category: "Audit",
    priority: "Normal",
    status: "Read",
    targetModule: "Audit Logs",
    actionLabel: "Open Audit Log",
    roleVisibility: ["Hospital Admin"],
  },
  {
    id: "NOT-ADM-10",
    title: "Failed Login Attempt",
    description:
      "3 consecutive invalid password attempts from IP 192.168.1.112.",
    timestamp: "5 hours ago",
    module: "Security Module",
    category: "Security",
    priority: "Critical",
    status: "Unread",
    targetModule: "Audit Logs",
    actionLabel: "Open Audit Log",
    roleVisibility: ["Hospital Admin"],
  },
  {
    id: "NOT-ADM-11",
    title: "System Backup Completed",
    description: "Database snapshot v3.8 backup finished without errors.",
    timestamp: "6 hours ago",
    module: "System Module",
    category: "System",
    priority: "Normal",
    status: "Read",
    targetModule: "Settings",
    actionLabel: "Open Settings",
    roleVisibility: ["Hospital Admin"],
  },
  {
    id: "NOT-ADM-12",
    title: "Permission Updated",
    description: "Role access policies updated for Receptionist user group.",
    timestamp: "7 hours ago",
    module: "System Module",
    category: "System",
    priority: "Normal",
    status: "Read",
    targetModule: "Settings",
    actionLabel: "Open Settings",
    roleVisibility: ["Hospital Admin"],
  },
  {
    id: "NOT-ADM-13",
    title: "Report Generated",
    description: "Monthly OPD Patient Attendance summary compiled.",
    timestamp: "8 hours ago",
    module: "Reports Module",
    category: "Reports",
    priority: "Normal",
    status: "Completed",
    targetModule: "Reports",
    actionLabel: "Open Report",
    roleVisibility: ["Hospital Admin"],
  },

  // --- Doctor Notifications ---
  {
    id: "NOT-DOC-01",
    title: "Today's Appointment Reminder",
    description: "You have 14 OPD patient consultations scheduled for today.",
    timestamp: "15 minutes ago",
    module: "Appointments Module",
    category: "Appointments",
    priority: "Normal",
    status: "Unread",
    targetModule: "Appointments",
    actionLabel: "Open Appointment",
    roleVisibility: ["Doctor"],
  },
  {
    id: "NOT-DOC-02",
    title: "Patient Checked In",
    description:
      "Patient Sarah Mitchell checked in for Cardiology OPD (Token #08).",
    timestamp: "30 minutes ago",
    module: "Appointments Module",
    category: "Appointments",
    priority: "Normal",
    status: "Unread",
    targetModule: "Appointments",
    actionLabel: "Open Appointment",
    targetId: "P-10023",
    roleVisibility: ["Doctor"],
  },
  {
    id: "NOT-DOC-03",
    title: "Consultation Waiting",
    description:
      "Patient Robert Chen is waiting in Room 4 for OPD consultation.",
    timestamp: "45 minutes ago",
    module: "Consultation Module",
    category: "Consultations",
    priority: "High",
    status: "Unread",
    targetModule: "Consultation",
    actionLabel: "Open Consultation",
    targetId: "CNS-402",
    roleVisibility: ["Doctor"],
  },
  {
    id: "NOT-DOC-04",
    title: "Prescription Completed",
    description:
      "Prescription RX-8819 successfully finalized for Patient Anita Roy.",
    timestamp: "1 hour ago",
    module: "Prescriptions Module",
    category: "Prescriptions",
    priority: "Normal",
    status: "Completed",
    targetModule: "Prescriptions",
    actionLabel: "Open Prescription",
    targetId: "RX-8819",
    roleVisibility: ["Doctor"],
  },
  {
    id: "NOT-DOC-05",
    title: "Follow-up Reminder",
    description: "Follow-up consultation scheduled for Patient Vikram Patel.",
    timestamp: "2 hours ago",
    module: "Patients Module",
    category: "Patients",
    priority: "Normal",
    status: "Unread",
    targetModule: "Patients",
    actionLabel: "Open Patient",
    targetId: "P-90811",
    roleVisibility: ["Doctor"],
  },
  {
    id: "NOT-DOC-06",
    title: "Doctor Schedule Updated",
    description:
      "Your evening OPD shift timing updated to 04:00 PM – 08:00 PM.",
    timestamp: "3 hours ago",
    module: "Schedule Module",
    category: "Schedule",
    priority: "Normal",
    status: "Read",
    targetModule: "Appointments",
    actionLabel: "Open Schedule",
    roleVisibility: ["Doctor"],
  },
  {
    id: "NOT-DOC-07",
    title: "Consultation Cancelled",
    description: "Patient Rahul Verma cancelled OPD slot for 05:30 PM.",
    timestamp: "4 hours ago",
    module: "Consultation Module",
    category: "Consultations",
    priority: "Normal",
    status: "Read",
    targetModule: "Consultation",
    roleVisibility: ["Doctor"],
  },

  // --- Receptionist Notifications ---
  {
    id: "NOT-REC-01",
    title: "New Patient Registered",
    description:
      "Walk-in patient Priya Sharma registered at Front Desk Desk-2.",
    timestamp: "5 minutes ago",
    module: "Registration Module",
    category: "Registration",
    priority: "Normal",
    status: "Unread",
    targetModule: "Patients",
    actionLabel: "Open Patient",
    targetId: "P-90840",
    roleVisibility: ["Receptionist"],
  },
  {
    id: "NOT-REC-02",
    title: "Appointment Booked",
    description: "OPD slot reserved for Patient Suresh Kumar with Dr. Mehta.",
    timestamp: "12 minutes ago",
    module: "Appointments Module",
    category: "Appointments",
    priority: "Normal",
    status: "Unread",
    targetModule: "Appointments",
    actionLabel: "Open Appointment",
    targetId: "APT-9901",
    roleVisibility: ["Receptionist"],
  },
  {
    id: "NOT-REC-03",
    title: "Patient Checked In",
    description: "Patient Kavita Shah arrived and checked in at Reception.",
    timestamp: "20 minutes ago",
    module: "Queue Module",
    category: "Queue",
    priority: "Normal",
    status: "Unread",
    targetModule: "Queue",
    actionLabel: "Open Queue",
    roleVisibility: ["Receptionist"],
  },
  {
    id: "NOT-REC-04",
    title: "Token Generated",
    description: "OPD Token #18 generated for Orthopedics consultation queue.",
    timestamp: "35 minutes ago",
    module: "Queue Module",
    category: "Queue",
    priority: "Normal",
    status: "Completed",
    targetModule: "Queue",
    actionLabel: "Open Queue",
    roleVisibility: ["Receptionist"],
  },
  {
    id: "NOT-REC-05",
    title: "Queue Updated",
    description: "Dr. Priya Sharma consultation room queue reshuffled.",
    timestamp: "50 minutes ago",
    module: "Queue Module",
    category: "Queue",
    priority: "Normal",
    status: "Read",
    targetModule: "Queue",
    actionLabel: "Open Queue",
    roleVisibility: ["Receptionist"],
  },
  {
    id: "NOT-REC-06",
    title: "Payment Pending",
    description:
      "Consultation fee ₹500 pending collection for Patient David Miller.",
    timestamp: "1 hour ago",
    module: "Billing Module",
    category: "Billing",
    priority: "High",
    status: "Unread",
    targetModule: "Invoice",
    actionLabel: "Open Invoice",
    targetId: "INV-1090",
    roleVisibility: ["Receptionist"],
  },
  {
    id: "NOT-REC-07",
    title: "Invoice Generated",
    description: "OPD Receipt INV-1088 generated for Patient Meena Gupta.",
    timestamp: "2 hours ago",
    module: "Billing Module",
    category: "Billing",
    priority: "Normal",
    status: "Read",
    targetModule: "Invoice",
    actionLabel: "Open Invoice",
    targetId: "INV-1088",
    roleVisibility: ["Receptionist"],
  },
  {
    id: "NOT-REC-08",
    title: "Appointment Cancelled",
    description: "Patient requested slot cancellation for Cardiology OPD.",
    timestamp: "3 hours ago",
    module: "Appointments Module",
    category: "Appointments",
    priority: "Normal",
    status: "Read",
    targetModule: "Appointments",
    actionLabel: "Open Appointment",
    roleVisibility: ["Receptionist"],
  },

  // --- Accountant Notifications ---
  {
    id: "NOT-ACC-01",
    title: "Invoice Generated",
    description: "New OPD Billing invoice INV-1095 created for ₹2,450.",
    timestamp: "8 minutes ago",
    module: "Invoices Module",
    category: "Invoices",
    priority: "Normal",
    status: "Unread",
    targetModule: "Billing",
    actionLabel: "Open Invoice",
    targetId: "INV-1095",
    roleVisibility: ["Accountant"],
  },
  {
    id: "NOT-ACC-02",
    title: "Payment Collected",
    description: "Payment of ₹1,800 received via UPI (Ref: TXN-99021).",
    timestamp: "18 minutes ago",
    module: "Payments Module",
    category: "Payments",
    priority: "Normal",
    status: "Completed",
    targetModule: "Billing",
    actionLabel: "Open Billing",
    roleVisibility: ["Accountant"],
  },
  {
    id: "NOT-ACC-03",
    title: "Outstanding Balance",
    description:
      "Invoice INV-1040 has overdue balance of ₹3,200 pending >48 hrs.",
    timestamp: "40 minutes ago",
    module: "Invoices Module",
    category: "Invoices",
    priority: "High",
    status: "Unread",
    targetModule: "Billing",
    actionLabel: "Open Invoice",
    targetId: "INV-1040",
    roleVisibility: ["Accountant"],
  },
  {
    id: "NOT-ACC-04",
    title: "Refund Requested",
    description:
      "Refund request #RF-804 submitted for cancelled lab procedure.",
    timestamp: "1 hour ago",
    module: "Payments Module",
    category: "Payments",
    priority: "High",
    status: "Unread",
    targetModule: "Billing",
    actionLabel: "Open Billing",
    roleVisibility: ["Accountant"],
  },
  {
    id: "NOT-ACC-05",
    title: "Receipt Printed",
    description:
      "Official tax invoice receipt printed for Patient Ramesh Shah.",
    timestamp: "2 hours ago",
    module: "Invoices Module",
    category: "Invoices",
    priority: "Normal",
    status: "Read",
    targetModule: "Billing",
    actionLabel: "Open Receipt",
    roleVisibility: ["Accountant"],
  },
  {
    id: "NOT-ACC-06",
    title: "Revenue Report Ready",
    description:
      "Daily cash register & digital collection reconciliation compiled.",
    timestamp: "3 hours ago",
    module: "Revenue Module",
    category: "Revenue",
    priority: "Normal",
    status: "Read",
    targetModule: "Reports",
    actionLabel: "Open Revenue Report",
    roleVisibility: ["Accountant"],
  },
  {
    id: "NOT-ACC-07",
    title: "Billing Correction",
    description: "Adjustment credit note applied to Invoice INV-1033.",
    timestamp: "4 hours ago",
    module: "Billing Module",
    category: "Billing",
    priority: "Normal",
    status: "Read",
    targetModule: "Billing",
    actionLabel: "Open Billing",
    roleVisibility: ["Accountant"],
  },

  // --- Nurse Notifications ---
  {
    id: "NOT-NRS-01",
    title: "Patient Assigned",
    description: "Patient Robert Chen assigned to OPD Triage Station 2.",
    timestamp: "10 minutes ago",
    module: "Patients Module",
    category: "Patients",
    priority: "Normal",
    status: "Unread",
    targetModule: "Patients",
    actionLabel: "Open Patient",
    targetId: "P-90810",
    roleVisibility: ["Nurse"],
  },
  {
    id: "NOT-NRS-02",
    title: "Patient Checked In",
    description: "Patient Anita Roy checked in for routine OPD vitals check.",
    timestamp: "20 minutes ago",
    module: "Appointments Module",
    category: "Appointments",
    priority: "Normal",
    status: "Unread",
    targetModule: "Appointments",
    actionLabel: "Open Appointment",
    roleVisibility: ["Nurse"],
  },
  {
    id: "NOT-NRS-03",
    title: "Vitals Due",
    description:
      "Pre-consultation Blood Pressure & Temperature check pending for Token #12.",
    timestamp: "30 minutes ago",
    module: "Vitals Module",
    category: "Vitals",
    priority: "High",
    status: "Unread",
    targetModule: "Vitals",
    actionLabel: "Open Vitals",
    roleVisibility: ["Nurse"],
  },
  {
    id: "NOT-NRS-04",
    title: "Medication Reminder",
    description:
      "Administer prescribed IV booster dose for OPD Day Care Patient #04.",
    timestamp: "45 minutes ago",
    module: "Clinical Alerts Module",
    category: "Clinical Alerts",
    priority: "Normal",
    status: "Unread",
    targetModule: "Vitals",
    actionLabel: "Open Clinical Record",
    roleVisibility: ["Nurse"],
  },
  {
    id: "NOT-NRS-05",
    title: "Clinical Alert",
    description:
      "Elevated BP reading (150/95) logged for Patient Vikram Patel.",
    timestamp: "1 hour ago",
    module: "Clinical Alerts Module",
    category: "Clinical Alerts",
    priority: "Critical",
    status: "Unread",
    targetModule: "Vitals",
    actionLabel: "Open Clinical Record",
    roleVisibility: ["Nurse"],
  },
  {
    id: "NOT-NRS-06",
    title: "Doctor Consultation Started",
    description: "Dr. Arjun Mehta started OPD consultation for Token #09.",
    timestamp: "2 hours ago",
    module: "Appointments Module",
    category: "Appointments",
    priority: "Normal",
    status: "Read",
    targetModule: "Appointments",
    roleVisibility: ["Nurse"],
  },
  {
    id: "NOT-NRS-07",
    title: "Doctor Consultation Completed",
    description: "Consultation concluded for Patient Sarah Mitchell.",
    timestamp: "3 hours ago",
    module: "Appointments Module",
    category: "Appointments",
    priority: "Normal",
    status: "Completed",
    targetModule: "Appointments",
    roleVisibility: ["Nurse"],
  },
  {
    id: "NOT-NRS-08",
    title: "Patient Transferred",
    description: "Patient transfer to Diagnostic Imaging Bay 1 confirmed.",
    timestamp: "4 hours ago",
    module: "Patients Module",
    category: "Patients",
    priority: "Normal",
    status: "Read",
    targetModule: "Patients",
    actionLabel: "Open Patient",
    roleVisibility: ["Nurse"],
  },

  // --- Patient Portal Notifications ---
  {
    id: "NOT-PAT-01",
    title: "Appointment Confirmed",
    description:
      "Your OPD appointment with Dr. Arjun Mehta is confirmed for 10:30 AM.",
    timestamp: "15 minutes ago",
    module: "Appointments Module",
    category: "Appointments",
    priority: "Normal",
    status: "Unread",
    targetModule: "Appointments",
    actionLabel: "Open Appointment",
    roleVisibility: ["Patient Portal"],
  },
  {
    id: "NOT-PAT-02",
    title: "Appointment Reminder",
    description:
      "Reminder: Please arrive 15 mins prior to your scheduled OPD slot.",
    timestamp: "1 hour ago",
    module: "Appointments Module",
    category: "Appointments",
    priority: "Normal",
    status: "Unread",
    targetModule: "Appointments",
    actionLabel: "Open Appointment",
    roleVisibility: ["Patient Portal"],
  },
  {
    id: "NOT-PAT-03",
    title: "Prescription Ready",
    description:
      "Digital prescription for your recent consultation is ready for download.",
    timestamp: "2 hours ago",
    module: "Prescriptions Module",
    category: "Prescriptions",
    priority: "Normal",
    status: "Unread",
    targetModule: "Consultation",
    actionLabel: "Open Prescription",
    roleVisibility: ["Patient Portal"],
  },
  {
    id: "NOT-PAT-04",
    title: "Invoice Generated",
    description: "OPD Consultation Invoice INV-1092 generated for ₹500.",
    timestamp: "3 hours ago",
    module: "Invoices Module",
    category: "Invoices",
    priority: "Normal",
    status: "Read",
    targetModule: "Billing",
    actionLabel: "Open Invoice",
    roleVisibility: ["Patient Portal"],
  },
  {
    id: "NOT-PAT-05",
    title: "Payment Successful",
    description: "Online payment of ₹500 successfully processed via UPI.",
    timestamp: "4 hours ago",
    module: "Invoices Module",
    category: "Invoices",
    priority: "Normal",
    status: "Completed",
    targetModule: "Billing",
    actionLabel: "Open Invoice",
    roleVisibility: ["Patient Portal"],
  },
  {
    id: "NOT-PAT-06",
    title: "Hospital Announcement",
    description: "New Cardiology Super-Specialty Clinic launching this Monday.",
    timestamp: "5 hours ago",
    module: "Announcements Module",
    category: "Announcements",
    priority: "Normal",
    status: "Read",
    targetModule: "Dashboard",
    actionLabel: "Open Announcement",
    roleVisibility: ["Patient Portal"],
  },
  {
    id: "NOT-PAT-07",
    title: "Doctor Message",
    description:
      "Dr. Priya Sharma left a follow-up note regarding your dietary regime.",
    timestamp: "6 hours ago",
    module: "Announcements Module",
    category: "Announcements",
    priority: "Normal",
    status: "Read",
    targetModule: "Consultation",
    actionLabel: "Open Message",
    roleVisibility: ["Patient Portal"],
  },
];

// Role Quick Filter Config Matrix
const ROLE_QUICK_FILTERS: Record<
  UserRole,
  { id: string; title: string; icon: React.ElementType }[]
> = {
  "Hospital Admin": [
    { id: "All", title: "All", icon: Bell },
    { id: "Unread", title: "Unread", icon: Info },
    { id: "Patients", title: "Patients", icon: Users },
    { id: "Doctors", title: "Doctors", icon: UserCheck },
    { id: "Appointments", title: "Appointments", icon: Calendar },
    { id: "Billing", title: "Billing", icon: CreditCard },
    { id: "Reports", title: "Reports", icon: FileText },
    { id: "Audit", title: "Audit", icon: Shield },
    { id: "System", title: "System", icon: Settings },
    { id: "Security", title: "Security", icon: AlertTriangle },
  ],
  Doctor: [
    { id: "All", title: "All", icon: Bell },
    { id: "Unread", title: "Unread", icon: Info },
    { id: "Appointments", title: "Appointments", icon: Calendar },
    { id: "Patients", title: "Patients", icon: Users },
    { id: "Consultations", title: "Consultations", icon: MessageSquare },
    { id: "Prescriptions", title: "Prescriptions", icon: Pill },
    { id: "Schedule", title: "Schedule", icon: Clock },
  ],
  Receptionist: [
    { id: "All", title: "All", icon: Bell },
    { id: "Unread", title: "Unread", icon: Info },
    { id: "Appointments", title: "Appointments", icon: Calendar },
    { id: "Patients", title: "Patients", icon: Users },
    { id: "Registration", title: "Registration", icon: UserCheck },
    { id: "Queue", title: "Queue", icon: Clock },
    { id: "Billing", title: "Billing", icon: CreditCard },
  ],
  Accountant: [
    { id: "All", title: "All", icon: Bell },
    { id: "Unread", title: "Unread", icon: Info },
    { id: "Billing", title: "Billing", icon: CreditCard },
    { id: "Payments", title: "Payments", icon: DollarSign },
    { id: "Revenue", title: "Revenue", icon: FileText },
    { id: "Invoices", title: "Invoices", icon: Receipt },
    { id: "Reports", title: "Reports", icon: FileText },
  ],
  Nurse: [
    { id: "All", title: "All", icon: Bell },
    { id: "Unread", title: "Unread", icon: Info },
    { id: "Appointments", title: "Appointments", icon: Calendar },
    { id: "Patients", title: "Patients", icon: Users },
    { id: "Vitals", title: "Vitals", icon: Activity },
    { id: "Clinical Alerts", title: "Clinical Alerts", icon: AlertTriangle },
  ],
  "Patient Portal": [
    { id: "All", title: "All", icon: Bell },
    { id: "Unread", title: "Unread", icon: Info },
    { id: "Appointments", title: "Appointments", icon: Calendar },
    { id: "Prescriptions", title: "Prescriptions", icon: Pill },
    { id: "Invoices", title: "Invoices", icon: Receipt },
    { id: "Announcements", title: "Announcements", icon: Megaphone },
  ],
};

export function NotificationCenterManagement({
  currentRole = "Hospital Admin",
  onNavigateToModule,
}: NotificationCenterManagementProps) {
  // State
  const [notifications, setNotifications] = useState<NotificationRecord[]>(
    INITIAL_NOTIFICATIONS,
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    appointmentNotifs: true,
    patientNotifs: true,
    billingNotifs: true,
    reportsNotifs: true,
    securityAlerts: true,
    emailNotifs: true,
    pushNotifs: true,
    soundAlerts: false,
  });

  // Role-filtered notifications
  const roleNotifications = useMemo(() => {
    return notifications.filter((n) => n.roleVisibility.includes(currentRole));
  }, [notifications, currentRole]);

  // Active Quick Filters list based on Role
  const activeQuickFilters = useMemo(() => {
    return (
      ROLE_QUICK_FILTERS[currentRole] || ROLE_QUICK_FILTERS["Hospital Admin"]
    );
  }, [currentRole]);

  // Category quick filter count calculator (strictly scoped to current role)
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

  // Main Filtered List
  const filteredNotifications = useMemo(() => {
    return roleNotifications.filter((n) => {
      // Category filter
      if (selectedCategory === "Unread" && n.status !== "Unread") return false;
      if (
        selectedCategory !== "All" &&
        selectedCategory !== "Unread" &&
        n.category !== selectedCategory
      )
        return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = n.title.toLowerCase().includes(query);
        const matchDesc = n.description.toLowerCase().includes(query);
        const matchModule = n.module.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchModule) return false;
      }

      // Priority Filter
      if (priorityFilter !== "All" && n.priority !== priorityFilter)
        return false;

      // Status Filter
      if (statusFilter !== "All" && n.status !== statusFilter) return false;

      // Department Filter
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

  // Top KPI Metrics
  const kpiMetrics = useMemo(() => {
    const unread = roleNotifications.filter(
      (n) => n.status === "Unread",
    ).length;
    const today = roleNotifications.filter(
      (n) => n.timestamp.includes("minute") || n.timestamp.includes("hour"),
    ).length;
    const critical = roleNotifications.filter(
      (n) => n.priority === "Critical" || n.priority === "High",
    ).length;
    const completed = roleNotifications.filter(
      (n) => n.status === "Completed",
    ).length;

    return { unread, today, critical, completed };
  }, [roleNotifications]);

  // Actions
  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.roleVisibility.includes(currentRole) && n.status === "Unread") {
          return { ...n, status: "Read" };
        }
        return n;
      }),
    );
  };

  const handleToggleReadStatus = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const nextStatus: NotificationStatus =
            n.status === "Unread" ? "Read" : "Unread";
          return { ...n, status: nextStatus };
        }
        return n;
      }),
    );
  };

  const handleOpenAction = (n: NotificationRecord) => {
    if (n.status === "Unread") {
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === n.id ? { ...item, status: "Read" } : item,
        ),
      );
    }
    if (onNavigateToModule) {
      onNavigateToModule(n.targetModule, n.targetId);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setPriorityFilter("All");
    setStatusFilter("All");
    setDepartmentFilter("All");
  };

  // Helper renderers for category icons
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Appointments":
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case "Patients":
        return <Users className="w-5 h-5 text-emerald-600" />;
      case "Doctors":
        return <UserCheck className="w-5 h-5 text-purple-600" />;
      case "Consultations":
        return <MessageSquare className="w-5 h-5 text-indigo-600" />;
      case "Prescriptions":
        return <Pill className="w-5 h-5 text-[#009688]" />;
      case "Billing":
      case "Invoices":
        return <CreditCard className="w-5 h-5 text-amber-600" />;
      case "Payments":
      case "Revenue":
        return <DollarSign className="w-5 h-5 text-emerald-600" />;
      case "Vitals":
        return <Activity className="w-5 h-5 text-rose-600" />;
      case "Clinical Alerts":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "Reports":
        return <FileText className="w-5 h-5 text-teal-600" />;
      case "Security":
      case "Audit":
        return <Shield className="w-5 h-5 text-red-600" />;
      case "System":
        return <Settings className="w-5 h-5 text-slate-600" />;
      case "Registration":
        return <UserCheck className="w-5 h-5 text-blue-600" />;
      case "Queue":
        return <Clock className="w-5 h-5 text-amber-600" />;
      case "Announcements":
        return <Megaphone className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div
      style={{ fontFamily: RB }}
      className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9] text-[#111827]"
    >
      {/* PAGE HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
            <span>Hospital</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-medium text-[#0D47A1]">
              Notification Center
            </span>
          </div>
          {/* Page Title */}
          <div className="flex items-center gap-3">
            <h1
              style={{ fontFamily: PP }}
              className="text-2xl font-bold tracking-tight text-[#111827]"
            >
              Notification Center
            </h1>
            <span className="rounded-full bg-[#0D47A1]/10 px-3 py-1 text-xs font-semibold text-[#0D47A1]">
              Role: {currentRole}
            </span>
          </div>
          <p className="text-sm text-[#64748B] mt-0.5">
            View and manage all application notifications, alerts, reminders,
            and workflow updates relevant to your role.
          </p>
        </div>

        {/* Top Right Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#111827] shadow-sm hover:bg-slate-50 transition"
          >
            <CheckCircle2 className="w-4 h-4 text-[#66BB6A]" />
            Mark All as Read
          </button>

          <button
            onClick={() => setNotifications([...INITIAL_NOTIFICATIONS])}
            className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#111827] shadow-sm hover:bg-slate-50 transition"
          >
            <RefreshCw className="w-4 h-4 text-[#0D47A1]" />
            Refresh
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#111827] shadow-sm hover:bg-slate-50 transition"
          >
            <Settings className="w-4 h-4 text-[#64748B]" />
            Notification Settings
          </button>

          {(currentRole === "Hospital Admin" ||
            currentRole === "Accountant") && (
            <button
              onClick={() => alert("Exporting Notification Log...")}
              className="flex items-center gap-1.5 rounded-lg bg-[#0D47A1] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0b3882] transition"
            >
              <Download className="w-4 h-4" />
              Export Notification Log
            </button>
          )}
        </div>
      </div>

      {/* TOP KPI CARDS (4 CARDS) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Unread Notifications */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">
              Unread Notifications
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#0D47A1]">
              <Bell className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span
              style={{ fontFamily: PP }}
              className="text-2xl font-bold text-[#111827]"
            >
              {kpiMetrics.unread}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
              Active Alerts
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full bg-[#0D47A1]"
              style={{ width: `${Math.min(100, kpiMetrics.unread * 15)}%` }}
            />
          </div>
        </div>

        {/* Today's Notifications */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">
              Today's Notifications
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#009688]">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span
              style={{ fontFamily: PP }}
              className="text-2xl font-bold text-[#111827]"
            >
              {kpiMetrics.today}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
              Generated Today
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full bg-[#009688]"
              style={{ width: `${Math.min(100, kpiMetrics.today * 14)}%` }}
            />
          </div>
        </div>

        {/* Priority Alerts */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">
              Priority Alerts
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-[#EF4444]">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span
              style={{ fontFamily: PP }}
              className="text-2xl font-bold text-[#111827]"
            >
              {kpiMetrics.critical}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
              Action Required
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full bg-[#EF4444]"
              style={{ width: `${Math.min(100, kpiMetrics.critical * 33)}%` }}
            />
          </div>
        </div>

        {/* Resolved Actions */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">
              Resolved Actions
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span
              style={{ fontFamily: PP }}
              className="text-2xl font-bold text-[#111827]"
            >
              {kpiMetrics.completed}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-600">
              Completed
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full bg-purple-600"
              style={{ width: `${Math.min(100, kpiMetrics.completed * 25)}%` }}
            />
          </div>
        </div>
      </div>

      {/* DYNAMIC ROLE-BASED QUICK FILTERS */}
      <div>
        <div className="flex items-center overflow-x-auto gap-3 pb-2 scrollbar-none">
          {activeQuickFilters.map((item) => {
            const IconComp = item.icon;
            const count = quickFilterCounts[item.id] || 0;
            const isActive = selectedCategory === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setSelectedCategory(item.id)}
                className={`flex shrink-0 items-center gap-2.5 rounded-xl border px-3.5 py-2.5 transition text-xs font-semibold shadow-sm ${
                  isActive
                    ? "border-[#0D47A1] bg-[#0D47A1] text-white"
                    : "border-[#E5E7EB] bg-white text-[#111827] hover:bg-slate-50"
                }`}
              >
                <IconComp
                  className={`w-4 h-4 ${isActive ? "text-white" : "text-[#0D47A1]"}`}
                />
                <span>{item.title}</span>
                <span
                  className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-[#64748B]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notifications by title, content, or module..."
              className="w-full rounded-xl border border-[#E5E7EB] pl-10 pr-4 py-2 text-xs focus:border-[#0D47A1] focus:outline-none focus:ring-1 focus:ring-[#0D47A1]"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Priority */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[#64748B]">Priority:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1]"
              >
                <option value="All">All Priorities</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            {/* Status */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[#64748B]">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1]"
              >
                <option value="All">All Statuses</option>
                <option value="Unread">Unread</option>
                <option value="Read">Read</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Reset */}
            <button
              onClick={handleResetFilters}
              className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-[#64748B] hover:bg-slate-50 transition"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div>
        {/* NOTIFICATION LIST */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            /* EMPTY STATE */
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white p-12 text-center shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-[#0D47A1] mb-4">
                <Bell className="w-8 h-8" />
              </div>
              <h3
                style={{ fontFamily: PP }}
                className="text-lg font-bold text-[#111827]"
              >
                No notifications available
              </h3>
              <p className="mt-1 text-xs text-[#64748B] max-w-sm">
                Everything is up to date! There are no matching alerts found for
                your role ({currentRole}).
              </p>
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const isUnread = item.status === "Unread";
              const isCritical =
                item.priority === "Critical" || item.priority === "High";

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md ${
                    isUnread
                      ? "border-[#0D47A1]/30 bg-blue-50/20"
                      : "border-[#E5E7EB]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Category Icon & Details */}
                    <div className="flex items-start gap-3.5">
                      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4
                            style={{ fontFamily: PP }}
                            className="text-sm font-semibold text-[#111827]"
                          >
                            {item.title}
                          </h4>
                          {/* Priority Badge */}
                          {isCritical && (
                            <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                              {item.priority}
                            </span>
                          )}
                          {/* Read/Unread Status */}
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              isUnread
                                ? "bg-blue-100 text-[#0D47A1]"
                                : item.status === "Completed"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-slate-100 text-[#64748B]"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-[#64748B] leading-relaxed">
                          {item.description}
                        </p>

                        <div className="mt-2.5 flex items-center gap-3 text-[11px] text-[#64748B]">
                          <span className="font-semibold text-[#009688]">
                            {item.module}
                          </span>
                          <span>•</span>
                          <span>{item.timestamp}</span>
                        </div>
                      </div>
                    </div>

                    {/* Role-Specific Action Button */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => handleOpenAction(item)}
                        className="flex items-center gap-1 text-xs font-bold text-[#0D47A1] hover:underline"
                      >
                        {item.actionLabel || `Open ${item.targetModule}`} →
                      </button>
                      <button
                        onClick={() => handleToggleReadStatus(item.id)}
                        className="text-[11px] text-[#64748B] hover:text-[#111827]"
                      >
                        {isUnread ? "Mark as Read" : "Mark Unread"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* BOTTOM PAGINATION */}
          <div className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm mt-4">
            <span className="text-xs text-[#64748B]">
              Showing{" "}
              <span className="font-semibold text-[#111827]">
                1–{filteredNotifications.length}
              </span>{" "}
              of {filteredNotifications.length} notifications
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#111827] shadow-sm disabled:opacity-50 hover:bg-slate-50 transition"
              >
                Previous
              </button>
              <button
                disabled={true}
                className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#111827] shadow-sm disabled:opacity-50 hover:bg-slate-50 transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* NOTIFICATION SETTINGS DRAWER */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white p-6 shadow-2xl flex flex-col justify-between h-full animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4 mb-5">
                <div>
                  <h3
                    style={{ fontFamily: PP }}
                    className="text-lg font-bold text-[#111827]"
                  >
                    Notification Settings
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Configure channel preferences and module alert triggers for{" "}
                    {currentRole}.
                  </p>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="rounded-lg p-1 text-[#64748B] hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Toggles */}
              <div className="space-y-4 text-xs">
                <h4
                  style={{ fontFamily: PP }}
                  className="font-semibold text-[#0D47A1] uppercase tracking-wider text-[11px]"
                >
                  Module Alerts
                </h4>

                <div className="flex items-center justify-between">
                  <span>Appointment Notifications</span>
                  <input
                    type="checkbox"
                    checked={settings.appointmentNotifs}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        appointmentNotifs: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-[#0D47A1] focus:ring-[#0D47A1]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span>Patient Registration & Records</span>
                  <input
                    type="checkbox"
                    checked={settings.patientNotifs}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        patientNotifs: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-[#0D47A1] focus:ring-[#0D47A1]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span>Billing & Payments Alerts</span>
                  <input
                    type="checkbox"
                    checked={settings.billingNotifs}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        billingNotifs: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-[#0D47A1] focus:ring-[#0D47A1]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span>Reports & Analytics</span>
                  <input
                    type="checkbox"
                    checked={settings.reportsNotifs}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        reportsNotifs: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-[#0D47A1] focus:ring-[#0D47A1]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span>Security & Audit Alerts</span>
                  <input
                    type="checkbox"
                    checked={settings.securityAlerts}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        securityAlerts: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-[#0D47A1] focus:ring-[#0D47A1]"
                  />
                </div>

                <hr className="border-[#E5E7EB]" />

                <h4
                  style={{ fontFamily: PP }}
                  className="font-semibold text-[#0D47A1] uppercase tracking-wider text-[11px]"
                >
                  Channels & Audio
                </h4>

                <div className="flex items-center justify-between">
                  <span>Email Notifications</span>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifs}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        emailNotifs: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-[#0D47A1] focus:ring-[#0D47A1]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span>Push Notifications</span>
                  <input
                    type="checkbox"
                    checked={settings.pushNotifs}
                    onChange={(e) =>
                      setSettings({ ...settings, pushNotifs: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-[#0D47A1] focus:ring-[#0D47A1]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span>Sound Alerts</span>
                  <input
                    type="checkbox"
                    checked={settings.soundAlerts}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        soundAlerts: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-[#0D47A1] focus:ring-[#0D47A1]"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-[#E5E7EB] pt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="rounded-lg border border-[#E5E7EB] px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="rounded-lg bg-[#0D47A1] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0b3882] transition"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
