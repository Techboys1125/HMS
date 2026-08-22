/**
 * Family Service – Business logic for family member management
 * Handles CRUD operations and switch account logic
 */
import { patientsApi } from "../api/patient.api";
import type { ApiPatientFamilyMember } from "../types/patient.types";
import type {
  FamilyMember,
  AddFamilyMemberRequest,
} from "../types/family.types";

function mapApiToFamilyMember(api: ApiPatientFamilyMember): FamilyMember {
  return {
    id: api.id != null ? String(api.id) : "",
    name: api.name,
    fullName: api.name,
    patientName: api.name,
    relationship: api.relationship || "OTHER",
    mobileNumber: api.mobileNumber || api.phone || "",
    email: api.email || "",
    isPrimary: api.isPrimary ?? false,
    status: "ACTIVE",
    verificationStatus: "PENDING",
    mrn: "",
    age: 0,
    registeredMobile: "",
    patientStatus: "",
    lastAppointment: "",
    upcomingAppointmentsCount: 0,
    pendingBillsCount: 0,
    pendingBillsAmount: 0,
    activePrescriptionsCount: 0,
  };
}

export const familyService = {
  /**
   * Get all family members for a patient
   */
  async getFamilyMembers(mrn: string): Promise<FamilyMember[]> {
    const raw = await patientsApi.getFamilyMembers(mrn);
    return (raw || []).map(mapApiToFamilyMember);
  },

  /**
   * Add a family member using full registration data
   * POST /api/v1/patients/{mrn}/family-members
   */
  async addFamilyMember(
    mrn: string,
    data: AddFamilyMemberRequest,
  ): Promise<FamilyMember | null> {
    const payload: Record<string, unknown> = {
      name: data.name,
      relationship: data.relationship,
      mobileNumber: data.mobileNumber || "",
      email: data.email || "",
      gender: data.gender || "",
      dateOfBirth: data.dateOfBirth || "",
      bloodGroup: data.bloodGroup || "",
    };

    if (data.address && typeof data.address === "object") {
      payload.address = data.address;
    }
    if (data.emergencyContact) {
      payload.emergencyContact = data.emergencyContact;
    }

    const result = await patientsApi.addFamilyMember(mrn, payload);
    return result ? mapApiToFamilyMember(result) : null;
  },

  async linkFamilyMember(
    primaryUserId: number,
    familyUserId: number,
    relationship: string,
  ): Promise<FamilyMember | null> {
    const result = await patientsApi.linkFamilyMember(
      primaryUserId,
      familyUserId,
      relationship,
    );
    return result ? mapApiToFamilyMember(result) : null;
  },

  /**
   * Update a family member
   */
  async updateFamilyMember(
    mrn: string,
    memberId: string,
    data: Partial<AddFamilyMemberRequest>,
  ): Promise<FamilyMember | null> {
    const payload: Record<string, unknown> = {};
    if (data.name) payload.name = data.name;
    if (data.relationship) payload.relationship = data.relationship;
    if (data.mobileNumber) payload.mobileNumber = data.mobileNumber;
    if (data.email) payload.email = data.email;
    if (data.gender) payload.gender = data.gender;
    if (data.dateOfBirth) payload.dateOfBirth = data.dateOfBirth;
    if (data.bloodGroup) payload.bloodGroup = data.bloodGroup;

    const result = await patientsApi.updateFamilyMember(mrn, memberId, payload);
    return result ? mapApiToFamilyMember(result) : null;
  },

  /**
   * Delete a family member
   */
  async deleteFamilyMember(mrn: string, memberId: string): Promise<boolean> {
    return patientsApi.deleteFamilyMember(mrn, memberId);
  },
};
