import { z } from "zod";

export const patientSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  dob: z
    .string()
    .nullable()
    .refine(
      (val) => !val || new Date(val) <= new Date(),
      "Date of birth cannot be in the future.",
    ),
  ageBasis: z.enum(["EXACT", "APPROXIMATE"]),
  approximateAge: z.number().min(0).max(150).optional(),
  gender: z.enum(["Male", "Female", "Other"]),
  mobile: z
    .string()
    .regex(/^[+\d\s()-]{7,15}$/, "Invalid mobile number format."),
  email: z
    .string()
    .email("Enter a valid email address.")
    .optional()
    .or(z.literal("")),
  address: z.string().min(1, "Address is required."),
  emergencyContact: z.object({
    name: z.string().min(1, "Emergency contact name is required."),
    relationship: z.string().min(1),
    mobile: z
      .string()
      .regex(/^[+\d\s()-]{7,15}$/, "Invalid mobile number format."),
  }),
});

export type PatientFormInput = z.infer<typeof patientSchema>;
