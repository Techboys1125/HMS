import { mapApiUserToDoctorRecord, mapDoctorToUpdatePayload } from "../api/mapApiUserToDoctorRecord";
import type { ApiUserDoctorRecord } from "../types/doctors.types";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export function runMapApiUserToDoctorRecordTests() {
  console.log("Running mapApiUserToDoctorRecord tests...");

  const sampleUser: ApiUserDoctorRecord = {
    userId: 101,
    employeeId: "EMP-101",
    fullName: "John Doe",
    email: "john.doe@hospital.com",
    mobile: "+1234567890",
    gender: "Male",
    dateOfBirth: "1980-05-15",
    residentialAddress: "123 Health Ave",
    professionalBio: "Experienced cardiologist",
    role: "DOCTOR",
    status: "ACTIVE",
    doctorProfile: {
      doctorId: 501,
      medicalRegistrationNumber: "REG-99988",
      qualification: "MD, Cardiology",
      yearsOfExperience: 12,
      primaryDepartment: {
        departmentId: 1,
        departmentName: "Cardiology",
      },
      primarySpecialty: {
        specialtyId: 2,
        specialtyName: "Interventional Cardiology",
      },
      consultationFee: 200,
      followUpFee: 100,
      slotDurationMinutes: 20,
      availability: [
        { dayOfWeek: "MONDAY", startTime: "09:00", endTime: "17:00" },
        { dayOfWeek: "WEDNESDAY", startTime: "09:00", endTime: "17:00" },
      ],
      scheduleExceptions: [],
    },
  };

  const record = mapApiUserToDoctorRecord(sampleUser);

  assert(record.id === "DOC-101", "ID should be formatted DOC-101");
  assert(record.userId === 101, "userId should be 101");
  assert(record.doctorId === 501, "doctorId should be 501");
  assert(record.empId === "EMP-101", "empId should match employeeId");
  assert(record.regNumber === "REG-99988", "regNumber should match medicalRegistrationNumber");
  assert(record.name === "Dr. John Doe", "name should add Dr. prefix");
  assert(record.department === "Cardiology", "department should be Cardiology");
  assert(record.specialty === "Interventional Cardiology", "specialty should match");
  assert(record.qualification === "MD, Cardiology", "qualification should match");
  assert(record.experienceYrs === 12, "experienceYrs should match");
  assert(record.consultationFee === 200, "consultationFee should match");
  assert(record.status === "Active", "status should map to Active");
  assert(record.availability === "Available Today", "availability should map to Available Today");

  // Test reverse mapping for update payload
  const payload = mapDoctorToUpdatePayload(record);
  assert(payload.fullName === "John Doe", "fullName should remove Dr. prefix");
  assert(payload.email === "john.doe@hospital.com", "email should match");
  assert(payload.consultationFee === 200, "consultationFee should match");
  assert(payload.qualification === "MD, Cardiology", "qualification should match");

  console.log("✅ mapApiUserToDoctorRecord tests passed!");
}

try {
  runMapApiUserToDoctorRecordTests();
} catch (e) {
  console.error("Test failed:", e);
}
