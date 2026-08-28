import type { DoctorRecord } from "../types/doctors.types";
import type { AppPermission } from "../../../permissions/types";

export const PP = "Poppins, sans-serif";
export const RB = "Roboto, sans-serif";

export interface DoctorTableColumn {
  key?: keyof DoctorRecord;
  label: string;
  align?: string;
  perm?: AppPermission;
}

export const DOCTOR_TABLE_COLUMNS: DoctorTableColumn[] = [
  { key: "id", label: "Doctor ID" },
  { key: "name", label: "Doctor Name" },
  { key: "department", label: "Department" },
  { key: "specialty", label: "Specialty" },
  { key: "qualification", label: "Qualification" },
  { key: "experienceYrs", label: "Exp" },
  { key: "consultationFee", label: "Fee", perm: "DOCTOR_FEE_VIEW" },
  { key: "availability", label: "Availability" },
  { key: "status", label: "Status" },
  { label: "Actions", align: "text-right" },
];
