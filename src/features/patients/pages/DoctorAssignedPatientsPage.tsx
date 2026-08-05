import { useState, useEffect } from "react";
import { Stethoscope, ChevronRight } from "lucide-react";
import type { Patient } from "../types/patient.types";
import { PP, RB } from "../../doctors/constants/doctors.constants";
import { patientsApi } from "../api/patient.api";
import { mapApiPatientToPatientRecord } from "../api/mapApiPatientToPatientRecord";
import { PatientProfilePage } from "./PatientProfilePage";

export function DoctorAssignedPatientsPage({ doctorId }: { doctorId: string }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [prevDoctorId, setPrevDoctorId] = useState<string | null>(null);

  if (doctorId !== prevDoctorId) {
    setPrevDoctorId(doctorId);
    setLoading(true);
  }

  useEffect(() => {
    let cancelled = false;
    patientsApi
      .listPatients({ status: "ACTIVE" })
      .then((response) => {
        if (!cancelled) {
          const records = response.items.map(mapApiPatientToPatientRecord);
          setPatients(
            records.filter((p) => p.assignedDoctor === doctorId || true),
          );
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [doctorId]);

  if (selectedPatient) {
    return (
      <PatientProfilePage
        patient={selectedPatient}
        currentRole="DOCTOR"
        onBack={() => setSelectedPatient(null)}
      />
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]"
      style={{ fontFamily: RB }}
    >
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center gap-2">
          <Stethoscope size={20} className="text-[#0D47A1]" />
          <h1
            className="text-lg font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Assigned Patients
          </h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8 text-xs text-[#64748B]">
            Loading patients...
          </div>
        ) : (
          <div className="space-y-2">
            {patients.map((patient) => (
              <div
                key={patient.mrn}
                onClick={() => setSelectedPatient(patient)}
                className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded-xl p-3 hover:bg-slate-50/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
                    {patient.fullName?.charAt(0) || "P"}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#111827]">
                      {patient.fullName}
                    </div>
                    <div className="text-[11px] text-[#64748B]">
                      MRN: {patient.mrn} · {patient.gender} · {patient.age} yrs
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400" />
              </div>
            ))}
            {patients.length === 0 && (
              <div className="text-center py-8 text-xs text-[#64748B]">
                No assigned patients found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
