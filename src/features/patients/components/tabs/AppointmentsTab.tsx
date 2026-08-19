import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import type { Patient, ApiPatientAppointment } from "../../types/patient.types";
import { PP } from "../../../doctors/constants/doctors.constants";
import { patientsApi } from "../../api/patient.api";

export interface AppointmentsTabProps {
  patient: Patient;
  canEdit: boolean;
  isOwnProfile: boolean;
}

const APPT_STATUS_STYLE: Record<string, string> = {
  Confirmed: "bg-emerald-50 text-[#66BB6A] border-emerald-200",
  Scheduled: "bg-blue-50 text-[#0D47A1] border-blue-200",
  "In Progress": "bg-sky-50 text-sky-700 border-sky-200",
  Completed: "bg-gray-50 text-gray-600 border-gray-200",
  Cancelled: "bg-red-50 text-[#EF4444] border-red-200",
  Pending: "bg-amber-50 text-[#F59E0B] border-amber-200",
};

export function PatientAppointmentsTab({
  patient,
  isOwnProfile,
}: AppointmentsTabProps) {
  const [appointments, setAppointments] = useState<ApiPatientAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [prevMrn, setPrevMrn] = useState<string | null>(null);

  if (patient.mrn !== prevMrn) {
    setPrevMrn(patient.mrn);
    setLoading(true);
  }

  useEffect(() => {
    let cancelled = false;
    patientsApi
      .getAppointments(patient.mrn)
      .then((data) => {
        if (!cancelled) setAppointments(data || []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [patient.mrn]);

  const filtered = isOwnProfile
    ? appointments.filter(
        (a) => a.status !== "Cancelled" && a.status !== "Completed",
      )
    : appointments;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-xs text-[#64748B]">
        Loading appointments...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3
          className="text-sm font-bold text-[#111827]"
          style={{ fontFamily: PP }}
        >
          Appointments
        </h3>
        <span className="text-[11px] text-[#64748B]">
          {filtered.length} appointments
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-8 text-xs text-[#64748B]">
          No appointments found.
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((appt) => (
            <div
              key={appt.id}
              className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded-xl p-3 hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0D47A1] flex items-center justify-center text-xs font-bold">
                  {appt.doctor?.charAt(0) || "D"}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#111827]">
                    {appt.doctor || "—"}
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    {appt.date} at {appt.time} · {appt.department}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${APPT_STATUS_STYLE[appt.status ?? ""] || "bg-slate-100 text-slate-600 border-slate-200"}`}
                >
                  {appt.status}
                </span>
                <ChevronRight size={14} className="text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
