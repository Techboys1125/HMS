import React, { useState, useEffect, useRef, useEffectEvent } from "react";
import { AlertTriangle, X, AlertCircle } from "lucide-react";
import type { AppointmentRecord } from "../types/appointment.types";
import { StatusBadge } from "./StatusBadge";
import { PP, RB } from "../constants/appointment.constants";

export function CancelAppointmentConfirmationDialog({
  apt,
  isOpen,
  onClose,
  onConfirmCancel,
}: {
  apt: AppointmentRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: (
    aptId: string | number,
    reason: string,
    remarks?: string,
  ) => void;
}) {
  const [cancellationReason, setCancellationReason] =
    useState("Patient Request");
  const [additionalRemarks, setAdditionalRemarks] = useState("");
  const [error, setError] = useState("");
  const dropdownRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setCancellationReason("Patient Request");
        setAdditionalRemarks("");
        setError("");
        dropdownRef.current?.focus();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const onEscape = useEffectEvent(() => {
    onClose();
  });

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

  if (!isOpen || !apt) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellationReason) {
      setError("Please select a cancellation reason.");
      return;
    }
    onConfirmCancel(apt.id, cancellationReason, additionalRemarks);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div role="presentation"
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div
        className="relative bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-md w-full overflow-hidden z-10 transition-transform duration-150"
        style={{ fontFamily: RB }}
      >
        <div className="p-5 bg-white border-b border-gray-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#EF4444] border border-red-100 flex items-center justify-center shrink-0 shadow-2xs">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3
                className="text-base font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Cancel Appointment
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                This action will cancel the selected appointment.
              </p>
            </div>
          </div>

          <button aria-label="Close"
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-[#EF4444] p-3 rounded-xl flex items-center gap-2 text-xs font-semibold">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-[#0D47A1] text-xs">
                {apt.id}
              </span>
              <StatusBadge status={apt.status} />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
              <div>
                <span className="text-[10px] text-slate-400 block">
                  Patient Name
                </span>
                <strong className="text-[#111827]">{apt.patientName}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Doctor</span>
                <span className="text-slate-700 font-medium">
                  {apt.doctorName}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">
                  Department
                </span>
                <span className="text-slate-600">
                  {typeof apt.department === "string"
                    ? apt.department
                    : apt.department?.departmentName ||
                      apt.department?.name ||
                      apt.department?.departmentCode ||
                      ""}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">
                  Schedule
                </span>
                <span className="font-mono text-[#009688] font-bold">
                  {apt.appointmentDate} @ {apt.timeSlot}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="block text-xs font-bold text-[#111827] mb-1">
                Cancellation Reason *
              
              <select aria-label="Select option"
                ref={dropdownRef}
                value={cancellationReason}
                onChange={(e) => {
                  setCancellationReason(e.target.value);
                  if (error) setError("");
                }}
                className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] font-medium outline-none focus:border-[#EF4444]"
              >
                <option value="Patient Request">Patient Request</option>
                <option value="Doctor Unavailable">Doctor Unavailable</option>
                <option value="Hospital Emergency">Hospital Emergency</option>
                <option value="Duplicate Appointment">
                  Duplicate Appointment
                </option>
                <option value="Incorrect Booking">Incorrect Booking</option>
                <option value="Other">Other</option>
              </select></span>
            </div>

            <div>
              <span className="block text-xs font-bold text-[#111827] mb-1">
                Additional Remarks{" "}
                <span className="text-[10px] text-slate-400 font-normal">
                  (Optional)
                </span>
              </span>
              <textarea aria-label="Provide additional context or reason for cancellation..."
                rows={2}
                placeholder="Provide additional context or reason for cancellation..."
                value={additionalRemarks}
                onChange={(e) => setAdditionalRemarks(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#EF4444] resize-none"
              />
            </div>
          </div>

          <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
            <AlertTriangle
              size={15}
              className="text-[#F59E0B] shrink-0 mt-0.5"
            />
            <p className="leading-relaxed text-[11px]">
              Cancelling this appointment will remove it from today's
              appointment schedule. Historical appointment records will remain
              available for reporting purposes.
            </p>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-colors"
            >
              Keep Appointment
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#EF4444] text-white text-xs font-bold hover:bg-red-600 transition-colors shadow-sm"
              style={{ fontFamily: PP }}
            >
              Cancel Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
