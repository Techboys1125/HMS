/**
 * Family member types for the Patient Management module
 * Used by: FamilyMembersTab, PatientRegistrationForm (mode="family"), useFamilyMembers hook
 */

export type FamilyMemberRelationship =
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

export interface AddFamilyMemberRequest {
  name: string;
  relationship: string;
  gender?: string;
  dateOfBirth?: string;
  mobileNumber?: string;
  email?: string;
  bloodGroup?: string;
  address?:
    | {
        addressLine1?: string;
        addressLine2?: string;
        city?: string;
        state?: string;
        pincode?: string;
        country?: string;
      }
    | string;
  emergencyContact?: {
    name: string;
    relationship: string;
    mobileNumber: string;
  };
}

export interface UpdateFamilyMemberRequest extends Partial<AddFamilyMemberRequest> {
  id: string | number;
}

export interface FamilyMemberFormData {
  fullName: string;
  relationship: string;
  gender: string;
  dateOfBirth: string;
  mobileNumber: string;
  email: string;
  bloodGroup: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  ecName: string;
  ecRelationship: string;
  ecMobile: string;
}
