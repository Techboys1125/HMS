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
  verificationStatus: string;
  patientName?: string | null;
  id: string | number;
  mrn?: string;
  name: string;
  fullName?: string;
  relationship: FamilyMemberRelationship | string;
  gender?: string;
  dateOfBirth?: string;
  age?: number;
  mobileNumber?: string;
  phone?: string;
  email?: string;
  bloodGroup?: string;
  isPrimary?: boolean;
  status?: string;
  photoUrl?: string;
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

export const FAMILY_RELATIONSHIP_OPTIONS: Array<{
  value: FamilyMemberRelationship;
  label: string;
}> = [
  { value: "FATHER", label: "Father" },
  { value: "MOTHER", label: "Mother" },
  { value: "SPOUSE", label: "Spouse" },
  { value: "SON", label: "Son" },
  { value: "DAUGHTER", label: "Daughter" },
  { value: "BROTHER", label: "Brother" },
  { value: "SISTER", label: "Sister" },
  { value: "GRANDFATHER", label: "Grandfather" },
  { value: "GRANDMOTHER", label: "Grandmother" },
  { value: "GUARDIAN", label: "Guardian" },
  { value: "OTHER", label: "Other" },
];
