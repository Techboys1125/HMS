import {
  validateDoctorForm,
  validatePrescriptionForm,
} from "../validation/doctors.schema";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export function runDoctorsSchemaTests() {
  console.log("Running doctors.schema tests...");

  // Test empty doctor form
  const emptyErrors = validateDoctorForm({});
  assert(Boolean(emptyErrors.name), "Empty form should require name");
  assert(Boolean(emptyErrors.phone), "Empty form should require phone");
  assert(Boolean(emptyErrors.email), "Empty form should require email");
  assert(Boolean(emptyErrors.regNumber), "Empty form should require regNumber");
  assert(
    Boolean(emptyErrors.qualification),
    "Empty form should require qualification",
  );
  assert(
    Boolean(emptyErrors.department),
    "Empty form should require department",
  );
  assert(Boolean(emptyErrors.specialty), "Empty form should require specialty");
  assert(
    Boolean(emptyErrors.consultationFee),
    "Empty form should require consultationFee",
  );

  // Test valid doctor form
  const validErrors = validateDoctorForm({
    name: "Dr. Jane Smith",
    phone: "9876543210",
    email: "jane@hospital.com",
    regNumber: "REG-12345",
    qualification: "MBBS, MD",
    experienceYrs: 8,
    department: "Pediatrics",
    specialty: "General Pediatrics",
    consultationFee: 150,
  });
  assert(
    Object.keys(validErrors).length === 0,
    "Valid form should have zero errors",
  );

  // Test invalid fee (negative or 0)
  const invalidFeeErrors = validateDoctorForm({
    name: "Dr. Jane Smith",
    phone: "9876543210",
    email: "jane@hospital.com",
    regNumber: "REG-12345",
    qualification: "MBBS, MD",
    experienceYrs: 8,
    department: "Pediatrics",
    specialty: "General Pediatrics",
    consultationFee: -10,
  });
  assert(
    Boolean(invalidFeeErrors.consultationFee),
    "Negative consultation fee should produce error",
  );

  // Test prescription validation
  const emptyRxErrors = validatePrescriptionForm({});
  assert(
    Boolean(emptyRxErrors.diagnosis),
    "Prescription form should require diagnosis",
  );

  console.log("✅ doctors.schema tests passed!");
}

try {
  runDoctorsSchemaTests();
} catch (e) {
  console.error("Test failed:", e);
}
