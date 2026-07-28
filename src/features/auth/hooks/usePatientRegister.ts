import { useState } from "react";
import { authService } from "../services/auth.service";
import { patientRegisterSchema } from "../validation/login.schema";
import type {
  PatientRegistrationData,
  PatientLinkData,
  PatientRegistrationResponse,
} from "../types/auth.types";

export function usePatientRegister(
  onSuccess?: (res: PatientRegistrationResponse) => void,
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const register = async (
    data: PatientRegistrationData,
  ): Promise<PatientRegistrationResponse | null> => {
    const valErr = patientRegisterSchema(data);
    if (valErr) {
      setError(valErr);
      setErrors({ form: valErr });
      return null;
    }

    setLoading(true);
    setError(null);
    setErrors({});

    try {
      const res = await authService.registerPatient(data);
      if (res && onSuccess) {
        onSuccess(res);
      }
      return res;
    } catch (err: any) {
      const msg = err.message || "Failed to register patient";
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
    } catch (err: any) {
      const msg = err.message || "Failed to link patient account";
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
}
