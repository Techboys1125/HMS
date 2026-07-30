import type { ReceptionPermissions } from "../types/reception.types";

export const getReceptionPermissions = (role?: string): ReceptionPermissions => {
  const normalizedRole = (role || "").toUpperCase();

  switch (normalizedRole) {
    case "ADMIN":
    case "SUPER_ADMIN":
      return {
        canViewWorklist: true,
        canCheckInPatient: true,
        canGenerateToken: true,
        canRegisterWalkIn: true,
        canPrintVisitSlip: true,
        canUpdateBillingStatus: true,
        canCancelQueueItem: true,
        canViewClinicalNotes: true,
      };

    case "RECEPTIONIST":
    case "FRONT_DESK":
    case "RECEPTION":
      return {
        canViewWorklist: true,
        canCheckInPatient: true,
        canGenerateToken: true,
        canRegisterWalkIn: true,
        canPrintVisitSlip: true,
        canUpdateBillingStatus: true,
        canCancelQueueItem: true,
        canViewClinicalNotes: false, // Strict SRS FR-007 rule: no restricted clinical notes
      };

    case "NURSE":
      return {
        canViewWorklist: true,
        canCheckInPatient: true,
        canGenerateToken: true,
        canRegisterWalkIn: false,
        canPrintVisitSlip: true,
        canUpdateBillingStatus: false,
        canCancelQueueItem: false,
        canViewClinicalNotes: true,
      };

    case "DOCTOR":
      return {
        canViewWorklist: true,
        canCheckInPatient: false,
        canGenerateToken: false,
        canRegisterWalkIn: false,
        canPrintVisitSlip: true,
        canUpdateBillingStatus: false,
        canCancelQueueItem: false,
        canViewClinicalNotes: true,
      };

    default:
      return {
        canViewWorklist: true,
        canCheckInPatient: true,
        canGenerateToken: true,
        canRegisterWalkIn: true,
        canPrintVisitSlip: true,
        canUpdateBillingStatus: true,
        canCancelQueueItem: false,
        canViewClinicalNotes: false,
      };
  }
};
