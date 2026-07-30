import type { WalkInRegistrationPayload } from "../types/reception.types";

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateWalkInRegistration = (
  payload: Partial<WalkInRegistrationPayload>
): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!payload.fullName || !payload.fullName.trim()) {
    errors.fullName = "Full name is required";
  }

  if (!payload.mobile || !payload.mobile.trim()) {
    errors.mobile = "Mobile number is required";
  } else if (!/^\+?[0-9]{10,14}$/.test(payload.mobile.replace(/\s+/g, ""))) {
    errors.mobile = "Valid 10-digit mobile number required";
  }

  if (!payload.departmentId) {
    errors.departmentId = "Department selection is required";
  }

  if (!payload.doctorId) {
    errors.doctorId = "Doctor selection is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
