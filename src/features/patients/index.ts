// Pages
export * from "./pages/PatientsScreen";

// Components
export { PatientTable } from "./components/PatientTable";
export { PatientFilters } from "./components/PatientFilters";
export { DuplicateWarningDialog } from "./components/DuplicateWarningDialog";
export { DuplicateOverrideDialog } from "./components/DuplicateOverrideDialog";
export { PatientHistoryTabs } from "./components/PatientHistoryTable";
export { PatientStatusBadge, StatusBadge } from "./components/PatientStatusBadge";

// Hooks
export {
  usePatients,
  usePatientSearch,
  usePatientStats,
} from "./hooks/usePatients";
export { usePatient } from "./hooks/usePatient";
export { useCreatePatient } from "./hooks/useCreatePatient";
export { useDuplicateCheck } from "./hooks/useDuplicateCheck";
export { useUpdatePatient } from "./hooks/useUpdatePatient";

// Services
export { patientService } from "./services/patient.service";

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
} from "./types/patient.types";
