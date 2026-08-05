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
  const [doctor, setDoctor] = useState<DoctorRecord | null>(
    initialDoctor || null,
  );

  useEffect(() => {
    if (
      initialDoctor &&
      initialDoctor.id &&
      (initialDoctor.department ||
        initialDoctor.specialty ||
        initialDoctor.qualification ||
        initialDoctor.experienceYrs)
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDoctor(initialDoctor);
      return;
    }
    if (initialDoctor) {
      setDoctor(initialDoctor);
    }
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
  }, [doctorId, initialDoctor]);

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
