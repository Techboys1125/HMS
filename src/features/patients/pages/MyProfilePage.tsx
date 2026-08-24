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

  let customSaved: Record<string, unknown> = {};
  try {
    const keys = [mrn, user?.mrn, user?.id, "me"].filter(Boolean);
    for (const k of keys) {
      const stored = localStorage.getItem(`patient_profile_custom_${k}`);
      if (stored) {
        customSaved = { ...customSaved, ...JSON.parse(stored) };
      }
    }
  } catch {
    // Ignore
  }

  const fallbackPatient: Patient = {
    id: user?.patientId || user?.id || 1,
    mrn: mrn || user?.mrn || "MRN-2026717666",
    fullName:
      (customSaved.name as string) || user?.name || user?.fullName || "",
    patientName:
      (customSaved.name as string) || user?.name || user?.fullName || "",
    name: (customSaved.name as string) || user?.name || user?.fullName || "",
    email: (customSaved.email as string) || user?.email || "",
    phone:
      (customSaved.phone as string) ||
      user?.phone ||
      user?.mobileNumber ||
      user?.mobile ||
      "",
    gender: (
      (customSaved.gender as string) ||
      user?.gender ||
      ""
    ).toUpperCase(),
    status: "ACTIVE",
    dob: (customSaved.dob as string) || user?.dob || "",
    bloodGroup: (customSaved.bloodGroup as string) || "",
    address: (customSaved.address as string) || user?.address || "",
    emergencyContact: {
      name: (customSaved.emergencyName as string) || "",
      relationship: (customSaved.emergencyRelation as string) || "",
      mobileNumber: (customSaved.emergencyPhone as string) || "",
    },
  } as unknown as Patient;

  const basePatient = patient || fallbackPatient;
  const displayPatient: Patient = {
    ...basePatient,
    fullName:
      (customSaved.name as string) ||
      basePatient.fullName ||
      basePatient.patientName,
    patientName:
      (customSaved.name as string) ||
      basePatient.patientName ||
      basePatient.fullName,
    name:
      (customSaved.name as string) || basePatient.name || basePatient.fullName,
    email:
      (customSaved.email as string) ||
      (basePatient.email && basePatient.email !== "-"
        ? basePatient.email
        : "") ||
      user?.email ||
      "",
    phone:
      (customSaved.phone as string) ||
      basePatient.phone ||
      basePatient.registeredMobile,
    registeredMobile:
      (customSaved.phone as string) ||
      basePatient.registeredMobile ||
      basePatient.phone,
    gender: (customSaved.gender as string) || basePatient.gender,
    dob: (customSaved.dob as string) || basePatient.dob,
    bloodGroup: (customSaved.bloodGroup as string) || basePatient.bloodGroup,
    address: (customSaved.address as string) || basePatient.address,
    emergencyContact: {
      name:
        (customSaved.emergencyName as string) ||
        basePatient.emergencyContact?.name ||
        "Emergency Contact",
      relationship:
        (customSaved.emergencyRelation as string) ||
        basePatient.emergencyContact?.relationship ||
        "SELF",
      mobileNumber:
        (customSaved.emergencyPhone as string) ||
        basePatient.emergencyContact?.mobileNumber ||
        "",
    },
  } as unknown as Patient;

  return (
    <>
      <PatientProfileCenterScreen activePatient={displayPatient} />
    </>
  );
}

export default MyProfilePage;
