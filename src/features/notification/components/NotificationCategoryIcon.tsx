import {
  Calendar,
  Users,
  UserCheck,
  MessageSquare,
  Pill,
  CreditCard,
  DollarSign,
  Activity,
  AlertTriangle,
  FileText,
  Shield,
  Settings,
  Clock,
  Megaphone,
  Bell,
} from "lucide-react";

export function NotificationCategoryIcon({ category }: { category: string }) {
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
}
