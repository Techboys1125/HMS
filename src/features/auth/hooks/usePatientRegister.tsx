import { useState } from "react";
import { authService } from "../services/auth.service";
import { patientRegisterSchema } from "../validation/login.schema";
import type {
  PatientRegistrationData,
  PatientRegistrationResponse,
} from "../types/auth.types";
import { ZodError } from "zod";

export const usePatientRegister = (
  onSuccess: (response: PatientRegistrationResponse) => void,
) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const register = async (data: PatientRegistrationData) => {
    try {
      setLoading(true);
      setErrors({});

      // Validate schema
      patientRegisterSchema.parse(data);

      const response = await authService.registerPatient(data);
      onSuccess(response);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
      } else if (error instanceof Error) {
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
