import { useState, useEffect } from "react";
import type { Patient } from "../types/patient.types";
import { PP } from "../../doctors/constants/doctors.constants";
import { patientsApi } from "../api/patient.api";
import { mapApiPatientToPatientRecord } from "../api/mapApiPatientToPatientRecord";
import type { Role } from "../utils/patientPermissions";
import { PatientProfileCenterScreen } from "./PatientProfileCenterScreen";
import { SwitchAccountDialog } from "../components/SwitchAccountDialog";
import { useSwitchAccount } from "../hooks/useSwitchAccount";
import { useFamilyMembers } from "../hooks/useFamilyMembers";
import { usePatientPortal } from "../context/usePatientPortal";
import { useAuthStore } from "../../auth";

export function MyProfilePage({
  currentRole: _currentRole,
  mrn,
}: {
  currentRole: Role;
  mrn: string;
}) {
  const user = useAuthStore((s) => s.user);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSwitchDialog, setShowSwitchDialog] = useState(false);
  const [prevEffectiveMrn, setPrevEffectiveMrn] = useState<string | null>(null);

  const { activeMrn, switchToFamilyMember, switchToPrimary } =
    useSwitchAccount(mrn);
  const portal = usePatientPortal();
  const { data: familyMembers } = useFamilyMembers(mrn, _currentRole === "PATIENT");
  const effectiveMrn = activeMrn || mrn;

  if (effectiveMrn !== prevEffectiveMrn) {
    setPrevEffectiveMrn(effectiveMrn);
    setLoading(true);
  }

  useEffect(() => {
    let cancelled = false;
    patientsApi
      .getPatientByMrn(effectiveMrn)
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
  }, [effectiveMrn]);

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
    mrn: effectiveMrn || user?.mrn || "MRN-2026717666",
    fullName: user?.name || user?.fullName || "Patient",
    patientName: user?.name || user?.fullName || "Patient",
    name: user?.name || user?.fullName || "Patient",
    email: user?.email || "patient@safehands.org",
    phone: user?.phone || user?.mobileNumber || user?.mobile || "",
    gender: (user?.gender || "FEMALE").toUpperCase() as any,
    status: "ACTIVE",
    dob: user?.dob || "2000-02-12",
    bloodGroup: "A_NEGATIVE",
    address: user?.address || "Springfield",
    emergencyContact: {
      name: "Emergency Contact",
      relationship: "SELF",
      mobileNumber: "",
    },
  } as unknown as Patient;

  const displayPatient = patient || fallbackPatient;

  return (
    <>
      <PatientProfileCenterScreen
        activePatient={displayPatient}
        currentRole={_currentRole}
        onSwitchPatient={
          _currentRole === "PATIENT"
            ? () => setShowSwitchDialog(true)
            : undefined
        }
      />

      {/* Switch Account Dialog */}
      <SwitchAccountDialog
        isOpen={showSwitchDialog}
        onClose={() => setShowSwitchDialog(false)}
        familyMembers={familyMembers || []}
        activeMrn={effectiveMrn}
        primaryMrn={mrn}
        onSwitchToMember={(member) => {
          switchToFamilyMember(member);
          portal?.refresh();
        }}
        onSwitchToPrimary={() => {
          switchToPrimary();
          portal?.refresh();
        }}
      />
    </>
  );
}

export default MyProfilePage;
