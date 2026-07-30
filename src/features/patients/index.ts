// Pages
export * from "./pages/EditPatientScreen";
export * from "./pages/MedicalHistoryScreen";
export * from "./pages/PatientAppointmentsScreen";
export * from "./pages/PatientBillingScreen";
export * from "./pages/PatientBookAppointmentScreen";
export * from "./pages/PatientMedicalRecordsScreen";
export * from "./pages/PatientPrescriptionDetailsScreen";
export * from "./pages/PatientPrescriptionsScreen";
export * from "./pages/PatientProfileCenterScreen";
export * from "./pages/PatientProfileScreen";
export * from "./pages/PatientSearchScreen";
export * from "./pages/PatientTimelineScreen";
export * from "./pages/PatientVisitHistoryScreen";
export * from "./pages/ReceptionPatientProfileScreen";
export * from "./pages/ReceptionPatientRegistrationScreen";
export * from "./pages/RegisterPatientScreen";

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
export { usePatients, usePatientSearch } from "./hooks/usePatients";
export { usePatient } from "./hooks/usePatient";
export { useCreatePatient } from "./hooks/useCreatePatient";
export { useDuplicateCheck } from "./hooks/useDuplicateCheck";
export { useUpdatePatient } from "./hooks/useUpdatePatient";

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
