// Pages
export * from "./pages/EditPatientScreen";
export * from "./pages/MedicalHistoryScreen";
export * from "./pages/PatientAppointmentsScreen";
export * from "./pages/PatientBillingScreen";
export * from "./pages/PatientMedicalRecordsScreen";
export * from "./pages/PatientPrescriptionDetailsScreen";
export * from "./pages/PatientPrescriptionsScreen";
export * from "./pages/PatientProfileCenterScreen";
export * from "./pages/PatientProfileScreen";
export { PatientProfileScreen as ReceptionPatientProfileScreen } from "./pages/PatientProfileScreen";
export * from "./pages/PatientSearchScreen";
export * from "./pages/PatientTimelineScreen";
export * from "./pages/PatientVisitHistoryScreen";
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
export { AccountantPatientBillingPage } from "./pages/AccountantPatientBillingPage";

// Route Wrappers
export { PatientListPageRoute } from "./routes/PatientListPageRoute";
export { PatientProfileRoute } from "./routes/PatientProfileRoute";
export { PatientMyProfileRoute } from "./routes/PatientMyProfileRoute";
export { DoctorAssignedPatientsRoute } from "./routes/DoctorAssignedPatientsRoute";
export { PatientProfileTab } from "./components/tabs/ProfileTab";
export { FamilyMembersTab } from "./components/tabs/FamilyMembersTab";
export { PatientAppointmentsTab } from "./components/tabs/AppointmentsTab";
export { PatientQueueTab } from "./components/tabs/QueueTab";
export { PatientPrescriptionsTab } from "./components/tabs/PrescriptionsTab";
export { PatientBillingTab } from "./components/tabs/BillingTab";

// Components
export { PatientTable } from "./components/PatientTable";
export { PatientFilters } from "./components/PatientFilters";
export { DuplicateWarningDialog } from "./components/DuplicateWarningDialog";
export { DuplicateOverrideDialog } from "./components/DuplicateOverrideDialog";
export { PatientHistoryTabs } from "./components/PatientHistoryTable";
export {
  PatientStatusBadge,
  StatusBadge,
} from "./components/PatientStatusBadge";

// Hooks
export {
  usePatients,
  usePatient,
  usePatientSearch,
  useRegisterPatient,
  useUpdatePatient,
  usePatientAudit,
} from "./hooks/usePatients";
export { useCreatePatient } from "./hooks/useCreatePatient";
export { useDuplicateCheck } from "./hooks/useDuplicateCheck";

// Services
export { patientService } from "./services/patient.service";

// API
export { patientsApi } from "./api/patient.api";

// Store
export { patientStore, usePatientStore } from "./store/patient.store";

// Permissions
export { usePatientPermissions } from "./permissions/patient.permissions";

// Validation
export { patientSchema } from "./validation/patient.schema";

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
} from "./types/patient.types";
