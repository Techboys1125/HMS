import { useParams, useNavigate } from "react-router";
import { PatientProfilePage } from "../pages/PatientProfilePage";
import { useAuthStore } from "../../auth/store/auth.store";
import { useState, useEffect } from "react";
import { patientsApi } from "../api/patient.api";
import { mapApiPatientToPatientRecord } from "../api/mapApiPatientToPatientRecord";
import type { Patient } from "../types/patient.types";
import type { Role } from "../utils/patientPermissions";

export function PatientProfileRoute() {
  const { mrn } = useParams<{ mrn: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [patient, setPatient] = useState<Patient | null>(null);

  const role = String(user?.role ?? "ADMIN").toUpperCase();
  let currentRole: Role = "ADMIN";
  if (role === "RECEPTIONIST") currentRole = "RECEPTIONIST";
  else if (role === "DOCTOR") currentRole = "DOCTOR";
  else if (role === "NURSE") currentRole = "NURSE";
  else if (role === "PATIENT") currentRole = "PATIENT";
  else if (role === "ACCOUNTANT") currentRole = "ACCOUNTANT";

  useEffect(() => {
    if (!mrn) return;
    patientsApi
      .getPatientByMrn(mrn)
      .then((p) => setPatient(mapApiPatientToPatientRecord(p)))
      .catch(() => {});
  }, [mrn]);

  if (!mrn || !patient) return null;

  return (
    <PatientProfilePage
      patient={patient}
      currentRole={currentRole}
      onBack={() => navigate(-1)}
    />
  );
}
