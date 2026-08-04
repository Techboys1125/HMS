import { useParams } from "react-router";
import { PatientProfilePage } from "../pages/PatientProfilePage";
import { useAuthStore } from "../../auth/index";
import { useState, useEffect } from "react";
import { patientsApi } from "../api/patient.api";
import { mapApiPatientToPatientRecord } from "../api/mapApiPatientToPatientRecord";

export function PatientProfileRoute() {
  const { mrn } = useParams<{ mrn: string }>();
  const user = useAuthStore((state) => state.user);
  const [currentRole, setCurrentRole] = useState<string>("ADMIN");
  const [patient, setPatient] = useState<any>(null);

  useEffect(() => {
    const role = String(user?.role ?? "ADMIN").toUpperCase();
    if (role === "RECEPTIONIST") setCurrentRole("RECEPTIONIST");
    else if (role === "DOCTOR") setCurrentRole("DOCTOR");
    else if (role === "NURSE") setCurrentRole("NURSE");
    else if (role === "PATIENT") setCurrentRole("PATIENT");
    else if (role === "ACCOUNTANT") setCurrentRole("ACCOUNTANT");
    else setCurrentRole("ADMIN");
  }, [user?.role]);

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
      currentRole={currentRole as any}
      onBack={() => {}}
    />
  );
}
