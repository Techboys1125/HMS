import type { DoctorRecord } from "../types/doctors.types";
import type { Role } from "../utils/doctorPermissions";
import { DoctorProfileScreen } from "../components/DoctorProfileScreen";

export interface DoctorProfilePageProps {
  doctorId?: string;
  doctor?: DoctorRecord;
  currentRole?: Role | string;
  onBack: () => void;
}

export function DoctorProfilePage({ doctorId, doctor, onBack }: DoctorProfilePageProps) {
  return (
    <DoctorProfileScreen
      doctorId={doctorId}
      doctor={doctor}
      onBack={onBack}
    />
  );
}