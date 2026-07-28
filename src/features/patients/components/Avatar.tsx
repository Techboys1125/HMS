import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  Edit,
  Receipt,
  X,
  Phone,
  UserCheck,
  ChevronDown,
  Activity,
  Calendar,
  Stethoscope,
  Pill,
  AlertTriangle,
  FileText,
  Clock,
  Mail,
  MapPin,
  Droplets,
  Users,
  UserPlus,
  UserX,
  User,
  Printer,
  CheckCircle2,
  XCircle,
  Building2,
  CreditCard,
  Lock,
  Key,
  ShieldCheck,
  Save,
  TrendingUp,
  Star,
  Info,
  Check,
  AlertCircle,
} from "lucide-react";
import { useCreatePatient } from "../hooks/useCreatePatient";
import {
  usePatientSearch,
  usePatients,

} from "../hooks/usePatients";
import type { CreatePatientRequest } from "../types/patient.types";
import type { ScreenPatient as Patient, VisitRecord, PatientAppointment, BookingDoctor, PatientCancelAppointmentDialogProps, PatientRescheduleAppointmentDialogProps, MedicalVisitRecord, PrescriptionRecord, PatientInvoice, PaymentHistoryRecord, ScreenPatientSearchResult as PatientSearchResult, ChipVariant, ReceptionPatientProfileScreenProps, PatientPrescriptionItem } from "../types/patient.types";
import { PP, RB, MOCK_VISIT_HISTORY, TIMELINE_EVENTS, INITIAL_PATIENT_APPOINTMENTS, MOCK_BOOKING_DOCTORS, MOCK_VISIT_RECORDS, MOCK_PRESCRIPTION_RECORDS, INITIAL_INVOICES, PAYMENT_HISTORY_RECORDS } from "../constants/patient.mock";
import { StatusBadge, TimelineStatusBadge } from "./StatusBadges";
import { EditPatientInformationDrawer, ProfileBookApptDrawer, ProfileApptDetailsDrawer, ProfileInvoiceDrawer, ProfileDocDrawer, ProfileVisitDetailsDrawer, PatientQuickDetailsDrawer } from "./PatientDrawers";
import { PatientCancelAppointmentDialog, PatientRescheduleAppointmentDialog } from "./PatientDialogs";
import { PatientListScreen } from "../pages/PatientListScreen";
import { RegisterPatientScreen } from "../pages/RegisterPatientScreen";
import { EditPatientScreen } from "../pages/EditPatientScreen";
import { PatientProfileScreen } from "../pages/PatientProfileScreen";
import { MedicalHistoryScreen } from "../pages/MedicalHistoryScreen";
import { PatientVisitHistoryScreen } from "../pages/PatientVisitHistoryScreen";
import { PatientTimelineScreen } from "../pages/PatientTimelineScreen";
import { PatientBookAppointmentScreen } from "../pages/PatientBookAppointmentScreen";
import { PatientAppointmentsScreen } from "../pages/PatientAppointmentsScreen";
import { PatientMedicalRecordsScreen } from "../pages/PatientMedicalRecordsScreen";
import { PatientBillingScreen } from "../pages/PatientBillingScreen";
import { PatientProfileCenterScreen } from "../pages/PatientProfileCenterScreen";
import { ReceptionPatientRegistrationScreen } from "../pages/ReceptionPatientRegistrationScreen";
import { PatientSearchScreen } from "../pages/PatientSearchScreen";
import { ReceptionPatientProfileScreen } from "../pages/ReceptionPatientProfileScreen";
import { PatientPrescriptionsScreen } from "../pages/PatientPrescriptionsScreen";
import { PatientPrescriptionDetailsScreen } from "../pages/PatientPrescriptionDetailsScreen";

export function Avatar({
  name,
  size = "sm",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const colors = [
    "bg-[#0D47A1]",
    "bg-[#009688]",
    "bg-violet-600",
    "bg-rose-500",
    "bg-amber-600",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  const sizes = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base",
  };
  return (
    <div
      className={`${sizes[size]} ${color} rounded-full flex items-center justify-center text-white font-semibold shrink-0`}
    >
      {initials}
    </div>
  );
}

export function Av({
  name,
  size = "sm",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const palette = [
    "bg-[#0D47A1]",
    "bg-[#009688]",
    "bg-violet-600",
    "bg-rose-500",
    "bg-amber-600",
  ];
  const bg = palette[name.charCodeAt(0) % palette.length];
  const sz = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base",
  }[size];
  return (
    <div
      className={`${sz} ${bg} rounded-full flex items-center justify-center text-white font-semibold shrink-0`}
      style={{ fontFamily: PP }}
    >
      {initials}
    </div>
  );
}

export function Chip({
  label,
  variant = "default",
}: {
  label: string;
  variant?: ChipVariant;
}) {
  const map: Record<ChipVariant, string> = {
    success: "bg-green-50 text-[#66BB6A]",
    warning: "bg-amber-50 text-[#F59E0B]",
    error: "bg-red-50 text-[#EF4444]",
    info: "bg-blue-50 text-[#0D47A1]",
    teal: "bg-teal-50 text-[#009688]",
    default: "bg-slate-50 text-[#64748B]",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[variant]}`}
      style={{ fontFamily: RB }}
    >
      {label}
    </span>
  );
}