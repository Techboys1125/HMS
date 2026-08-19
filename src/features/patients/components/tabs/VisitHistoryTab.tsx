import { useState, useEffect } from "react";
import { Clock, Stethoscope, ChevronRight } from "lucide-react";
import type { Patient, ApiPatientAppointment } from "../../types/patient.types";
import { PP } from "../../../doctors/constants/doctors.constants";
import { patientsApi } from "../../api/patient.api";

export interface VisitHistoryTabProps {
  patient: Patient;
  isOwnProfile: boolean;
}

const VISIT_STATUS_STYLE: Record<string, string> = {
  Completed: "bg-gray-50 text-gray-600 border border-gray-200",
  COMPLETED: "bg-gray-50 text-gray-600 border border-gray-200",
  "Checked-In": "bg-emerald-50 text-[#66BB6A] border border-emerald-200",
  CHECKED_IN: "bg-emerald-50 text-[#66BB6A] border border-emerald-200",
  "In Consultation": "bg-sky-50 text-sky-700 border border-sky-200",
  IN_CONSULTATION: "bg-sky-50 text-sky-700 border border-sky-200",
  Cancelled: "bg-red-50 text-[#EF4444] border border-red-200",
  CANCELLED: "bg-red-50 text-[#EF4444] border border-red-200",
};

function isVisitStatus(status?: string): boolean {
  if (!status) return false;
  const s = status.toUpperCase();
  return (
    s === "COMPLETED" ||
    s === "CHECKED-IN" ||
    s === "CHECKED_IN" ||
    s === "IN CONSULTATION" ||
    s === "IN_CONSULTATION"
  );
}

function isCancelledStatus(status?: string): boolean {
  if (!status) return false;
  const s = status.toUpperCase();
  return s === "CANCELLED";
}

function resolveDoctorName(
  doctor?: string | { name?: string; fullName?: string; id?: number | string },
): string {
  if (!doctor) return "—";
  if (typeof doctor === "string") return doctor;
  return doctor.fullName || doctor.name || "—";
}

function resolveDepartmentName(
  department?: string | { departmentName?: string; name?: string },
): string {
  if (!department) return "—";
  if (typeof department === "string") return department;
  return department.departmentName || department.name || "—";
}

function resolveStatus(appointment: ApiPatientAppointment): string {
  return appointment.status || appointment.appointmentStatus || "—";
}

export function VisitHistoryTab({ patient, isOwnProfile }: VisitHistoryTabProps) {
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

  const filtered = appointments.filter((a) => {
    const status = resolveStatus(a);
    if (isOwnProfile) {
      return isVisitStatus(status) || isCancelledStatus(status);
    }
    return isVisitStatus(status);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-xs text-[#64748B]">
        Loading visit history...
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
          Visit History
        </h3>
        <span className="text-[11px] text-[#64748B]">
          {filtered.length} visits
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-8 text-xs text-[#64748B]">
          No visit history found.
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((appt) => {
            const status = resolveStatus(appt);
            return (
              <div
                key={appt.id}
                className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded-xl p-3 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0D47A1] flex items-center justify-center">
                    <Stethoscope size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#111827]">
                      {resolveDoctorName(appt.doctor)}
                    </div>
                    <div className="text-[11px] text-[#64748B]">
                      {appt.date || appt.appointmentDate || "—"} at{" "}
                      {appt.time || appt.startTime || "—"} ·{" "}
                      {resolveDepartmentName(appt.department)}
                    </div>
                    {appt.visitType && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock size={10} className="text-[#64748B]" />
                        <span className="text-[10px] text-[#64748B]">
                          {appt.visitType}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${VISIT_STATUS_STYLE[status] || "bg-slate-100 text-slate-600 border border-slate-200"}`}
                  >
                    {status}
                  </span>
                  <ChevronRight size={14} className="text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
