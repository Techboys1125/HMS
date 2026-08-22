import type { DoctorRecord } from "../types/doctors.types";

export interface AddDoctorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newDoctor: DoctorRecord) => void;
  totalDoctorCount: number;
}
