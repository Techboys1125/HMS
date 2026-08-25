import React, {
  useState,
  useEffect,
  useRef,
  useEffectEvent,
  useReducer,
  useCallback,
} from "react";
import {
  Calendar as CalendarIcon,
  X,
  AlertCircle,
  Info,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import type { AppointmentRecord } from "../types/appointment.types";
import { StatusBadge } from "./StatusBadge";
import { PP, RB } from "../constants/appointment.constants";
import { formatTime } from "../../../lib/time-utils";
import { useAppointmentSlots } from "../hooks/useAppointmentSlots";

type FormState = {
  selectedDate: string;
  selectedTimeSlot: string;
  rescheduleReason: string;
  additionalRemarks: string;
};
type FormAction =
  | { type: "SET_FIELD"; field: keyof FormState; value: string }
  | { type: "RESET"; defaultDate: string };

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return {
        selectedDate: action.defaultDate,
        selectedTimeSlot: "",
        rescheduleReason: "Patient Request",
        additionalRemarks: "",
      };
  }
};

type SetFormField = (field: keyof FormState, value: string) => void;

type ErrorState = Record<string, string>;

type SetErrors = React.Dispatch<React.SetStateAction<ErrorState>>;

interface RescheduleDialogHeaderProps {
  onClose: () => void;
}

interface CurrentBookingDetailsProps {
  apt: AppointmentRecord;
}

interface RescheduleCalendarPickerProps {
  form: FormState;
  setField: SetFormField;
  errors: ErrorState;
  setErrors: SetErrors;
  dateInputRef: React.RefObject<HTMLInputElement | null>;
  monthName: string;
  year: number;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  firstDayIndex: number;
  totalDays: number;
  month: number;
  todayStr: string;
  apt: AppointmentRecord;
}

interface AppointmentSlot {
  time: string;
  available: boolean;
}

interface DoctorAvailability {
  specialty: string;
  department: string;
  opdRoom: string;
  slotDuration: string;
  slots: AppointmentSlot[];
}

interface RescheduleTimeSlotPickerProps {
  docAvail: DoctorAvailability;
  slotsLoading: boolean;
  form: FormState;
  setField: SetFormField;
  errors: ErrorState;
  setErrors: SetErrors;
}

interface RescheduleReasonFormProps {
  form: FormState;
  setField: SetFormField;
  errors: ErrorState;
  setErrors: SetErrors;
}

interface UpdatedSchedulePreviewProps {
  apt: AppointmentRecord;
  form: FormState;
}

const RescheduleDialogHeader = ({ onClose }: RescheduleDialogHeaderProps) => (
  <div className="p-5 bg-[#009688] text-white flex items-start justify-between shadow-xs">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md text-white border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
        <CalendarIcon size={20} />
      </div>
      <div>
        <h3
          className="text-base font-bold flex items-center gap-2"
          style={{ fontFamily: PP }}
        >
          Reschedule Appointment
        </h3>
        <p className="text-xs text-teal-100 mt-0.5">
          Choose a new appointment date and available time slot.
        </p>
      </div>
    </div>

    <button
      aria-label="Close"
      type="button"
      onClick={onClose}
      className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
    >
      <X size={18} />
    </button>
  </div>
);

const CurrentBookingDetails = ({ apt }: CurrentBookingDetailsProps) => (
  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2 text-xs">
    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
      <span className="text-[10px] uppercase font-bold text-slate-400">
        Current Booking Details
      </span>
      <StatusBadge status={apt.status} />
    </div>

    <div className="grid grid-cols-2 gap-2 pt-0.5">
      <div>
        <span className="text-[10px] text-slate-400 block">Appointment ID</span>
        <strong className="text-[#0D47A1] font-mono">
          {apt.id} ({apt.tokenNo})
        </strong>
      </div>
      <div>
        <span className="text-[10px] text-slate-400 block">Patient Name</span>
        <strong className="text-[#111827]">{apt.patientName}</strong>
      </div>
      <div>
        <span className="text-[10px] text-slate-400 block">
          Attending Doctor
        </span>
        <span className="text-slate-700 font-medium">{apt.doctorName}</span>
      </div>
      <div>
        <span className="text-[10px] text-slate-400 block">
          Current Schedule
        </span>
        <span className="font-mono text-red-500 font-bold">
          {apt.appointmentDate} @ {formatTime(apt.timeSlot)}
        </span>
      </div>
    </div>
  </div>
);

const RescheduleCalendarPicker = ({
  form,
  setField,
  errors,
  setErrors,
  dateInputRef,
  monthName,
  year,
  handlePrevMonth,
  handleNextMonth,
  firstDayIndex,
  totalDays,
  month,
  todayStr,
  apt,
}: RescheduleCalendarPickerProps) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
      <span
        className="text-xs font-bold text-[#111827] flex items-center gap-1.5"
        style={{ fontFamily: PP }}
      >
        <CalendarIcon size={14} className="text-[#009688]" /> Select New
        Appointment Date *
        <input
          aria-label="Input field"
          ref={dateInputRef}
          type="date"
          value={form.selectedDate}
          onChange={(e) => {
            setField("selectedDate", e.target.value);
            if (errors.date) setErrors((prev) => ({ ...prev, date: "" }));
          }}
          className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-[#111827] font-mono outline-none focus:border-[#009688]"
        />
      </span>
    </div>

    <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/80 space-y-2">
      <div
        className="flex items-center justify-between text-xs font-bold text-[#111827]"
        style={{ fontFamily: PP }}
      >
        <span>
          {monthName} {year}
        </span>
        <div className="flex items-center gap-1">
          <button
            aria-label="Previous"
            type="button"
            onClick={handlePrevMonth}
            className="p-1 rounded hover:bg-slate-200 text-slate-600"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            aria-label="Next"
            type="button"
            onClick={handleNextMonth}
            className="p-1 rounded hover:bg-slate-200 text-slate-600"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400">
        <span>Su</span>
        <span>Mo</span>
        <span>Tu</span>
        <span>We</span>
        <span>Th</span>
        <span>Fr</span>
        <span>Sa</span>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {Array.from({ length: firstDayIndex }).map((_, idx) => (
          <span key={idx} />
        ))}
        {Array.from({ length: totalDays }).map((_, i) => {
          const dayNum = i + 1;
          const dayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
          const isSelected = form.selectedDate === dayStr;
          const isCurrentAptDate = apt.appointmentDate === dayStr;
          const isPast = dayStr < todayStr;
          const isSunday = new Date(year, month, dayNum).getDay() === 0;

          const isDisabled = isPast || isSunday;

          return (
            <button
              key={dayStr}
              type="button"
              disabled={isDisabled}
              onClick={() => {
                setField("selectedDate", dayStr);
                if (errors.date) setErrors((prev) => ({ ...prev, date: "" }));
              }}
              className={`py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isSelected
                  ? "bg-[#009688] text-white font-bold shadow-xs"
                  : isCurrentAptDate
                    ? "bg-amber-100 text-amber-800 font-bold border border-amber-300"
                    : isDisabled
                      ? "text-slate-300 cursor-not-allowed line-through opacity-50"
                      : "text-slate-700 bg-white hover:bg-teal-50 hover:text-[#009688] border border-slate-100"
              }`}
            >
              {dayNum}
            </button>
          );
        })}
      </div>
    </div>
    {errors.date && (
      <p className="text-[11px] text-[#EF4444] font-medium">{errors.date}</p>
    )}
  </div>
);

const RescheduleTimeSlotPicker = ({
  docAvail,
  slotsLoading,
  form,
  setField,
  errors,
  setErrors,
}: RescheduleTimeSlotPickerProps) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
      <span
        className="text-xs font-bold text-[#111827] flex items-center gap-1.5"
        style={{ fontFamily: PP }}
      >
        <Clock size={14} className="text-[#009688]" /> Available Time Slots *
      </span>
      <span className="text-[10px] font-mono text-teal-600 font-bold">
        Duration: {docAvail.slotDuration}
      </span>
    </div>

    {slotsLoading ? (
      <div className="flex items-center justify-center py-6 text-xs text-[#64748B]">
        <Clock size={14} className="animate-spin mr-2" /> Loading available
        slots...
      </div>
    ) : docAvail.slots.length === 0 ? (
      <div className="flex items-center justify-center py-6 text-xs text-[#64748B]">
        {form.selectedDate
          ? "No available slots for this date. Try another date."
          : "Select a date to view available time slots."}
      </div>
    ) : (
      <div className="grid grid-cols-4 gap-2">
        {docAvail.slots.map((s) => {
          const isSelected = form.selectedTimeSlot === s.time;
          const isAvailable = s.available;

          return (
            <button
              key={s.time}
              type="button"
              disabled={!isAvailable}
              onClick={() => {
                if (isAvailable) {
                  setField("selectedTimeSlot", s.time);
                  if (errors.slot) setErrors((prev) => ({ ...prev, slot: "" }));
                }
              }}
              className={`py-2 px-1.5 rounded-xl text-xs font-mono font-semibold transition-colors border text-center ${
                isSelected
                  ? "bg-[#0D47A1] text-white border-[#0D47A1] shadow-xs"
                  : isAvailable
                    ? "bg-slate-50 text-slate-700 border-[#E5E7EB] hover:bg-blue-50 hover:text-[#0D47A1]"
                    : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50 line-through"
              }`}
            >
              {s.time}
            </button>
          );
        })}
      </div>
    )}
    {errors.slot && (
      <p className="text-[11px] text-[#EF4444] font-medium">{errors.slot}</p>
    )}
  </div>
);

const RescheduleReasonForm = ({
  form,
  setField,
  errors,
  setErrors,
}: RescheduleReasonFormProps) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
    <div>
      <span className="block text-xs font-bold text-[#111827] mb-1">
        Reschedule Reason *
        <select
          aria-label="Select option"
          value={form.rescheduleReason}
          onChange={(e) => {
            setField("rescheduleReason", e.target.value);
            if (errors.reason) setErrors((prev) => ({ ...prev, reason: "" }));
          }}
          className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] font-medium outline-none focus:border-[#009688]"
        >
          <option value="Patient Request">Patient Request</option>
          <option value="Doctor Unavailable">Doctor Unavailable</option>
          <option value="Scheduling Conflict">Scheduling Conflict</option>
          <option value="Hospital Operational Change">
            Hospital Operational Change
          </option>
          <option value="Administrative Adjustment">
            Administrative Adjustment
          </option>
          <option value="Other">Other</option>
        </select>
      </span>
    </div>

    <div>
      <span className="block text-xs font-bold text-[#111827] mb-1">
        Additional Remarks{" "}
        <span className="text-[10px] text-slate-400 font-normal">
          (Optional)
        </span>
      </span>
      <textarea
        aria-label="Provide additional notes..."
        rows={2}
        placeholder="Provide additional notes..."
        value={form.additionalRemarks}
        onChange={(e) => setField("additionalRemarks", e.target.value)}
        className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#009688] resize-none"
      />
    </div>
  </div>
);

const UpdatedSchedulePreview = ({ apt, form }: UpdatedSchedulePreviewProps) => (
  <div className="bg-teal-50/70 p-3.5 rounded-xl border border-teal-200/80 space-y-2 text-xs">
    <div className="flex items-center justify-between border-b border-teal-200/60 pb-1.5">
      <span className="text-[10px] uppercase font-bold text-teal-800">
        Updated Schedule Preview
      </span>
      <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-md">
        Scheduled
      </span>
    </div>

    <div className="grid grid-cols-2 gap-2 pt-0.5 text-[#111827]">
      <div>
        <span className="text-[10px] text-teal-700 block">Patient</span>
        <strong>{apt.patientName}</strong>
      </div>
      <div>
        <span className="text-[10px] text-teal-700 block">Doctor</span>
        <strong>
          {apt.doctorName} (
          {typeof apt.department === "string"
            ? apt.department
            : apt.department?.departmentName ||
              apt.department?.name ||
              apt.department?.departmentCode ||
              ""}
          )
        </strong>
      </div>
      <div>
        <span className="text-[10px] text-teal-700 block">New Date</span>
        <span className="font-mono text-[#009688] font-bold">
          {form.selectedDate || "Select Date"}
        </span>
      </div>
      <div>
        <span className="text-[10px] text-teal-700 block">New Time Slot</span>
        <span className="font-mono text-[#0D47A1] font-bold">
          {form.selectedTimeSlot || "Select Slot"}
        </span>
      </div>
    </div>
  </div>
);

export function RescheduleAppointmentConfirmationDialog({
  apt,
  isOpen,
  onClose,
  onConfirmReschedule,
}: {
  apt: AppointmentRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmReschedule: (
    aptId: string | number,
    newDate: string,
    newTimeSlot: string,
    reason: string,
    remarks?: string,
  ) => void;
}) {
  const [form, dispatch] = useReducer(formReducer, {
    selectedDate: "",
    selectedTimeSlot: "",
    rescheduleReason: "Patient Request",
    additionalRemarks: "",
  });
  const setField = useCallback(
    (field: keyof FormState, value: string) =>
      dispatch({ type: "SET_FIELD", field, value }),
    [],
  );
  const currentMonthDateState = useState(new Date());
  const currentMonthDate = currentMonthDateState[0];
  const setCurrentMonthDate = currentMonthDateState[1];
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && apt) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const defaultDateStr = tomorrow.toISOString().split("T")[0];

      const timer = setTimeout(() => {
        dispatch({ type: "RESET", defaultDate: defaultDateStr });
        setErrors({});
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, apt]);

  const onEscape = useEffectEvent(() => {
    onClose();
  });

  // Reset selected time slot when date changes
  useEffect(() => {
    if (form.selectedDate) {
      setField("selectedTimeSlot", "");
    }
  }, [form.selectedDate, setField]);

  // ESC Key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onEscape();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const doctorId = apt ? String(apt.doctorId) : undefined;
  const { slots: apiSlots, isLoading: slotsLoading } = useAppointmentSlots(
    doctorId,
    form.selectedDate || undefined,
  );

  if (!isOpen || !apt) return null;

  const docAvail: DoctorAvailability = {
    specialty: String(
      (apt?.doctor as unknown as Record<string, unknown>)?.specialty || "",
    ),
    department:
      typeof apt.department === "string"
        ? apt.department
        : apt.department?.departmentName || "",
    opdRoom: apt.opdRoom || "",
    slotDuration: "15 Minutes",
    slots: (
      (apiSlots as {
        slot: string;
        startTime: string;
        time: string;
        available: boolean;
      }[]) || []
    ).map((s) => ({
      time: s.time || s.startTime || s.slot || "",
      available: s.available !== false,
    })),
  };

  const handlePrevMonth = () => {
    setCurrentMonthDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const monthName = currentMonthDate.toLocaleString("default", {
    month: "long",
  });
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const todayStr = new Date().toISOString().split("T")[0];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.selectedDate) errs.date = "Appointment date is required.";
    if (!form.selectedTimeSlot) errs.slot = "Time slot selection is required.";
    if (!form.rescheduleReason) errs.reason = "Reschedule reason is required.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onConfirmReschedule(
      apt.id,
      form.selectedDate,
      form.selectedTimeSlot,
      form.rescheduleReason,
      form.additionalRemarks,
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        role="presentation"
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div
        className="relative bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-lg w-full overflow-hidden z-10 transition-transform duration-150"
        style={{ fontFamily: RB }}
      >
        <RescheduleDialogHeader onClose={onClose} />

        <form
          onSubmit={handleSubmit}
          className="p-5 space-y-5 max-h-[80vh] overflow-y-auto bg-[#F1F5F9]/30"
        >
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 text-[#EF4444] p-3 rounded-xl flex items-center gap-2 text-xs font-semibold">
              <AlertCircle size={14} className="shrink-0" />
              <span>
                Please fill in all mandatory required fields (*) before
                rescheduling.
              </span>
            </div>
          )}

          <CurrentBookingDetails apt={apt} />

          <RescheduleCalendarPicker
            form={form}
            setField={setField}
            errors={errors}
            setErrors={setErrors}
            dateInputRef={dateInputRef}
            monthName={monthName}
            year={year}
            handlePrevMonth={handlePrevMonth}
            handleNextMonth={handleNextMonth}
            firstDayIndex={firstDayIndex}
            totalDays={totalDays}
            month={month}
            todayStr={todayStr}
            apt={apt}
          />

          <RescheduleTimeSlotPicker
            docAvail={docAvail}
            slotsLoading={slotsLoading}
            form={form}
            setField={setField}
            errors={errors}
            setErrors={setErrors}
          />

          <RescheduleReasonForm
            form={form}
            setField={setField}
            errors={errors}
            setErrors={setErrors}
          />

          <UpdatedSchedulePreview apt={apt} form={form} />

          {/* Info Banner */}
          <div className="bg-blue-50/80 border border-blue-200 p-3 rounded-xl flex items-start gap-2.5 text-xs text-[#0D47A1]">
            <Info size={15} className="text-[#0D47A1] shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              The previous appointment slot will be released after confirming
              the new appointment schedule.
            </p>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#009688] text-white text-xs font-bold hover:bg-[#00796b] transition-colors shadow-sm"
              style={{ fontFamily: PP }}
            >
              Confirm Reschedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
