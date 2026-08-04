/**
 * usePatientProfile – Hook combining patient data with role-based permissions
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { patientService } from "../services/patient.service";
import { patientKeys } from "./usePatients";
import type { RoleFieldPermissions } from "../types/patient.types";
import { ROLE_FIELD_PERMISSIONS } from "../types/patient.types";

export function usePatientProfile(mrn: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: patientKeys.detail(mrn),
    queryFn: () => patientService.getPatientProfile(mrn),
    enabled: !!mrn,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      patientService.updatePatientProfile(mrn, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.detail(mrn) });
      queryClient.invalidateQueries({ queryKey: patientKeys.all });
    },
  });

  return {
    patient: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    updateProfile: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
}

/**
 * Get field permissions for a given role
 */
export function useFieldPermissions(role: string): RoleFieldPermissions {
  const roleKey = role.toUpperCase();
  return ROLE_FIELD_PERMISSIONS[roleKey] || ROLE_FIELD_PERMISSIONS["PATIENT"];
}

/**
 * Check if a specific field is editable for the given role and mode
 */
export function isFieldEditable(
  field: string,
  role: string,
  mode: "register" | "edit" | "family" | "self",
): boolean {
  const permissions = ROLE_FIELD_PERMISSIONS[role.toUpperCase()];
  if (!permissions) return false;

  // Always read-only fields
  if (permissions.alwaysReadOnly.includes(field)) return false;

  // In register/family mode, admins and receptionists can edit all their editable fields
  if (mode === "register" || mode === "family") {
    return permissions.editableFields.includes(field);
  }

  // In edit mode, respect role permissions
  if (mode === "edit") {
    return permissions.editableFields.includes(field);
  }

  // In self mode, patient can only edit their allowed fields
  if (mode === "self") {
    const selfPerms = ROLE_FIELD_PERMISSIONS["PATIENT"];
    return selfPerms.editableFields.includes(field);
  }

  return false;
}

/**
 * Check if a field is visible for the given role
 */
export function isFieldVisible(field: string, role: string): boolean {
  const permissions = ROLE_FIELD_PERMISSIONS[role.toUpperCase()];
  if (!permissions) return true;
  return !permissions.hiddenFields.includes(field);
}
