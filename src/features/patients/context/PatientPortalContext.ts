import { createContext } from "react";
import type { FamilyMember } from "../pages/FamilyMembersManagement";

export const SWITCH_ACCOUNT_STORAGE_KEY = "hms-active-patient-mrn";

export interface PatientPortalContextValue {
  familyMembers: FamilyMember[];
  activePatient: FamilyMember | null;
  activeMrn: string | null;
  primaryMrn: string | null;
  isLoading: boolean;
  switchToPatient: (member: FamilyMember) => void;
  refresh: () => void;
}

export const PatientPortalContext =
  createContext<PatientPortalContextValue | null>(null);
