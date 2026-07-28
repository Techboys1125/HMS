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
import { StatusBadge, TimelineStatusBadge } from "./StatusBadges";
import { EditPatientInformationDrawer, ProfileBookApptDrawer, ProfileApptDetailsDrawer, ProfileInvoiceDrawer, ProfileDocDrawer, ProfileVisitDetailsDrawer, PatientQuickDetailsDrawer } from "./PatientDrawers";
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

export function PatientCancelAppointmentDialog({
  appointment,
  isOpen,
  onClose,
  onConfirmCancel,
  onBookNewAppointment,
}: PatientCancelAppointmentDialogProps) {
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  if (!isOpen || !appointment) return null;

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      setValidationError("Please select a cancellation reason.");
      return;
    }
    setValidationError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessDialog(true);
      onConfirmCancel(appointment.id, reason, comments);
    }, 300);
  };

  const handleCloseAll = () => {
    setReason("");
    setComments("");
    setValidationError(null);
    setShowSuccessDialog(false);
    onClose();
  };

  // Success Dialog View
  if (showSuccessDialog) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 max-sm:items-end">
        <div
          className="w-full max-w-md bg-white rounded-2xl max-sm:rounded-b-none max-sm:rounded-t-2xl shadow-2xl overflow-hidden border border-gray-100 p-6 space-y-5 text-center animate-in zoom-in-95 duration-200"
          style={{ fontFamily: RB }}
        >
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#66BB6A] flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
            <CheckCircle2 size={32} />
          </div>

          <div>
            <h3
              className="text-base font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Appointment Cancelled Successfully
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              Your appointment{" "}
              <span className="font-mono font-bold text-[#0D47A1]">
                {appointment.id}
              </span>{" "}
              has been cancelled.
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-left space-y-1">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Doctor:</span>
              <span className="font-semibold text-[#111827]">
                {appointment.doctor}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Date & Time:</span>
              <span className="font-semibold text-[#111827]">
                {appointment.date} @ {appointment.time}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Reason:</span>
              <span className="font-medium text-red-600">{reason}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
            {onBookNewAppointment && (
              <button
                type="button"
                onClick={() => {
                  handleCloseAll();
                  onBookNewAppointment();
                }}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm"
                style={{ fontFamily: PP }}
              >
                Book New Appointment
              </button>
            )}
            <button
              type="button"
              onClick={handleCloseAll}
              className="w-full sm:flex-1 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition-colors"
            >
              Back to My Appointments
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Confirmation Modal View
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 max-sm:items-end">
      <div
        className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl max-sm:rounded-b-none max-sm:rounded-t-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col animate-in zoom-in-95 duration-200"
        style={{ fontFamily: RB }}
      >
        {/* Header - Solid Danger Banner Theme matching Reschedule Appointment header style */}
        <div className="p-5 bg-[#EF4444] flex items-start gap-3.5 text-white shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/30 text-white flex items-center justify-center shrink-0 shadow-inner">
            <AlertTriangle size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h2
              className="text-base font-bold text-white"
              style={{ fontFamily: PP }}
            >
              Cancel Appointment
            </h2>
            <p className="text-xs text-red-50 mt-0.5">
              Are you sure you want to cancel this appointment?
            </p>
          </div>
          <button
            type="button"
            onClick={handleCloseAll}
            className="p-1.5 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleCancelSubmit}
          className="p-5 space-y-4 overflow-y-auto max-h-[80vh] bg-slate-50/50"
        >
          {/* Appointment Summary Card */}
          <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#0D47A1]">
                {appointment.id}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                  appointment.status === "Confirmed"
                    ? "bg-green-50 text-[#66BB6A]"
                    : "bg-blue-50 text-[#0D47A1]"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />{" "}
                {appointment.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div>
                <span className="text-[#64748B] text-[10px] block">
                  Doctor Name
                </span>
                <span className="font-bold text-[#111827]">
                  {appointment.doctor}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] text-[10px] block">
                  Department
                </span>
                <span className="font-semibold text-slate-700">
                  {appointment.department}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] text-[10px] block">
                  Appointment Date
                </span>
                <span className="font-semibold text-[#111827]">
                  {appointment.date}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] text-[10px] block">
                  Appointment Time
                </span>
                <span className="font-semibold text-[#0D47A1]">
                  {appointment.time}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] text-[10px] block">
                  Visit Type
                </span>
                <span className="font-medium text-slate-600">
                  {appointment.visitType}
                </span>
              </div>
            </div>
          </div>

          {/* Cancellation Reason Select */}
          <div>
            <label
              className="block text-xs font-bold text-[#111827] mb-1"
              style={{ fontFamily: PP }}
            >
              Cancellation Reason *
            </label>
            <select
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (e.target.value) setValidationError(null);
              }}
              className={`w-full px-3 py-2 text-xs bg-white border rounded-xl outline-none focus:border-[#0D47A1] transition-colors ${
                validationError
                  ? "border-red-500 bg-red-50/20"
                  : "border-[#E5E7EB]"
              }`}
            >
              <option value="">Select Cancellation Reason</option>
              <option value="Personal Reason">Personal Reason</option>
              <option value="Feeling Better">Feeling Better</option>
              <option value="Schedule Conflict">Schedule Conflict</option>
              <option value="Booked by Mistake">Booked by Mistake</option>
              <option value="Doctor Change Request">
                Doctor Change Request
              </option>
              <option value="Other">Other</option>
            </select>
            {validationError && (
              <p className="text-[11px] text-[#EF4444] font-semibold mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {validationError}
              </p>
            )}
          </div>

          {/* Optional Comments */}
          <div>
            <label
              className="block text-xs font-bold text-[#111827] mb-1"
              style={{ fontFamily: PP }}
            >
              Additional Comments (Optional)
            </label>
            <textarea
              rows={2}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add additional comments (optional)"
              className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0D47A1] transition-colors text-[#111827]"
            />
          </div>

          {/* Information Alert Card */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
            <div
              className="flex items-center gap-1.5 font-bold text-amber-800"
              style={{ fontFamily: PP }}
            >
              <Info size={14} className="text-amber-600" /> Information
              Guidelines
            </div>
            <ul className="space-y-0.5 text-[11px] text-amber-800/90 pl-1">
              <li>• Cancelled appointments cannot be restored.</li>
              <li>• You can book another appointment anytime.</li>
              <li>• Hospital cancellation policy may apply.</li>
            </ul>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={handleCloseAll}
              className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition-colors"
            >
              Keep Appointment
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#EF4444] text-white text-xs font-bold hover:bg-red-600 transition-colors shadow-sm flex items-center gap-1.5"
              style={{ fontFamily: PP }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={13} className="animate-spin" /> Cancelling...
                </>
              ) : (
                <>
                  <XCircle size={14} /> Cancel Appointment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function PatientRescheduleAppointmentDialog({
  appointment,
  isOpen,
  onClose,
  onConfirmReschedule,
  onViewDetails,
}: PatientRescheduleAppointmentDialogProps) {
  const [selectedDate, setSelectedDate] = useState("2025-03-30");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("10:30 AM");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  if (!isOpen || !appointment) return null;

  // Mock available dates for March 2025
  const calendarDays = [
    {
      day: 23,
      isCurrentMonth: true,
      isAvailable: false,
      isToday: false,
      isCurrentAppt: false,
    },
    {
      day: 24,
      isCurrentMonth: true,
      isAvailable: true,
      isToday: false,
      isCurrentAppt: false,
      fullDate: "2025-03-24",
    },
    {
      day: 25,
      isCurrentMonth: true,
      isAvailable: true,
      isToday: false,
      isCurrentAppt: false,
      fullDate: "2025-03-25",
    },
    {
      day: 26,
      isCurrentMonth: true,
      isAvailable: true,
      isToday: false,
      isCurrentAppt: false,
      fullDate: "2025-03-26",
    },
    {
      day: 27,
      isCurrentMonth: true,
      isAvailable: true,
      isToday: true,
      isCurrentAppt: true,
      fullDate: "2025-03-27",
    },
    {
      day: 28,
      isCurrentMonth: true,
      isAvailable: true,
      isToday: false,
      isCurrentAppt: false,
      fullDate: "2025-03-28",
    },
    {
      day: 29,
      isCurrentMonth: true,
      isAvailable: false,
      isToday: false,
      isCurrentAppt: false,
      fullDate: "2025-03-29",
    },
    {
      day: 30,
      isCurrentMonth: true,
      isAvailable: true,
      isToday: false,
      isCurrentAppt: false,
      fullDate: "2025-03-30",
    },
    {
      day: 31,
      isCurrentMonth: true,
      isAvailable: true,
      isToday: false,
      isCurrentAppt: false,
      fullDate: "2025-03-31",
    },
    {
      day: 1,
      isCurrentMonth: false,
      isAvailable: true,
      isToday: false,
      isCurrentAppt: false,
      fullDate: "2025-04-01",
    },
    {
      day: 2,
      isCurrentMonth: false,
      isAvailable: true,
      isToday: false,
      isCurrentAppt: false,
      fullDate: "2025-04-02",
    },
  ];

  const timeSlots = {
    morning: [
      { time: "09:00 AM", status: "available" },
      { time: "09:30 AM", status: "booked" },
      { time: "10:00 AM", status: "available" },
      { time: "10:30 AM", status: "available", isRecommended: true },
      { time: "11:00 AM", status: "booked" },
      { time: "11:30 AM", status: "available" },
    ],
    afternoon: [
      { time: "02:00 PM", status: "available" },
      { time: "02:30 PM", status: "available" },
      { time: "03:00 PM", status: "booked" },
      { time: "03:30 PM", status: "available" },
    ],
    evening: [
      { time: "04:30 PM", status: "available" },
      { time: "05:00 PM", status: "available" },
      { time: "05:30 PM", status: "booked" },
    ],
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      setValidationError("Please select a new appointment date.");
      return;
    }
    if (!selectedTimeSlot) {
      setValidationError("Please select a new time slot.");
      return;
    }
    if (!rescheduleReason) {
      setValidationError("Please select a reason for rescheduling.");
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessDialog(true);
      onConfirmReschedule(
        appointment.id,
        selectedDate,
        selectedTimeSlot,
        rescheduleReason,
        additionalNotes,
      );
    }, 400);
  };

  const handleCloseAll = () => {
    setRescheduleReason("");
    setAdditionalNotes("");
    setValidationError(null);
    setShowSuccessDialog(false);
    onClose();
  };

  // Success State View
  if (showSuccessDialog) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 max-sm:items-end">
        <div
          className="w-full max-w-md bg-white rounded-2xl max-sm:rounded-b-none max-sm:rounded-t-2xl shadow-2xl overflow-hidden border border-gray-100 p-6 space-y-5 text-center animate-in zoom-in-95 duration-200"
          style={{ fontFamily: RB }}
        >
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#66BB6A] flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
            <CheckCircle2 size={32} />
          </div>

          <div>
            <h3
              className="text-base font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Appointment Rescheduled Successfully
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              Your appointment{" "}
              <span className="font-mono font-bold text-[#0D47A1]">
                {appointment.id}
              </span>{" "}
              has been updated successfully.
            </p>
          </div>

          {/* New Details Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-left space-y-2">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-[#64748B]">Doctor & Dept:</span>
              <span className="font-bold text-[#111827]">
                {appointment.doctor} ({appointment.department})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">New Date:</span>
              <span className="font-bold text-[#0D47A1]">{selectedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">New Time:</span>
              <span className="font-bold text-[#009688]">
                {selectedTimeSlot}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Reason:</span>
              <span className="font-medium text-slate-700">
                {rescheduleReason}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                const updatedAppt = {
                  ...appointment,
                  date: selectedDate,
                  time: selectedTimeSlot,
                };
                handleCloseAll();
                if (onViewDetails) onViewDetails(updatedAppt);
              }}
              className="w-full sm:flex-1 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm"
              style={{ fontFamily: PP }}
            >
              View Appointment Details
            </button>
            <button
              type="button"
              onClick={handleCloseAll}
              className="w-full sm:flex-1 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition-colors"
            >
              Back to My Appointments
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dialog Form View
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 max-sm:items-end">
      <div
        className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl max-sm:rounded-b-none max-sm:rounded-t-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col animate-in zoom-in-95 duration-200"
        style={{ fontFamily: RB }}
      >
        {/* Header - Teal Theme matching Image 2 */}
        <div className="p-5 bg-[#009688] flex items-start gap-3.5 text-white shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/30 text-white flex items-center justify-center shrink-0 shadow-inner">
            <Calendar size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h2
              className="text-base font-bold text-white"
              style={{ fontFamily: PP }}
            >
              Reschedule Appointment
            </h2>
            <p className="text-xs text-teal-50 mt-0.5">
              Choose a new appointment date and available time slot.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCloseAll}
            className="p-1.5 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleRescheduleSubmit}
          className="flex-1 overflow-y-auto p-5 bg-slate-50/40 space-y-5"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Main Section (8 cols) */}
            <div className="lg:col-span-8 space-y-5">
              {/* SECTION 01: Current Appointment Info Card */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span
                    className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5"
                    style={{ fontFamily: PP }}
                  >
                    <Info size={14} className="text-[#009688]" /> Current
                    Appointment Details
                  </span>
                  <span className="font-mono text-xs font-bold text-[#009688]">
                    {appointment.id}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[#64748B] text-[10px] block">
                      Doctor
                    </span>
                    <span className="font-bold text-[#111827]">
                      {appointment.doctor}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[10px] block">
                      Department
                    </span>
                    <span className="font-semibold text-slate-700">
                      {appointment.department}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[10px] block">
                      Current Date & Time
                    </span>
                    <span className="font-semibold text-[#009688]">
                      {appointment.date} @ {appointment.time}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 02: Select New Date (Calendar) */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3
                    className="text-xs font-bold text-[#111827] uppercase tracking-wider"
                    style={{ fontFamily: PP }}
                  >
                    Select New Date *
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#009688] font-bold">
                    <button
                      type="button"
                      className="p-1 hover:bg-slate-100 rounded-lg"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span>March 2025</span>
                    <button
                      type="button"
                      className="p-1 hover:bg-slate-100 rounded-lg"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                    <div
                      key={d}
                      className="text-[10px] font-bold text-[#64748B] py-1"
                    >
                      {d}
                    </div>
                  ))}
                  {calendarDays.map((item, idx) => {
                    const isSelected = selectedDate === item.fullDate;
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={!item.isAvailable}
                        onClick={() =>
                          item.fullDate && setSelectedDate(item.fullDate)
                        }
                        className={`p-2 rounded-xl text-xs font-semibold transition-all relative ${
                          isSelected
                            ? "bg-[#009688] text-white shadow-sm font-bold"
                            : item.isCurrentAppt
                              ? "border-2 border-dashed border-[#009688] text-[#009688] font-bold bg-teal-50/50"
                              : item.isAvailable
                                ? "hover:bg-slate-100 text-[#111827]"
                                : "opacity-30 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        {item.day}
                        {item.isToday && !isSelected && (
                          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[#009688]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 03: Available Time Slots */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
                <h3
                  className="text-xs font-bold text-[#111827] uppercase tracking-wider"
                  style={{ fontFamily: PP }}
                >
                  Available Time Slots * ({selectedDate})
                </h3>

                {/* Morning */}
                <div>
                  <span className="text-[11px] font-bold text-[#64748B] block mb-1.5">
                    Morning Slots
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.morning.map((s) => {
                      const isSelected = selectedTimeSlot === s.time;
                      const isBooked = s.status === "booked";
                      return (
                        <button
                          key={s.time}
                          type="button"
                          disabled={isBooked}
                          onClick={() => setSelectedTimeSlot(s.time)}
                          className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center relative ${
                            isSelected
                              ? "bg-[#009688] text-white border-[#009688] shadow-sm font-bold"
                              : isBooked
                                ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed line-through"
                                : "bg-white text-[#111827] border-[#E5E7EB] hover:border-teal-300 hover:bg-teal-50/30"
                          }`}
                        >
                          {s.time}
                          {s.isRecommended && !isSelected && (
                            <span className="absolute -top-1.5 -right-1 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-xs">
                              Rec
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Afternoon */}
                <div>
                  <span className="text-[11px] font-bold text-[#64748B] block mb-1.5">
                    Afternoon Slots
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.afternoon.map((s) => {
                      const isSelected = selectedTimeSlot === s.time;
                      const isBooked = s.status === "booked";
                      return (
                        <button
                          key={s.time}
                          type="button"
                          disabled={isBooked}
                          onClick={() => setSelectedTimeSlot(s.time)}
                          className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                            isSelected
                              ? "bg-[#009688] text-white border-[#009688] shadow-sm font-bold"
                              : isBooked
                                ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed line-through"
                                : "bg-white text-[#111827] border-[#E5E7EB] hover:border-teal-300 hover:bg-teal-50/30"
                          }`}
                        >
                          {s.time}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Evening */}
                <div>
                  <span className="text-[11px] font-bold text-[#64748B] block mb-1.5">
                    Evening Slots
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.evening.map((s) => {
                      const isSelected = selectedTimeSlot === s.time;
                      const isBooked = s.status === "booked";
                      return (
                        <button
                          key={s.time}
                          type="button"
                          disabled={isBooked}
                          onClick={() => setSelectedTimeSlot(s.time)}
                          className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                            isSelected
                              ? "bg-[#009688] text-white border-[#009688] shadow-sm font-bold"
                              : isBooked
                                ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed line-through"
                                : "bg-white text-[#111827] border-[#E5E7EB] hover:border-teal-300 hover:bg-teal-50/30"
                          }`}
                        >
                          {s.time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* SECTION 04: Reason for Rescheduling */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
                <div>
                  <label
                    className="block text-xs font-bold text-[#111827] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    Reschedule Reason *
                  </label>
                  <select
                    value={rescheduleReason}
                    onChange={(e) => {
                      setRescheduleReason(e.target.value);
                      if (e.target.value) setValidationError(null);
                    }}
                    className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl outline-none focus:border-[#009688] focus:bg-white transition-colors ${
                      validationError
                        ? "border-red-500 bg-red-50/20"
                        : "border-[#E5E7EB]"
                    }`}
                  >
                    <option value="">Select Reason</option>
                    <option value="Patient Request">Patient Request</option>
                    <option value="Personal Reason">Personal Reason</option>
                    <option value="Schedule Conflict">Schedule Conflict</option>
                    <option value="Doctor Requested">Doctor Requested</option>
                    <option value="Travel">Travel</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* SECTION 05: Additional Remarks */}
                <div>
                  <label
                    className="block text-xs font-bold text-[#111827] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    Additional Remarks{" "}
                    <span className="font-normal text-slate-400">
                      (Optional)
                    </span>
                  </label>
                  <textarea
                    rows={2}
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Provide additional notes..."
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl outline-none focus:border-[#009688] focus:bg-white transition-colors text-[#111827]"
                  />
                </div>
              </div>
            </div>

            {/* Right Summary Panel (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              {/* UPDATED SCHEDULE PREVIEW CARD (Image 2 style) */}
              <div className="bg-[#E0F2F1]/60 border border-[#B2DFDB] p-4 rounded-2xl shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#B2DFDB] pb-2">
                  <h3
                    className="text-[11px] font-bold text-[#00796B] uppercase tracking-wider"
                    style={{ fontFamily: PP }}
                  >
                    UPDATED SCHEDULE PREVIEW
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#B2DFDB] text-[#004D40]">
                    Scheduled
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[#00796B] text-[10px] block font-medium">
                      Patient
                    </span>
                    <span className="font-bold text-[#111827]">
                      Sarah Mitchell
                    </span>
                  </div>

                  <div>
                    <span className="text-[#00796B] text-[10px] block font-medium">
                      Doctor
                    </span>
                    <span className="font-bold text-[#111827]">
                      {appointment.doctor} ({appointment.department})
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#B2DFDB]/60">
                    <div>
                      <span className="text-[#00796B] text-[10px] block font-medium">
                        New Date
                      </span>
                      <span className="font-bold text-[#00796B]">
                        {selectedDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#00796B] text-[10px] block font-medium">
                        New Time Slot
                      </span>
                      <span className="font-bold text-[#00796B]">
                        {selectedTimeSlot}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* INFORMATION GUIDELINE ALERT CARD (Image 2 style) */}
              <div className="p-3.5 bg-[#E3F2FD]/80 border border-[#BBDEFB] rounded-2xl text-xs text-[#0D47A1] flex items-start gap-2 shadow-xs">
                <Info size={16} className="text-[#0D47A1] shrink-0 mt-0.5" />
                <span className="text-[11px] font-medium leading-relaxed">
                  The previous appointment slot will be released after
                  confirming the new appointment schedule.
                </span>
              </div>

              {validationError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-1.5">
                  <AlertCircle size={14} /> {validationError}
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions (Image 2 style) */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 shrink-0 bg-white p-3 rounded-b-2xl">
            <button
              type="button"
              onClick={handleCloseAll}
              className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#009688] text-white text-xs font-bold hover:bg-[#00796B] transition-colors shadow-sm flex items-center gap-1.5"
              style={{ fontFamily: PP }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={13} className="animate-spin" /> Confirming...
                </>
              ) : (
                <>Confirm Reschedule</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}