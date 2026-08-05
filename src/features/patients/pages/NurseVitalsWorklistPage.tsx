import { useState, useEffect } from "react";
import { Activity, ChevronRight } from "lucide-react";
import { PP, RB } from "../../doctors/constants/doctors.constants";
import { patientsApi } from "../api/patient.api";
import { RecordPatientVitalsForm } from "../../vitals/components/RecordPatientVitalsForm";
import type { AppointmentRecord } from "../../appointments/types/appointment.types";

interface VitalsWaitingItem {
  mrn: string;
  fullName: string;
  age: number;
  gender: string;
  doctor: string;
  department: string;
  appointmentId: string;
}

const toAppointmentRecord = (item: VitalsWaitingItem): AppointmentRecord => ({
  id: item.appointmentId,
  patientId: item.mrn,
  patientName: item.fullName,
  patientMrn: item.mrn,
  mrn: item.mrn,
  doctorId: "",
  doctorName: item.doctor,
  appointmentDate: "",
  status: "WAITING_FOR_VITALS",
  department: item.department,
  patientAge: item.age,
  patientGender: item.gender,
});

export function NurseVitalsWorklistPage() {
  const [waitingPatients, setWaitingPatients] = useState<VitalsWaitingItem[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] =
    useState<VitalsWaitingItem | null>(null);

  const fetchWorklist = () => {
    setLoading(true);
    patientsApi
      .getNurseVitalsWaiting()
      .then((data) => setWaitingPatients(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let cancelled = false;
    patientsApi
      .getNurseVitalsWaiting()
      .then((data) => {
        if (!cancelled) setWaitingPatients(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (selectedPatient) {
    return (
      <RecordPatientVitalsForm
        activeApt={toAppointmentRecord(selectedPatient)}
        onBack={() => setSelectedPatient(null)}
        onMarkReady={() => {
          setSelectedPatient(null);
          fetchWorklist();
        }}
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
          <Activity size={20} className="text-[#0D47A1]" />
          <h1
            className="text-lg font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Patients Waiting for Vitals
          </h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8 text-xs text-[#64748B]">
            Loading worklist...
          </div>
        ) : (
          <div className="space-y-2">
            {waitingPatients.map((patient) => (
              <div
                key={patient.appointmentId}
                onClick={() => setSelectedPatient(patient)}
                className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded-xl p-3 hover:bg-slate-50/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                    {patient.fullName?.charAt(0) || "P"}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#111827]">
                      {patient.fullName}
                    </div>
                    <div className="text-[11px] text-[#64748B]">
                      MRN: {patient.mrn} · {patient.gender} · {patient.age} yrs
                      · {patient.department || "—"}
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400" />
              </div>
            ))}
            {waitingPatients.length === 0 && (
              <div className="text-center py-8 text-xs text-[#64748B]">
                No patients waiting for vitals.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
