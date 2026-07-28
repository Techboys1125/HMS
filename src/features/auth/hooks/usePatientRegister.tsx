import { useState } from "react";
import { authService } from "../services/auth.service";
import { patientRegisterSchema } from "../validation/login.schema";
import type {
  PatientRegistrationData,
  PatientRegistrationResponse,
} from "../types/auth.types";

export const usePatientRegister = (
  onSuccess: (response: PatientRegistrationResponse) => void,
) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const register = async (data: PatientRegistrationData) => {
    try {
      setLoading(true);
      setErrors({});

      const validationError = patientRegisterSchema(data);
      if (validationError) {
        setErrors({ form: validationError });
        return;
      }

      const response = await authService.registerPatient(data);
      onSuccess(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrors({ form: error.message || "Registration failed" });
      } else {
        setErrors({ form: "Registration failed" });
      }
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, errors };
};
