import { useState } from "react";
import {
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  AlertCircle,
} from "lucide-react";
import { formatTime } from "../../../lib/time-utils";
import type {
  PatientCancelAppointmentDialogProps,
  PatientRescheduleAppointmentDialogProps,
} from "../types/patient.types";
import { PP, RB } from "../constants/patient.fonts";
import { useAppointmentSlots } from "../../appointments/hooks/useAppointmentSlots";

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
                {appointment.date} @ {formatTime(appointment.time)}
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
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(today);

  const doctorId = appointment ? String(appointment.doctorId || "") : "";
  const { slots: apiSlots, isLoading: slotsLoading } = useAppointmentSlots(
    doctorId ? String(doctorId) : undefined,
    selectedDate || undefined,
  );

  if (!isOpen || !appointment) return null;

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthName = currentMonth.toLocaleString("default", { month: "long" });
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const calendarDays: Array<{
    day: number;
    isCurrentMonth: boolean;
    isAvailable: boolean;
    isToday: boolean;
    isCurrentAppt: boolean;
    fullDate?: string;
  }> = [];

  for (let i = 0; i < firstDayIndex; i++) {
    const d = new Date(year, month, -firstDayIndex + i + 1);
    calendarDays.push({
      day: d.getDate(),
      isCurrentMonth: false,
      isAvailable: false,
      isToday: false,
      isCurrentAppt: false,
    });
  }

  for (let day = 1; day <= totalDays; day++) {
    const d = new Date(year, month, day);
    const dateStr = d.toISOString().split("T")[0];
    const isPast =
      d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isToday = dateStr === todayStr;
    const isCurrentAppt = dateStr === appointment.date;
    calendarDays.push({
      day,
      isCurrentMonth: true,
      isAvailable: !isPast,
      isToday,
      isCurrentAppt,
      fullDate: dateStr,
    });
  }

  const remaining = 42 - calendarDays.length;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i);
    calendarDays.push({
      day: i,
      isCurrentMonth: false,
      isAvailable: false,
      isToday: false,
      isCurrentAppt: false,
      fullDate: d.toISOString().split("T")[0],
    });
  }

  const displaySlots = (
    (apiSlots as Array<{
      time?: string;
      startTime?: string;
      slot?: string;
      available?: boolean;
    }>) || []
  ).map((s) => ({
    time: s.time || s.startTime || s.slot || "",
    available: s.available !== false,
  }));

  const morningSlots = displaySlots.filter((s) => {
    const h = parseInt(s.time, 10);
    return h >= 5 && h < 12;
  });
  const afternoonSlots = displaySlots.filter((s) => {
    const h = parseInt(s.time, 10);
    return h >= 12 && h < 17;
  });
  const eveningSlots = displaySlots.filter((s) => {
    const h = parseInt(s.time, 10);
    return h >= 17;
  });

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
                      {appointment.date} @ {formatTime(appointment.time)}
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
                      onClick={() =>
                        setCurrentMonth(new Date(year, month - 1, 1))
                      }
                      className="p-1 hover:bg-slate-100 rounded-lg"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span>
                      {monthName} {year}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentMonth(new Date(year, month + 1, 1))
                      }
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
                  {calendarDays.map((item) => {
                    const isSelected = selectedDate === item.fullDate;
                    return (
                      <button
                        key={item.fullDate || item.day}
                        type="button"
                        disabled={!item.isAvailable}
                        onClick={() => {
                          if (item.fullDate) {
                            setSelectedDate(item.fullDate);
                            setSelectedTimeSlot("");
                          }
                        }}
                        className={`p-2 rounded-xl text-xs font-semibold transition-colors relative ${
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
                  Available Time Slots * ({selectedDate || "Select a date"})
                </h3>

                {slotsLoading ? (
                  <div className="flex items-center justify-center py-6 text-xs text-[#64748B]">
                    <RefreshCw size={14} className="animate-spin mr-2" />{" "}
                    Loading available slots...
                  </div>
                ) : !selectedDate ? (
                  <div className="flex items-center justify-center py-6 text-xs text-[#64748B]">
                    Select a date to view available time slots.
                  </div>
                ) : displaySlots.length === 0 ? (
                  <div className="flex items-center justify-center py-6 text-xs text-[#64748B]">
                    No available slots for this date. Try another date.
                  </div>
                ) : (
                  <>
                    {morningSlots.length > 0 && (
                      <div>
                        <span className="text-[11px] font-bold text-[#64748B] block mb-1.5">
                          Morning Slots
                        </span>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {morningSlots.map((s) => {
                            const isSelected = selectedTimeSlot === s.time;
                            const isBooked = !s.available;
                            return (
                              <button
                                key={s.time}
                                type="button"
                                disabled={isBooked}
                                onClick={() => setSelectedTimeSlot(s.time)}
                                className={`p-2.5 rounded-xl text-xs font-semibold border transition-colors text-center ${
                                  isSelected
                                    ? "bg-[#009688] text-white border-[#009688] shadow-sm font-bold"
                                    : isBooked
                                      ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed line-through"
                                      : "bg-white text-[#111827] border-[#E5E7EB] hover:border-teal-300 hover:bg-teal-50/30"
                                }`}
                              >
                                {formatTime(s.time)}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {afternoonSlots.length > 0 && (
                      <div>
                        <span className="text-[11px] font-bold text-[#64748B] block mb-1.5">
                          Afternoon Slots
                        </span>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {afternoonSlots.map((s) => {
                            const isSelected = selectedTimeSlot === s.time;
                            const isBooked = !s.available;
                            return (
                              <button
                                key={s.time}
                                type="button"
                                disabled={isBooked}
                                onClick={() => setSelectedTimeSlot(s.time)}
                                className={`p-2.5 rounded-xl text-xs font-semibold border transition-colors text-center ${
                                  isSelected
                                    ? "bg-[#009688] text-white border-[#009688] shadow-sm font-bold"
                                    : isBooked
                                      ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed line-through"
                                      : "bg-white text-[#111827] border-[#E5E7EB] hover:border-teal-300 hover:bg-teal-50/30"
                                }`}
                              >
                                {formatTime(s.time)}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {eveningSlots.length > 0 && (
                      <div>
                        <span className="text-[11px] font-bold text-[#64748B] block mb-1.5">
                          Evening Slots
                        </span>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {eveningSlots.map((s) => {
                            const isSelected = selectedTimeSlot === s.time;
                            const isBooked = !s.available;
                            return (
                              <button
                                key={s.time}
                                type="button"
                                disabled={isBooked}
                                onClick={() => setSelectedTimeSlot(s.time)}
                                className={`p-2.5 rounded-xl text-xs font-semibold border transition-colors text-center ${
                                  isSelected
                                    ? "bg-[#009688] text-white border-[#009688] shadow-sm font-bold"
                                    : isBooked
                                      ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed line-through"
                                      : "bg-white text-[#111827] border-[#E5E7EB] hover:border-teal-300 hover:bg-teal-50/30"
                                }`}
                              >
                                {formatTime(s.time)}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
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
                      {appointment.patientName || "Patient"}
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
