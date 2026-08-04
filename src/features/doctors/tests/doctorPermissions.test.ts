import { can, normalizeRole } from "../utils/doctorPermissions";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export function runDoctorPermissionsTests() {
  console.log("Running doctorPermissions tests...");

  // Test role normalization
  assert(normalizeRole("admin") === "ADMIN", "normalizeRole('admin') should be 'ADMIN'");
  assert(normalizeRole("HOSPITAL_ADMIN") === "ADMIN", "normalizeRole('HOSPITAL_ADMIN') should be 'ADMIN'");
  assert(normalizeRole("doctor") === "DOCTOR", "normalizeRole('doctor') should be 'DOCTOR'");
  assert(normalizeRole("receptionist") === "RECEPTIONIST", "normalizeRole('receptionist') should be 'RECEPTIONIST'");
  assert(normalizeRole("patient") === "PATIENT", "normalizeRole('patient') should be 'PATIENT'");

  // Admin permissions
  assert(can("ADMIN", "list") === true, "Admin can list doctors");
  assert(can("ADMIN", "deactivate") === true, "Admin can deactivate doctor");
  assert(can("ADMIN", "editProfile") === true, "Admin can edit profile");
  assert(can("ADMIN", "manageExceptions") === true, "Admin can manage exceptions");

  // Receptionist permissions
  assert(can("RECEPTIONIST", "list") === true, "Receptionist can view doctor list");
  assert(can("RECEPTIONIST", "viewProfile") === true, "Receptionist can view doctor profile");
  assert(can("RECEPTIONIST", "editProfile") === false, "Receptionist cannot edit doctor profile");
  assert(can("RECEPTIONIST", "deactivate") === false, "Receptionist cannot deactivate doctor");
  assert(can("RECEPTIONIST", "manageExceptions") === false, "Receptionist cannot manage exceptions");

  // Doctor permissions (own vs other)
  assert(can("DOCTOR", "list") === false, "Doctor cannot list all doctors");
  assert(can("DOCTOR", "deactivate") === false, "Doctor cannot deactivate self or others");
  assert(can("DOCTOR", "editProfile", true) === true, "Doctor can edit own profile");
  assert(can("DOCTOR", "editProfile", false) === false, "Doctor cannot edit other doctor's profile");
  assert(can("DOCTOR", "manageExceptions", true) === true, "Doctor can manage own exceptions");
  assert(can("DOCTOR", "manageExceptions", false) === false, "Doctor cannot manage other's exceptions");

  // Patient permissions
  assert(can("PATIENT", "list") === true, "Patient can view directory list");
  assert(can("PATIENT", "viewProfile") === true, "Patient can view public profile");
  assert(can("PATIENT", "editProfile") === false, "Patient cannot edit profile");
  assert(can("PATIENT", "viewAppointments") === false, "Patient cannot view doctor internal appointments");
  assert(can("PATIENT", "manageExceptions") === false, "Patient cannot manage exceptions");

  console.log("✅ doctorPermissions tests passed!");
}

try {
  runDoctorPermissionsTests();
} catch (e) {
  console.error("Test failed:", e);
}
