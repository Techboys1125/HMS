// Pages
export { PatientListPage } from "./pages/PatientListPage";
export { PatientProfilePage } from "./pages/PatientProfilePage";
export { PatientRegistrationPage } from "./pages/PatientRegistrationPage";

// Components
export { PatientTable } from "./components/PatientTable";
export { PatientFilters } from "./components/PatientFilters";
export { PatientQuickDetailsDrawer } from "./components/PatientQuickDetailsDrawer";
export { RegisterPatientDrawer } from "./components/RegisterPatientDrawer";
export { EditPatientInformationDrawer } from "./components/EditPatientInformationDrawer";
export {
  PatientStatusBadge,
  StatusBadge,
} from "./components/PatientStatusBadge";
export { DuplicateWarningDialog } from "./components/DuplicateWarningDialog";
export { DuplicateOverrideDialog } from "./components/DuplicateOverrideDialog";
export { PatientHistoryTabs } from "./components/PatientHistoryTabs";

// Hooks
export {
  usePatients,
  usePatientSearch,
  usePatientStats,
} from "./hooks/usePatients";
export { usePatient } from "./hooks/usePatient";
export { useCreatePatient, useDuplicateCheck } from "./hooks/useCreatePatient";
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
  BackendPatient,
  CreatePatientRequest,
  PatientStats,
  PatientSearchResult,
} from "./types/patient.types";
