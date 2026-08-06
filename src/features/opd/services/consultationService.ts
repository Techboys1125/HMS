import { AppointmentRecord } from "../../appointments/types/appointment.types";
import { consultationApi } from "../api/consultationApi";
import { consultationStoreActions } from "../store/consultationStore";
import type { PatientVitals } from "../types/vitals";

export const consultationService = {
  /**
   * Action: Doctor calls patient
   */
  callPatient: async () => {
    consultationStoreActions.setStatus("Called");
    // We can potentially trigger an API to inform queue management if needed
  },

  /**
   * Action: Doctor starts the consultation
   * Call PATCH /api/v1/doctor/appointments/{appointmentId}/start
   * Call POST /api/v1/encounters
   * Call POST /api/v1/encounters/{encounterId}/consultation
   */
  startConsultation: async (
    appointment: AppointmentRecord,
    chiefComplaint: string = "",
  ): Promise<{
    encounterId: string | number;
    consultationId: string | number;
  }> => {
    consultationStoreActions.setLoading(true);
    try {
      const appointmentId = appointment.id || appointment.appointmentId;

      // 1. Start appointment
      await consultationApi.startAppointment(appointmentId);

      // 2. Create Encounter
      const encounter = await consultationApi.createEncounter(appointmentId);
      consultationStoreActions.setEncounter(encounter);

      // 3. Initialize Consultation Draft
      const consultation = await consultationApi.initializeConsultation(
        encounter.encounterId,
        chiefComplaint,
      );
      consultationStoreActions.setConsultation(consultation);
      consultationStoreActions.setAppointment(appointment);
      consultationStoreActions.setStatus("In Progress");

      return {
        encounterId: encounter.encounterId,
        consultationId: consultation.id,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to start consultation";
      consultationStoreActions.setError(errorMessage);
      throw err;
    } finally {
      consultationStoreActions.setLoading(false);
    }
  },

  /**
   * Action: Load patient details and vitals for consultation
   */
  loadEncounterContext: async (
    encounterId: string | number,
  ): Promise<PatientVitals | null> => {
    consultationStoreActions.setLoading(true);
    try {
      const vitals = await consultationApi.loadEncounterVitals(encounterId);
      return vitals;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load vitals";
      consultationStoreActions.setError(errorMessage);
      return null;
    } finally {
      consultationStoreActions.setLoading(false);
    }
  },

  /**
   * Action: Update Vitals
   */
  saveVitals: async (
    encounterId: string | number,
    vitals: Partial<PatientVitals>,
  ): Promise<PatientVitals> => {
    try {
      return await consultationApi.updateVitals(encounterId, vitals);
    } catch (err) {
      console.error("saveVitals failed:", err);
      throw err;
    }
  },

  /**
   * Action: Add Diagnosis
   */
  addDiagnosis: async (
    encounterId: string | number,
    code: string,
    label: string,
  ) => {
    try {
      return await consultationApi.addDiagnosis(encounterId, {
        diagnosisCode: code,
        diagnosisName: label,
      });
    } catch (err) {
      console.error("addDiagnosis failed:", err);
      throw err;
    }
  },

  /**
   * Action: Finalize Consultation
   * Call POST /api/v1/encounters/{encounterId}/finalize
   * Call PATCH /api/v1/doctor/appointments/{appointmentId}/complete
   */
  finalizeConsultation: async (
    encounterId: string | number,
    appointmentId: string | number,
  ) => {
    consultationStoreActions.setLoading(true);
    try {
      // 1. Finalize encounter
      await consultationApi.finalizeConsultation(encounterId);

      // 2. Complete appointment
      await consultationApi.completeAppointment(appointmentId);

      consultationStoreActions.setStatus("Completed");
      consultationStoreActions.reset();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to finalize consultation";
      consultationStoreActions.setError(errorMessage);
      throw err;
    } finally {
      consultationStoreActions.setLoading(false);
    }
  },
};
