import type {
  LoginCredentials,
  PatientRegistrationData,
  ForgotPasswordData,
} from "../types/auth.types";

export function loginSchema(data: LoginCredentials): string | null {
  if (!data.email || !data.email.trim()) return "Email is required";

  if (!/\S+@\S+\.\S+/.test(data.email)) return "Invalid email address";

  if (!data.password) return "Password is required";

  return null;
}

export function patientRegisterSchema(
  data: PatientRegistrationData,
): string | null {
  if (!data.fullName || !data.fullName.trim()) return "Full name is required";

  if (!data.email || !/\S+@\S+\.\S+/.test(data.email))
    return "Valid email is required";

  if (!data.mobile || data.mobile.trim().length < 8)
    return "Valid mobile number is required";

  if (!data.password || data.password.length < 6)
    return "Password must be at least 6 characters";

  if (data.password !== data.confirmPassword) return "Passwords do not match";

  return null;
}

export function forgotPasswordSchema(data: ForgotPasswordData): string | null {
  if (!data.email || !/\S+@\S+\.\S+/.test(data.email))
    return "Valid email is required";

  return null;
}
