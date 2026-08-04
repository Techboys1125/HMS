import { useState, useEffect } from "react";
import { Pill, ChevronRight } from "lucide-react";
import type { Patient, ApiPatientPrescription } from "../../types/patient.types";
import { PP } from "../../../doctors/constants/doctors.constants";
import { patientApi } from "../../api/patientApi";

export interface PrescriptionsTabProps {
  patient: Patient;
  canEdit: boolean;
  isOwnProfile: boolean;
}

export function PatientPrescriptionsTab({ patient, canEdit, isOwnProfile }: PrescriptionsTabProps) {
  const [prescriptions, setPrescriptions] = useState<ApiPatientPrescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    patientApi.getPrescriptions(patient.mrn)
      .then((data) => { if (!cancelled) setPrescriptions(data || []); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [patient.mrn]);

  const filtered = isOwnProfile
    ? prescriptions.filter((p) => p.status !== "Cancelled" && p.status !== "Archived")
    : prescriptions;

  if (loading) {
    return <div className="flex items-center justify-center p-8 text-xs text-[#64748B]">Loading prescriptions...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Prescriptions</h3>
        <span className="text-[11px] text-[#64748B]">{filtered.length} prescriptions</span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-8 text-xs text-[#64748B]">No prescriptions found.</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((rx) => (
            <div key={rx.id} className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded-xl p-3 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Pill size={14} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#111827]">{rx.medicineCount} medicines</div>
                  <div className="text-[11px] text-[#64748B]">{rx.date} · {rx.doctorName || "—"}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${rx.status === "Issued" ? "bg-emerald-50 text-[#66BB6A] border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                  {rx.status}
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