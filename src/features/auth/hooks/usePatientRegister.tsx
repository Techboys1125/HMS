import { useState } from "react";
import { authService } from "../services/auth.service";
import { patientRegisterSchema } from "../validation/login.schema";
import type {
  PatientRegistrationData,
  PatientLinkData,
  PatientRegistrationResponse,
} from "../types/auth.types";

export const usePatientRegister = (
  onSuccess?: (response: PatientRegistrationResponse) => void,
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const register = async (
    data: PatientRegistrationData,
  ): Promise<PatientRegistrationResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      setErrors({});

      const validationError = patientRegisterSchema(data);
      if (validationError) {
        setError(validationError);
        setErrors({ form: validationError });
        return null;
      }

      const response = await authService.registerPatient(data);
      if (response && onSuccess) {
        onSuccess(response);
      }
      return response;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message || "Registration failed"
          : "Registration failed";
      setError(msg);
      setErrors({ form: msg });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const linkExisting = async (
    data: PatientLinkData,
  ): Promise<PatientRegistrationResponse | null> => {
    if (
      !data.mrn ||
      !data.mobile ||
      !data.password ||
      data.password !== data.confirmPassword
    ) {
      const msg = "Please fill all fields and ensure passwords match.";
      setError(msg);
      setErrors({ form: msg });
      return null;
    }

    setLoading(true);
    setError(null);
    setErrors({});

    try {
      const res = await authService.linkPatient(data);
      if (res && onSuccess) {
        onSuccess(res);
      }
      return res;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to link patient account";
      setError(msg);
      setErrors({ form: msg });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    linkExisting,
    loading,
    error,
    errors,
    setError,
    setErrors,
  };
};
