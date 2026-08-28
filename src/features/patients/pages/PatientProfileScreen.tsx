import { useState, useEffect } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import type { PatientProfileScreenProps } from "../types/patient.types";
import type { Patient } from "../types/patient.types";
import { patientsApi } from "../api/patient.api";
import { mapApiPatientToPatientRecord } from "../api/mapApiPatientToPatientRecord";
import { PatientProfilePage } from "./PatientProfilePage";
import { useAuthStore } from "../../auth/store/auth.store";
import type { Role } from "../utils/patientPermissions";

export function PatientProfileScreen({
  onBack,
  onEditPatient,
  onBookAppointment,
  patientMrn = "",
}: PatientProfileScreenProps) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Record<string, unknown>[]>(
    [],
  );
  const [prescriptions, setPrescriptions] = useState<Record<string, unknown>[]>(
    [],
  );
  const [billing, setBilling] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(patientMrn ? true : false);
  const [error, setError] = useState<string | null>(
    !patientMrn ? "No patient MRN provided" : null,
  );

  const missingMrn = !patientMrn;

  useEffect(() => {
    if (missingMrn) return;

    let cancelled = false;

    async function fetchAll() {
      setLoading(true);
      setError(null);

      try {
        const [rawPatient, appts, rxBills, bills] = await Promise.allSettled([
          patientsApi.getPatientByMrn(patientMrn),
          patientsApi.getAppointments(patientMrn),
          patientsApi.getPrescriptions(patientMrn),
          patientsApi.getBilling(patientMrn),
        ]);

        if (cancelled) return;

        if (rawPatient.status === "fulfilled") {
          setPatient(mapApiPatientToPatientRecord(rawPatient.value));

          const safeArray = <T,>(val: unknown): T[] => {
            if (Array.isArray(val)) return val as T[];
            if (val && typeof val === "object") {
              const obj = val as Record<string, unknown>;
              if (Array.isArray(obj.content)) return obj.content as T[];
              if (Array.isArray(obj.data)) return obj.data as T[];
              if (Array.isArray(obj.items)) return obj.items as T[];
            }
            return [];
          };

          if (appts.status === "fulfilled")
            setAppointments(safeArray(appts.value));
          if (rxBills.status === "fulfilled")
            setPrescriptions(safeArray(rxBills.value));
          if (bills.status === "fulfilled") setBilling(safeArray(bills.value));
        } else {
          setError("Failed to load patient profile");
        }
      } catch {
        if (!cancelled) setError("Failed to load patient data");
      } finally {
        setLoading(false);
      }
    }

    void fetchAll();

    return () => {
      cancelled = true;
    };
  }, [patientMrn, missingMrn]);

  const userRole = useAuthStore((s) => s.user?.role);
  const normalizedRole: Role =
    String(userRole || "").toUpperCase() === "RECEPTIONIST"
      ? "RECEPTIONIST"
      : String(userRole || "").toUpperCase() === "NURSE"
        ? "NURSE"
        : String(userRole || "").toUpperCase() === "ACCOUNTANT"
          ? "ACCOUNTANT"
          : String(userRole || "").toUpperCase() === "PATIENT"
            ? "PATIENT"
            : String(userRole || "").toUpperCase() === "DOCTOR"
              ? "DOCTOR"
              : "ADMIN";

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]">
        <div className="flex items-center justify-center min-h-100">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="animate-spin text-[#0D47A1]" />
            <span className="text-sm text-slate-500 font-medium">
              Loading patient profile...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]">
        <div className="flex items-center justify-center min-h-100">
          <div className="flex flex-col items-center gap-3 text-center">
            <AlertTriangle size={32} className="text-red-400" />
            <span className="text-sm text-slate-600 font-medium">
              {error || "Patient not found"}
            </span>
            {onBack && (
              <button
                onClick={onBack}
                className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors cursor-pointer"
              >
                Go Back
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <PatientProfilePage
      patient={patient}
      currentRole={normalizedRole}
      onBack={onBack}
      onBookAppointment={onBookAppointment}
      onEdit={onEditPatient}
    />
  );
}
