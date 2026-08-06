import { encountersApi } from "../api/encounters.api";
import type {
  AddDiagnosisRequest,
  AddMedicationRequest,
  Consultation,
  CreatePrescriptionRequest,
  Diagnosis,
  Encounter,
  EncounterSummary,
  FinalizeEncounterRequest,
  FinalizePrescriptionRequest,
  FinalizePrescriptionResponse,
  Prescription,
  SaveConsultationRequest,
} from "../types/encounter.types";

const normalizeEncounter = (encounter: Encounter): EncounterSummary => ({
  encounterId: encounter.encounterId,
  encounterNumber: encounter.encounterNumber,
  appointmentId: encounter.appointmentId,
  patientId: encounter.patientId,
  doctorId: encounter.doctorId,
  status: encounter.status ?? "CREATED",
  version: encounter.version,
  startedAt: encounter.startedAt,
  completedAt: encounter.completedAt,
  finalizedAt: encounter.finalizedAt,
});

/**
 * Service layer for the encounter / prescription management flow.
 * Maps backend models to UI models, validates, and centralizes business rules.
 */
export const encounterService = {
  /**
   * Create an encounter for an appointment and map it to the UI model.
   */
  async startEncounter(
    appointmentId: string | number,
  ): Promise<EncounterSummary> {
    const encounter = await encountersApi.createEncounter({ appointmentId });
    return normalizeEncounter(encounter);
  },

  async saveConsultation(
    encounterId: string | number,
    payload: SaveConsultationRequest,
  ): Promise<Consultation> {
    return encountersApi.saveConsultation(encounterId, payload);
  },

  async addDiagnosis(
    encounterId: string | number,
    payload: AddDiagnosisRequest,
  ): Promise<Diagnosis> {
    return encountersApi.addDiagnosis(encounterId, payload);
  },

  async finalizeEncounter(
    encounterId: string | number,
    payload: FinalizeEncounterRequest,
  ): Promise<EncounterSummary> {
    const encounter = await encountersApi.finalizeEncounter(
      encounterId,
      payload,
    );
    return normalizeEncounter(encounter);
  },

  async createPrescription(
    encounterId: string | number,
    payload: CreatePrescriptionRequest,
  ): Promise<Prescription> {
    return encountersApi.createPrescription(encounterId, payload);
  },

  async addMedication(
    prescriptionId: string | number,
    payload: AddMedicationRequest,
  ): Promise<Prescription | null> {
    return encountersApi.addMedication(prescriptionId, payload);
  },

  async finalizePrescription(
    prescriptionId: string | number,
    payload: FinalizePrescriptionRequest = { confirmation: true },
  ): Promise<FinalizePrescriptionResponse | null> {
    return encountersApi.finalizePrescription(prescriptionId, payload);
  },
};

export default encounterService;
