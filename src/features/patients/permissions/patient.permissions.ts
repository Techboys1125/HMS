import { usePermissions } from "../../../permissions";

export const patientPermissionMap = {
  view: "PATIENT_VIEW",
  create: "PATIENT_CREATE",
  edit: "PATIENT_EDIT",
  history: "PATIENT_VIEW_HISTORY",
  statusUpdate: "PATIENT_STATUS_UPDATE",
  duplicateOverride: "PATIENT_DUPLICATE_OVERRIDE",
  merge: "PATIENT_MERGE",
  viewSelf: "PATIENT_VIEW_SELF",
  editSelf: "PATIENT_EDIT_SELF",
} as const;

export const usePatientPermissions = () => {
  const permissions = usePermissions();
  return {
    ...permissions,
    canViewPatients: permissions.can(patientPermissionMap.view),
    canCreatePatients: permissions.can(patientPermissionMap.create),
    canEditPatients: permissions.can(patientPermissionMap.edit),
    canViewPatientHistory: permissions.can(patientPermissionMap.history),
    canUpdatePatientStatus: permissions.can(patientPermissionMap.statusUpdate),
    canOverrideDuplicates: permissions.can(
      patientPermissionMap.duplicateOverride,
    ),
    canMergePatients: permissions.can(patientPermissionMap.merge),
    canViewOwnPatient: permissions.can(patientPermissionMap.viewSelf),
    canEditOwnPatient: permissions.can(patientPermissionMap.editSelf),
  };
};
