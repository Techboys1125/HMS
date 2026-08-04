import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import type { DoctorRecord } from "../types/doctors.types";
import { PP, RB } from "../constants/doctors.constants";
import { doctorsService } from "../services/doctors.service";

export interface DeactivateDoctorDialogProps {
  isOpen: boolean;
  doctor: DoctorRecord | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeactivating?: boolean;
}

export function DeactivateDoctorDialog({
  isOpen,
  doctor,
  onClose,
  onConfirm,
  isDeactivating,
}: DeactivateDoctorDialogProps) {
  const [upcomingCount, setUpcomingCount] = useState<number>(0);
  const [acknowledged, setAcknowledged] = useState<boolean>(false);
  const [loadingCount, setLoadingCount] = useState<boolean>(false);
  const [countTrusted, setCountTrusted] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && doctor) {
      setAcknowledged(false);
      setCountTrusted(false);
      setLoadingCount(true);
      // Summary records (from the doctor list) fall back doctorId to the user
      // id, which is NOT the id the appointments endpoint expects. Only trust
      // the count when doctorId is a genuine, distinct doctor profile id.
      const hasRealDoctorId =
        typeof doctor.doctorId === "number" &&
        doctor.doctorId > 0 &&
        doctor.doctorId !== doctor.userId;
      setCountTrusted(hasRealDoctorId);
      if (!hasRealDoctorId) {
        setUpcomingCount(0);
        setLoadingCount(false);
        return;
      }
      doctorsService
        .getUpcomingAppointmentCount(doctor.doctorId as number)
        .then((cnt) => setUpcomingCount(cnt))
        .catch(() => setUpcomingCount(0))
        .finally(() => setLoadingCount(false));
    }
  }, [isOpen, doctor]);

  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#E5E7EB] p-6 space-y-4 animate-in zoom-in-95 duration-200"
        style={{ fontFamily: RB }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 text-[#EF4444] flex items-center justify-center shrink-0 border border-red-200">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3
              className="text-base font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Deactivate Doctor
            </h3>
            <p className="text-xs text-[#64748B]">
              {doctor.name} ({doctor.id})
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Are you sure you want to deactivate{" "}
          <span className="font-bold text-[#111827]">{doctor.name}</span>?
        </p>

        {loadingCount ? (
          <div className="text-xs text-[#64748B] italic">Checking upcoming appointments...</div>
        ) : upcomingCount > 0 ? (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
            <div className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-amber-600" />
              <span>Warning: {upcomingCount} upcoming appointment(s) found!</span>
            </div>
            <p className="text-[11px] text-amber-700">
              This doctor has active prospective bookings. Deactivating will block new bookings while keeping historical records intact.
            </p>
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="w-4 h-4 rounded text-[#0D47A1] focus:ring-0"
              />
              <span className="text-[11px] font-semibold text-amber-900">
                I acknowledge and wish to proceed with deactivation.
              </span>
            </label>
          </div>
        ) : (
          <div className="text-xs text-slate-500">
            This doctor has no upcoming appointments. Historical records will remain accessible.
          </div>
        )}

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={
              isDeactivating ||
              (countTrusted && upcomingCount > 0 && !acknowledged)
            }
            className="px-4 py-2 rounded-xl bg-[#EF4444] text-white text-xs font-bold hover:bg-red-600 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5"
            style={{ fontFamily: PP }}
          >
            {isDeactivating && (
              <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {isDeactivating ? "Deactivating..." : "Deactivate"}
          </button>
        </div>
      </div>
    </div>
  );
}
