import { useState, useEffect } from "react";
import type { Patient } from "../types/patient.types";
import { PP } from "../../doctors/constants/doctors.constants";
import { patientsApi } from "../api/patient.api";
import { mapApiPatientToPatientRecord } from "../api/mapApiPatientToPatientRecord";
import type { Role } from "../utils/patientPermissions";
import { PatientProfileCenterScreen } from "./PatientProfileCenterScreen";
import { useAuthStore } from "../../auth/store/auth.store";

export function MyProfilePage({ mrn }: { currentRole: Role; mrn: string }) {
  const user = useAuthStore((s) => s.user);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [prevMrn, setPrevMrn] = useState<string | null>(null);

  if (mrn !== prevMrn) {
    setPrevMrn(mrn);
    setLoading(true);
  }

  useEffect(() => {
    let cancelled = false;
    patientsApi
      .getPatientByMrn(mrn)
      .then((data) => {
        if (!cancelled) setPatient(mapApiPatientToPatientRecord(data));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [mrn]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 bg-[#F1F5F9]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#0D47A1] border-t-transparent rounded-full animate-spin mx-auto" />
          <p
            className="text-xs font-semibold text-[#64748B]"
            style={{ fontFamily: PP }}
          >
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  const fallbackPatient: Patient = {
    id: user?.patientId || user?.id || 1,
    mrn: mrn || user?.mrn || "",
    fullName: user?.name || user?.fullName || "Patient",
    patientName: user?.name || user?.fullName || "Patient",
    name: user?.name || user?.fullName || "Patient",
    email: user?.email || "",
    phone: user?.phone || user?.mobileNumber || user?.mobile || "",
    gender: (user?.gender || "Female").toUpperCase(),
    status: "ACTIVE",
    dob:
      user?.dob ||
      (user as unknown as Record<string, string>)?.dateOfBirth ||
      "",
    dateOfBirth:
      user?.dob ||
      (user as unknown as Record<string, string>)?.dateOfBirth ||
      "",
    age: user?.age,
    photoUrl: user?.photoUrl || user?.photo || "",
    photo: user?.photoUrl || user?.photo || "",
    bloodGroup: (user as unknown as Record<string, string>)?.bloodGroup || "",
    address: user?.address || "",
    emergencyContact: {
      name: "",
      relationship: "",
      mobileNumber: "",
    },
  } as unknown as Patient;

  const basePatient = patient || fallbackPatient;
  const displayPatient: Patient = mapApiPatientToPatientRecord({
    ...basePatient,
    fullName:
      basePatient.fullName ||
      basePatient.patientName ||
      user?.name ||
      user?.fullName ||
      "Patient",
    email:
      (basePatient.email && basePatient.email !== "-"
        ? basePatient.email
        : "") ||
      user?.email ||
      "",
    phone:
      basePatient.phone ||
      basePatient.registeredMobile ||
      user?.phone ||
      user?.mobile ||
      "",
    photoUrl:
      basePatient.photoUrl ||
      basePatient.photo ||
      user?.photoUrl ||
      user?.photo ||
      "",
    photo:
      basePatient.photoUrl ||
      basePatient.photo ||
      user?.photoUrl ||
      user?.photo ||
      "",
    dob:
      basePatient.dob ||
      basePatient.dateOfBirth ||
      user?.dob ||
      (user as unknown as Record<string, string>)?.dateOfBirth ||
      "",
    dateOfBirth:
      basePatient.dateOfBirth ||
      basePatient.dob ||
      user?.dob ||
      (user as unknown as Record<string, string>)?.dateOfBirth ||
      "",
  });

  return (
    <>
      <PatientProfileCenterScreen activePatient={displayPatient} />
    </>
  );
}

export default MyProfilePage;
