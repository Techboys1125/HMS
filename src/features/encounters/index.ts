export { encountersApi } from "./api/encounters.api";
export { encounterService } from "./services/encounter.service";
export {
  useStartEncounter,
  useSaveConsultation,
  useAddDiagnosis,
  useFinalizeEncounter,
  useCreatePrescription,
  useAddMedication,
  useFinalizePrescription,
} from "./hooks/useEncounterActions";
export type {
  AddDiagnosisRequest,
  AddMedicationRequest,
  Consultation,
  CreateEncounterRequest,
  CreatePrescriptionRequest,
  Diagnosis,
  Encounter,
  EncounterStatus,
  EncounterSummary,
  FinalizeEncounterRequest,
  FinalizePrescriptionRequest,
  FinalizePrescriptionResponse,
  Prescription,
  PrescriptionMedication,
  PrescriptionOutcome,
  SaveConsultationRequest,
} from "./types/encounter.types";
