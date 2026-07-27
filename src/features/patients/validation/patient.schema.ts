import { z } from "zod";

export const patientSchema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  dob: z
    .string()
    .nullable()
    .refine(
      (val) => !val || new Date(val) <= new Date(),
      "Date of birth cannot be in the future.",
    ),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  mobile: z
    .string()
    .regex(/^[+\d\s()-]{7,15}$/, "Invalid mobile number format."),
  email: z
    .string()
    .email("Enter a valid email address.")
    .optional()
    .or(z.literal("")),
  address: z.string().min(1, "Address is required."),
  bloodGroup: z.string().optional(),
  relationship: z.string().optional(),
});

export type PatientFormInput = z.infer<typeof patientSchema>;
