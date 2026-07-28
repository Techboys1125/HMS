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
import { Avatar, Av, Chip } from "./Avatar";
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

export function StatusBadge({ status }: { status: string }) {
  const c =
    status === "Active"
      ? { bg: "bg-green-50", text: "text-green-700", dot: "bg-[#66BB6A]" }
      : status === "Admitted"
        ? { bg: "bg-blue-50", text: "text-[#0D47A1]", dot: "bg-[#0D47A1]" }
        : status === "Inactive"
          ? { bg: "bg-slate-100", text: "text-[#64748B]", dot: "bg-[#64748B]" }
          : { bg: "bg-amber-50", text: "text-[#F59E0B]", dot: "bg-[#F59E0B]" }; // Discharged
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}

export function TimelineStatusBadge({ status }: { status: string }) {
  const isCompleted = status === "Completed";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isCompleted ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isCompleted ? "bg-green-500" : "bg-amber-500"}`}
      />
      {status}
    </span>
  );
}