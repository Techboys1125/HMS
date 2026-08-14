import { apiClient, axios } from "../../../lib/axios";
import type { Encounter, Consultation, Diagnosis } from "../types/encounter";
import type { PatientVitals } from "../types/vitals";

export interface EncounterPrescription {
  id: number;
  prescriptionId: string;
  encounterId: number;
  encounterNumber: string;
  patient?: {
    fullName: string;
    mrn: string;
    gender: string;
    age: string;
  };
  prescriber?: {
    doctorId: string;
    fullName: string;
    registrationNumber: string;
    department: string;
  };
  status: "DRAFT" | "FINALIZED";
  outcome: string;
  currentVersion: number;
  amendmentReason?: string;
  amendedFromVersion?: number;
  medications: Array<{
    medicationId: number;
    displayOrder?: number;
    source: string;
    medicineId?: number;
    medicineName: string;
    strength?: string;
    form?: string;
    route?: string;
    dose?: { value: number; unit: string };
    frequency?: { code: string; display: string };
    duration?: { value: number; unit: string };
    quantity?: { value: number; unit: string };
    instructions?: string;
  }>;
  advice?: {
    general?: string;
    diet?: string;
    precautions?: string;
    additionalInstructions?: string;
  };
  followUp?: {
    instructions?: string;
    type?: string;
    intervalValue?: number;
    intervalUnit?: string;
    followUpDate?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  finalizedAt?: string;
}

interface ApiEnvelope<T> {
  success?: boolean;
  code?: string;
  message?: string;
  timestamp?: string;
  data?: T;
  errors?: Record<string, unknown>;
}

const unwrap = <T>(body: ApiEnvelope<T> | T): T => {
  if (
    body !== null &&
    typeof body === "object" &&
    "data" in body &&
    (body as ApiEnvelope<T>).data !== undefined
  ) {
    return (body as ApiEnvelope<T>).data as T;
  }
  return body as T;
};

const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) {
      throw new Error(data.message);
    }
  }
  throw error;
};

export const consultationApi = {
  /**
   * PATCH /api/v1/doctor/appointments/{appointmentId}/start
   * Note: Backend requires status IN_CONSULTATION or CALLED/WAITING_FOR_DOCTOR_CALL
   */
  startAppointment: async (
    appointmentId: string | number,
  ): Promise<{ success: boolean; status: string }> => {
    try {
      const response = await apiClient.patch<
        ApiEnvelope<{ success: boolean; status: string }> | { success: boolean; status: string }
      >(`/api/v1/doctor/appointments/${appointmentId}/start`, {});
      return unwrap(response.data);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },

  /**
   * PATCH /api/v1/doctor/appointments/{appointmentId}/complete
   */
  completeAppointment: async (
    appointmentId: string | number,
  ): Promise<{ success: boolean; status: string }> => {
    try {
      const response = await apiClient.patch<
        ApiEnvelope<{ success: boolean; status: string }> | { success: boolean; status: string }
      >(`/api/v1/doctor/appointments/${appointmentId}/complete`, {});
      return unwrap(response.data);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },

  /**
   * POST /api/v1/encounters
   * Create an encounter for an appointment
   */
  createEncounter: async (
    appointmentId: string | number,
  ): Promise<Encounter> => {
    try {
      const response = await apiClient.post<ApiEnvelope<Encounter> | Encounter>(
        "/api/v1/encounters",
        { appointmentId },
      );
      return unwrap<Encounter>(response.data);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },

  /**
   * POST /api/v1/encounters/{encounterId}/consultation
   * Initialize consultation draft
   */
  initializeConsultation: async (
    encounterId: string | number,
    chiefComplaint: string = "",
  ): Promise<Consultation> => {
    try {
      const response = await apiClient.post<
        ApiEnvelope<Consultation> | Consultation
      >(`/api/v1/encounters/${encounterId}/consultation`, { chiefComplaint });
      return unwrap<Consultation>(response.data);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },

  /**
   * GET /api/v1/encounters/{encounterId}/vitals
   * Load patient vitals for the encounter
   */
  loadEncounterVitals: async (
    encounterId: string | number,
  ): Promise<PatientVitals | null> => {
    if (!encounterId) {
      return null;
    }
    try {
      const response = await apiClient.get<
        ApiEnvelope<Record<string, unknown>> | Record<string, unknown>
      >(`/api/v1/encounters/${encounterId}/vitals`);
      const raw = unwrap<Record<string, unknown>>(response.data);
      if (!raw) return null;

      // Map backend field names to frontend PatientVitals format
      const tempVal = raw.temperature ?? raw.temp;
      const bpVal = raw.bloodPressure ?? raw.bp;
      const pulseVal = raw.pulse ?? raw.heartRate;
      const spo2Val = raw.spo2 ?? raw.oxygenSaturation;
      const respVal = raw.respiratoryRate ?? raw.respRate;
      const sugarVal = raw.bloodSugar ?? raw.sugar;

      const toStr = (v: unknown): string => (v != null ? String(v) : "");

      return {
        height: toStr(raw.height),
        weight: toStr(raw.weight),
        bmi: toStr(raw.bmi),
        temp: toStr(tempVal),
        bp: toStr(bpVal),
        pulse: toStr(pulseVal),
        spo2: toStr(spo2Val),
        respiratoryRate: toStr(respVal),
        bloodSugar: toStr(sugarVal),
      };
    } catch {
      return null;
    }
  },

  /**
   * POST /api/v1/encounters/{encounterId}/vitals
   * Update vitals for the encounter.
   * Backend expects nested DTO format (e.g. temperature: { value, unit }),
   * but the frontend stores flat strings with units. This helper converts
   * the flat PatientVitals model to the nested RecordVitalsRequest DTO.
   */
  updateVitals: async (
    encounterId: string | number,
    vitals: Partial<PatientVitals>,
  ): Promise<PatientVitals> => {
    const stripUnit = (s?: string) => {
      if (!s) return undefined;
      return parseFloat(String(s).replace(/[^0-9.-]/g, "")) || undefined;
    };
    const parseBp = (bp?: string) => {
      if (!bp) return undefined;
      const parts = bp.split("/").map((p) => parseFloat(p.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return { systolic: parts[0], diastolic: parts[1], unit: "MMHG" };
      }
      return undefined;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dto: Record<string, any> = {};
    const temp = stripUnit(vitals.temp);
    if (temp !== undefined) dto.temperature = { value: temp, unit: "FAHRENHEIT" };
    const bp = parseBp(vitals.bp);
    if (bp) dto.bloodPressure = bp;
    const pulse = stripUnit(vitals.pulse);
    if (pulse !== undefined) dto.pulse = { value: pulse, unit: "BPM" };
    const rr = stripUnit(vitals.respiratoryRate);
    if (rr !== undefined) dto.respiratoryRate = { value: rr, unit: "BREATHS_PER_MINUTE" };
    const spo2 = stripUnit(vitals.spo2);
    if (spo2 !== undefined) dto.spo2 = { value: spo2, unit: "PERCENT" };
    const weight = stripUnit(vitals.weight);
    if (weight !== undefined) dto.weight = { value: weight, unit: "KG" };
    const height = stripUnit(vitals.height);
    if (height !== undefined) dto.height = { value: height, unit: "CM" };

    try {
      const response = await apiClient.post<
        ApiEnvelope<PatientVitals> | PatientVitals
      >(`/api/v1/encounters/${encounterId}/vitals`, dto);
      return unwrap<PatientVitals>(response.data);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },

  /**
   * POST /api/v1/encounters/{encounterId}/diagnoses
   * Add a diagnosis to the encounter
   */
  addDiagnosis: async (
    encounterId: string | number,
    diagnosis: { diagnosisCode: string; diagnosisName: string },
  ): Promise<Diagnosis> => {
    try {
      const response = await apiClient.post<ApiEnvelope<Diagnosis> | Diagnosis>(
        `/api/v1/encounters/${encounterId}/diagnoses`,
        diagnosis,
      );
      return unwrap<Diagnosis>(response.data);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },

  /**
   * POST /api/v1/encounters/{encounterId}/finalize
   * Finalize the encounter (also completes the appointment)
   */
  finalizeConsultation: async (
    encounterId: string | number,
  ): Promise<Encounter> => {
    try {
      const response = await apiClient.post<ApiEnvelope<Encounter> | Encounter>(
        `/api/v1/encounters/${encounterId}/finalize`,
        { confirmation: true },
      );
      return unwrap<Encounter>(response.data);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },

  /**
   * GET /api/v1/consultations/{consultationId}
   * Get consultation details
   */
  getConsultationDetails: async (
    consultationId: string | number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any | null> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await apiClient.get<any>(
        `/api/v1/consultations/${consultationId}`,
      );
      return response.data?.data || response.data || null;
    } catch {
      return null;
    }
  },

  /**
   * GET /api/v1/encounters/{encounterId}
   * Get encounter details
   */
  getEncounter: async (
    encounterId: string | number,
  ): Promise<Encounter | null> => {
    try {
      const response = await apiClient.get<{ data?: Encounter; content?: Encounter }>(
        `/api/v1/encounters/${encounterId}`,
      );
      return response.data?.data || response.data || null;
    } catch {
      return null;
    }
  },

  /**
   * GET /api/v1/encounters/{encounterId}/diagnoses
   * Get all diagnoses for an encounter
   */
  getDiagnoses: async (
    encounterId: string | number,
  ): Promise<Diagnosis[]> => {
    try {
      const response = await apiClient.get<{ data?: Diagnosis[]; content?: Diagnosis[] }>(
        `/api/v1/encounters/${encounterId}/diagnoses`,
      );
      const list = response.data?.data || response.data;
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  },

  /**
   * GET /api/v1/encounters/{encounterId}/prescription
   * Get encounter prescription workspace
   */
  getPrescription: async (
    encounterId: string | number,
  ): Promise<EncounterPrescription | null> => {
    try {
      const response = await apiClient.get<ApiEnvelope<EncounterPrescription> | EncounterPrescription>(
        `/api/v1/encounters/${encounterId}/prescription`,
      );
      return unwrap<EncounterPrescription>(response.data);
    } catch {
      return null;
    }
  },

  /**
   * PATCH /api/v1/queue/{appointmentId}/call
   * Doctor calls a patient from the queue
   */
  callPatientFromQueue: async (
    appointmentId: string | number,
  ): Promise<{ success: boolean; status: string }> => {
    try {
      const response = await apiClient.patch<
        ApiEnvelope<{ success: boolean; status: string }> | { success: boolean; status: string }
      >(`/api/v1/queue/${appointmentId}/call`);
      return unwrap(response.data);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },

  /**
   * PUT /api/v1/nurse/appointments/{appointmentId}/vitals
   * Doctor or Nurse update patient vitals
   */
  updateAppointmentVitals: async (
    appointmentId: string | number,
    vitals: Record<string, unknown>,
  ): Promise<{ success: boolean; data: unknown }> => {
    try {
      const response = await apiClient.put<
        ApiEnvelope<{ success: boolean; data: unknown }> | { success: boolean; data: unknown }
      >(`/api/v1/nurse/appointments/${appointmentId}/vitals`, vitals);
      return unwrap(response.data);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },

  /**
   * PUT /api/v1/consultations/{consultationId}/clinical-notes
   * Save SOAP notes for the consultation.
   * Backend expects nested DTO format with model field names:
   *   { subjective: { historyOfPresentIllness: "..." },
   *     objective: { physicalExamination: "..." },
   *     assessment: { assessmentSummary: "..." },
   *     plan: { advice: "..." } }
   */
  saveClinicalNotes: async (
    consultationId: string | number,
    clinicalNotes: {
      subjective?: string;
      objective?: string;
      assessment?: string;
      plan?: string;
      historyOfPresentIllness?: string;
      physicalExamination?: string;
      assessmentSummary?: string;
      advice?: string;
    },
  ): Promise<{ success: boolean; data: unknown }> => {
    const dto: Record<string, unknown> = {};
    const hpi = clinicalNotes.subjective || clinicalNotes.historyOfPresentIllness;
    if (hpi) dto.subjective = { historyOfPresentIllness: hpi };
    const pe = clinicalNotes.objective || clinicalNotes.physicalExamination;
    if (pe) dto.objective = { physicalExamination: pe };
    const sum = clinicalNotes.assessment || clinicalNotes.assessmentSummary;
    if (sum) dto.assessment = { assessmentSummary: sum };
    const adv = clinicalNotes.plan || clinicalNotes.advice;
    if (adv) dto.plan = { advice: adv };

    try {
      const response = await apiClient.put<
        ApiEnvelope<{ success: boolean; data: unknown }> | { success: boolean; data: unknown }
      >(`/api/v1/consultations/${consultationId}/clinical-notes`, dto);
      return unwrap(response.data);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },

  /**
   * GET /api/v1/encounters/{encounterId}/finalization-check
   * Validate encounter readiness before finalization
   */
  finalizationCheck: async (
    encounterId: string | number,
  ): Promise<{
    canFinalize: boolean;
    missingItems: string[];
    prescriptionOutcome?: string;
  }> => {
    try {
      const response = await apiClient.get<{
        data?: {
          canFinalize: boolean;
          missingItems: string[];
          prescriptionOutcome?: string;
        };
      }>(`/api/v1/encounters/${encounterId}/finalization-check`);
      return (
        response.data?.data || {
          canFinalize: true,
          missingItems: [],
        }
      );
    } catch {
      return { canFinalize: true, missingItems: [] };
    }
  },

  /**
   * POST /api/v1/prescriptions/{prescriptionId}/validate
   * Validate prescription before finalization
   */
  validatePrescription: async (
    prescriptionId: string | number,
  ): Promise<{ valid: boolean; errors: string[] }> => {
    try {
      const response = await apiClient.post<{
        data?: { valid: boolean; errors: string[] };
      }>(`/api/v1/prescriptions/${prescriptionId}/validate`);
      return response.data?.data || { valid: true, errors: [] };
    } catch {
      return { valid: true, errors: [] };
    }
  },

  /**
   * POST /api/v1/encounters/{encounterId}/prescription-resolution
   * Set prescription outcome/resolution on the encounter
   */
  setPrescriptionResolution: async (
    encounterId: string | number,
    resolution: { outcome: string },
  ): Promise<Encounter> => {
    try {
      const response = await apiClient.post<ApiEnvelope<Encounter> | Encounter>(
        `/api/v1/encounters/${encounterId}/prescription-resolution`,
        resolution,
      );
      return unwrap<Encounter>(response.data);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },

  /**
   * GET /api/v1/doctors/me/consultation-queue
   * Fetch doctor's consultation queue
   */
  getConsultationQueue: async (): Promise<unknown[]> => {
    try {
      const response = await apiClient.get<{ data?: unknown[]; content?: unknown[] }>(
        "/api/v1/doctors/me/consultation-queue",
      );
      const list = response.data?.data || response.data;
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  },
};
