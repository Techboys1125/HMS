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

export function validatePatientRegisterForm(
  data: PatientRegistrationData,
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.fullName || !data.fullName.trim()) {
    errors.fullName = "Full Name * is required";
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = "Full name must be at least 2 characters";
  }

  // Email is explicitly Optional. Validate format only if user enters something.
  if (data.email && data.email.trim().length > 0) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errors.email = "Please enter a valid email address";
    }
  }

  const cleanMobile = (data.mobile || "").replace(/\D/g, "");
  if (!data.mobile || !data.mobile.trim()) {
    errors.mobile = "Phone Number * is required";
  } else if (cleanMobile.length !== 10) {
    errors.mobile = "Please enter a valid 10-digit mobile number";
  }

  if (data.dateOfBirth) {
    const dob = new Date(data.dateOfBirth);
    const today = new Date();
    if (isNaN(dob.getTime())) {
      errors.dateOfBirth = "Please enter a valid date of birth";
    } else if (dob > today) {
      errors.dateOfBirth = "Date of birth cannot be in the future";
    }
  }

  if (!data.password) {
    errors.password = "Password * is required";
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = "Confirm Password * is required";
  } else if (data.password && data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

export function forgotPasswordSchema(data: ForgotPasswordData): string | null {
  if (!data.email || !/\S+@\S+\.\S+/.test(data.email))
    return "Valid email is required";

  return null;
}
