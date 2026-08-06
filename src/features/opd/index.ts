export {
  OPDConsultationPage,
  OpdConsultationCenterScreen,
  OpdConsultationMonitoringCenterScreen,
} from "./pages/OPDConsultationPage";
export { StartConsultationPage as StartOpdConsultationWorkspaceScreen } from "./pages/StartConsultationPage";
export { ConsultationDetailsPage as ConsultationDetailsScreen } from "./pages/ConsultationDetailsPage";
export { ConsultationDetailsPage as AdminConsultationDetailsScreen } from "./pages/ConsultationDetailsPage";
export { ConsultationHistoryPage as ConsultationHistoryScreen } from "./pages/ConsultationHistoryPage";
export { EditConsultationPage as EditConsultationScreen } from "./pages/EditConsultationPage";

export { StatusChip, ConsultationStatusBadge } from "./components/StatusChip";
export { Avatar } from "./components/Avatar";
export { ConsultationHeader } from "./components/ConsultationHeader";
export { ConsultationKPICards } from "./components/ConsultationKPICards";
export { ConsultationTabs } from "./components/ConsultationTabs";
export { ConsultationTable } from "./components/ConsultationTable";
export { ConsultationActionMenu } from "./components/ConsultationActionMenu";

export { OperationalSummaryModal } from "./components/OperationalSummaryModal";

export { appointmentStatusMap } from "./types/consultation";
export type {
  ConsultationRecord,
  AdminConsultationRecord,
  ConsultationStatus,
  VisitType,
  OauthRole,
  AdminStatus,
  DoctorWorkload,
  DepartmentSummary,
  ConsultationFormData,
  TimelineConsultationItem,
  MedicineItem,
} from "./types/consultation";
export type { PatientVitals, EncounterVitalsPayload } from "./types/vitals";
export type { DiagnosisItem, EncounterDiagnosisPayload } from "./types/diagnosis";
export type {
  Encounter,
  Consultation,
  Diagnosis,
  CreateEncounterRequest,
  SaveConsultationRequest,
  AddDiagnosisRequest,
  FinalizeEncounterRequest,
  CreatePrescriptionRequest,
  AddMedicationRequest,
  Prescription,
  FinalizePrescriptionRequest,
  FinalizePrescriptionResponse,
  EncounterSummary,
  EncounterStatus,
  PrescriptionOutcome,
} from "./types/encounter";
export type {
  QueueItem,
  QueueStatus,
  QueueSummary,
  QueuePage,
  QueueListParams,
} from "./types/queue.types";
