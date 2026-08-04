import { useState, useEffect } from "react";
import { Activity, ChevronRight } from "lucide-react";
import type { Patient } from "../types/patient.types";
import { PP, RB } from "../../doctors/constants/doctors.constants";
import { patientApi } from "../api/patientApi";
import { mapApiPatientToPatientRecord } from "../api/mapApiPatientToPatientRecord";
import { RecordPatientVitalsForm } from "../../vitals/components/RecordPatientVitalsForm";

export function NurseVitalsWorklistPage() {
  const [waitingPatients, setWaitingPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    patientApi.getNurseVitalsWaiting()
      .then((data) => {
        if (!cancelled) {
          setWaitingPatients(data.map(mapApiPatientToPatientRecord));
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (selectedPatient) {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]" style={{ fontFamily: RB }}>
        <div className="max-w-4xl mx-auto space-y-4">
          <button onClick={() => setSelectedPatient(null)} className="flex items-center gap-2 text-xs text-[#64748B] hover:text-[#0D47A1] transition-colors">
            ← Back to worklist
          </button>
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-4 mb-4">
            <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>{selectedPatient.fullName}</h2>
            <p className="text-xs text-[#64748B]">MRN: {selectedPatient.mrn} · {selectedPatient.gender} · {selectedPatient.age} yrs · {selectedPatient.department || "—"}</p>
          </div>
          <RecordPatientVitalsForm
            patientMrn={selectedPatient.mrn}
            patientName={selectedPatient.fullName}
            appointmentId={selectedPatient.appointmentId || ""}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]" style={{ fontFamily: RB }}>
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center gap-2">
          <Activity size={20} className="text-[#0D47A1]" />
          <h1 className="text-lg font-bold text-[#111827]" style={{ fontFamily: PP }}>Patients Waiting for Vitals</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8 text-xs text-[#64748B]">Loading worklist...</div>
        ) : (
          <div className="space-y-2">
            {waitingPatients.map((patient) => (
              <div key={patient.mrn} onClick={() => setSelectedPatient(patient)} className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded-xl p-3 hover:bg-slate-50/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                    {patient.fullName?.charAt(0) || "P"}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#111827]">{patient.fullName}</div>
                    <div className="text-[11px] text-[#64748B]">MRN: {patient.mrn} · {patient.gender} · {patient.age} yrs</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400" />
              </div>
            ))}
            {waitingPatients.length === 0 && (
              <div className="text-center py-8 text-xs text-[#64748B]">No patients waiting for vitals.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}