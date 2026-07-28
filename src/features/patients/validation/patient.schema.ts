import { z } from "zod";

export const patientSchema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  dateOfBirth: z
    .string()
    .nullable()
    .refine(
      (val) => !val || new Date(val) <= new Date(),
      "Date of birth cannot be in the future.",
    ),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  mobileNumber: z
    .string()
    .regex(/^[+\d\s()-]{7,15}$/, "Invalid mobile number format."),
  email: z
    .string()
    .email("Enter a valid email address.")
    .optional()
    .or(z.literal("")),
  bloodGroup: z.string().optional(),
  maritalStatus: z.string().optional(),
  nationalId: z.string().optional(),
  photoUrl: z.string().optional(),
  address: z
    .object({
      addressLine1: z.string().optional(),
      addressLine2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      pincode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  emergencyContact: z
    .object({
      name: z.string().min(1, "Emergency contact name is required."),
      relationship: z.string().min(1, "Relationship is required."),
      mobileNumber: z
        .string()
        .regex(/^[+\d\s()-]{7,15}$/, "Invalid emergency contact number."),
      alternativeMobileNumber: z.string().optional(),
    })
    .optional(),
  patientCategory: z.string().optional(),
  registrationType: z.string().optional(),
  knownAllergies: z.array(z.string()).optional(),
  chronicDiseases: z.array(z.string()).optional(),
  specialNotes: z.string().optional(),
});

export type PatientFormInput = z.infer<typeof patientSchema>;
