import { useState } from "react";
import { authService } from "../services/auth.service";
import { loginSchema } from "../validation/login.schema";
import type { LoginCredentials, LoginResponse } from "../types/auth.types";
import { ZodError } from "zod";

export const useLogin = (onSuccess: (response: LoginResponse) => void) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});

  const login = async (data: LoginCredentials) => {
    try {
      setLoading(true);
      setErrors({});

      // Validate
      loginSchema.parse(data);

      const response = await authService.login(data);
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
        setErrors({ form: error.message || "Login failed" });
      } else {
        setErrors({ form: "Login failed" });
      }
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, errors };
};
