// Pages
export * from "./pages/EditPatientScreen";
export * from "./pages/PatientAppointmentsScreen";
export * from "./pages/PatientMedicalRecordsScreen";
export * from "./pages/PatientProfileCenterScreen";
export * from "./pages/PatientProfileScreen";
export * from "./pages/PatientSearchScreen";
export * from "./pages/RegisterPatientScreen";
export * from "./pages/FamilyMembersManagement";
export * from "./pages/PatientDoctorSearchScreen";
export * from "./pages/PatientQueueStatusScreen";
export * from "./pages/PatientNotificationsScreen";

// Patient Module Pages
export { PatientListPage } from "./pages/PatientListPage";
export { PatientProfilePage } from "./pages/PatientProfilePage";
export { DoctorAssignedPatientsPage } from "./pages/DoctorAssignedPatientsPage";
export { NurseVitalsWorklistPage } from "./pages/NurseVitalsWorklistPage";
export { MyProfilePage as PatientMyProfilePage } from "./pages/MyProfilePage";
export { StaffProfilePage } from "./pages/StaffProfilePage";

// Route Wrappers
export { PatientListPageRoute } from "./routes/PatientListPageRoute";
export { PatientProfileRoute } from "./routes/PatientProfileRoute";
export { PatientMyProfileRoute } from "./routes/PatientMyProfileRoute";
export { DoctorAssignedPatientsRoute } from "./routes/DoctorAssignedPatientsRoute";
export { UserProfileRoute } from "./routes/UserProfileRoute";

// Tab Components
export { PatientAppointmentsTab } from "./components/tabs/AppointmentsTab";
export { PatientPrescriptionsTab } from "./components/tabs/PrescriptionsTab";
export { PatientBillingTab } from "./components/tabs/BillingTab";
export { PatientMedicalRecordsTab } from "./components/tabs/MedicalRecordsTab";

// Reusable Components
export { PatientProfileHeader } from "./components/PatientProfileHeader";
export { SwitchAccountDialog } from "./components/SwitchAccountDialog";
export { PatientTable } from "./components/PatientTable";
export { PatientFilters } from "./components/PatientFilters";

// Hooks
export { usePatients, usePatient, useUpdatePatient } from "./hooks/usePatients";
export { useCreatePatient } from "./hooks/useCreatePatient";
export { useFamilyMembers } from "./hooks/useFamilyMembers";
export { useMedicalRecords } from "./hooks/useMedicalRecords";
export { useSwitchAccount } from "./hooks/useSwitchAccount";
export { usePatientQueue } from "./hooks/usePatientQueue";

// Services
export { patientService } from "./services/patient.service";
export { familyService } from "./services/family.service";
export { medicalRecordService } from "./services/medicalRecord.service";

// Utils
export { can } from "./utils/patientPermissions";
export type { Role, PatientAction } from "./utils/patientPermissions";

// API
export { patientsApi } from "./api/patient.api";

// Types
export type {
  Patient,
  CreatePatientRequest,
  PatientStatistics,
  PatientSearchResult,
  BloodGroup,
  MaritalStatus,
  PatientCategory,
  RegistrationType,
  Address,
  PatientFormMode,
  RoleFieldPermissions,
  SwitchAccountContext,
} from "./types/patient.types";
export type {
  FamilyMember,
  FamilyMemberRelationship,
  AddFamilyMemberRequest,
} from "./types/family.types";
export type {
  ConsultationRecord,
  VitalsRecord,
  DiagnosisRecord,
  MedicalHistoryEntry,
  PatientMedicalSummary,
} from "./types/medicalRecord.types";
