import type { DoctorRecord } from "../types/doctors.types";
import type { Role } from "../utils/doctorPermissions";
import { DoctorProfileScreen } from "../components/DoctorProfileScreen";
import { useAuthStore } from "../../auth/index";
import { useState, useEffect } from "react";
import { doctorProfileService } from "../services/doctorProfile.service";

export interface DoctorProfilePageProps {
  doctorId: string;
  doctor?: DoctorRecord;
  currentRole: Role | string;
  onBack: () => void;
}

export function DoctorProfilePage({
  doctorId,
  doctor: initialDoctor,
  currentRole,
  onBack,
}: DoctorProfilePageProps) {
  const user = useAuthStore((state) => state.user);
  const userDoctorId =
    user?.doctorId ?? user?.doctorProfile?.doctorId ?? user?.id ?? "";
  const isOwnRecord =
    String(currentRole).toUpperCase() === "DOCTOR"
      ? !doctorId ||
        doctorId === "me" ||
        String(doctorId) === String(userDoctorId)
      : String(doctorId) === String(userDoctorId);
  const hasCompleteInitialDoctor = initialDoctor?.id && (
    initialDoctor.department ||
    initialDoctor.specialty ||
    initialDoctor.qualification ||
    initialDoctor.experienceYrs
  );

  const [doctor, setDoctor] = useState<DoctorRecord | null>(() => {
    if (hasCompleteInitialDoctor) {
      return initialDoctor;
    }
    return initialDoctor ?? null;
  });

  useEffect(() => {
    if (hasCompleteInitialDoctor) return;

    let cancelled = false;
    doctorProfileService
      .getDoctorProfile(doctorId)
      .then((record) => {
        if (!cancelled && record) setDoctor(record);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [doctorId, hasCompleteInitialDoctor]);

  return (
    <DoctorProfileScreen
      doctor={doctor ?? undefined}
      doctorId={doctorId}
      currentRole={currentRole}
      isOwnRecord={isOwnRecord}
      onBack={onBack}
    />
  );
}
