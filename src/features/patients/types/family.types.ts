/**
 * Family member types for the Patient Management module
 * Used by: FamilyMembersTab, PatientRegistrationForm (mode="family"), useFamilyMembers hook
 */

type FamilyMemberRelationship =
  | "SELF"
  | "FATHER"
  | "MOTHER"
  | "SPOUSE"
  | "SON"
  | "DAUGHTER"
  | "BROTHER"
  | "SISTER"
  | "GRANDFATHER"
  | "GRANDMOTHER"
  | "GUARDIAN"
  | "OTHER";

export interface FamilyMember {
  id: string;
  name: string;
  patientName: string;
  mrn: string;
  relationship: FamilyMemberRelationship | string;
  gender?: string;
  dateOfBirth?: string;
  age: number;
  mobileNumber?: string;
  phone?: string;
  email?: string;
  bloodGroup?: string;
  isPrimary?: boolean;
  status?: string;
  photoUrl?: string;
  fullName?: string;

  // Fields from FamilyMembersManagement
  knownAllergies?: string[];
  registeredMobile: string;
  verificationStatus: string;
  patientStatus: string;
  lastAppointment: string;
  avatarBg?: string;
  upcomingAppointmentsCount: number;
  pendingBillsCount: number;
  pendingBillsAmount: number;
  activePrescriptionsCount: number;
  lastConsultationDate?: string;
  primaryDoctor?: string;
  latestBillId?: string;
  latestBillAmount?: number;
}
