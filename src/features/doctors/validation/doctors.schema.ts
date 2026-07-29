import type { DoctorRecord } from "../types/doctors.types";

export function validateDoctorForm(data: Partial<DoctorRecord>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.name?.trim()) errors.name = "Full Name is required.";
  if (!data.phone?.trim()) errors.phone = "Phone number is required.";
  if (!data.email?.trim() || !data.email.includes("@"))
    errors.email = "Valid email address is required.";
  if (!data.regNumber?.trim())
    errors.regNumber = "Medical registration number is required.";
  if (!data.qualification?.trim())
    errors.qualification = "Qualification is required.";
  if (data.experienceYrs === undefined || data.experienceYrs < 0)
    errors.experienceYrs = "Years of experience is required.";
  if (!data.department) errors.department = "Department is required.";
  if (!data.specialty?.trim()) errors.specialty = "Specialty is required.";
  if (data.consultationFee === undefined || data.consultationFee <= 0)
    errors.consultationFee = "Consultation fee is required.";

  return errors;
}

export function validatePrescriptionForm(data: {
  diagnosis?: string;
  medicines?: Array<{ name?: string; dosage?: string; frequency?: string; duration?: string }>;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.diagnosis?.trim()) errors.diagnosis = "Diagnosis is required";

  data.medicines?.forEach((m, idx) => {
    if (!m.name?.trim()) errors[`med_${idx}_name`] = `Medicine #${idx + 1} name required`;
    if (!m.dosage?.trim()) errors[`med_${idx}_dosage`] = `Dosage required`;
    if (!m.frequency?.trim()) errors[`med_${idx}_frequency`] = `Frequency required`;
    if (!m.duration?.trim()) errors[`med_${idx}_duration`] = `Duration required`;
  });

  return errors;
}
