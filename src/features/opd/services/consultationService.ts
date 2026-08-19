import type { AppointmentRecord } from "../../appointments/types/appointment.types";
import { consultationApi } from "../api/consultationApi";
import { consultationStoreActions } from "../store/consultationStore";
import type { PatientVitals } from "../types/vitals";
import type {
  ConsultationRecord,
  VisitType,
  ConsultationStatus,
} from "../types/consultation";
import { encountersApi } from "../../encounters";
import { appointmentsApi } from "../../appointments/api/appointments.api";

export const consultationService = {
  /**
   * Action: Doctor calls patient from queue
   * PATCH /api/v1/queue/{appointmentId}/call → transitions to CALLED
   * Falls back to PATCH /api/v1/appointments/{id}/status
   */
  callPatient: async (appointmentId: string | number) => {
    try {
      await consultationApi.callPatientFromQueue(appointmentId);
    } catch {
      await appointmentsApi.updateAppointmentStatus(appointmentId, "CALLED");
    }
    consultationStoreActions.setStatus("CALLED");
  },

  /**
   * Action: Doctor starts the consultation
   * 1. POST /api/v1/encounters
   * 2. GET /api/v1/encounters/{encounterId}/vitals (load patient vitals)
   * 3. POST /api/v1/encounters/{encounterId}/consultation (init draft)
   * 4. PATCH /api/v1/appointments/{id}/status → IN_CONSULTATION
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
      if (!appointmentId) {
        throw new Error("Appointment ID is missing");
      }

      // 1. Create Encounter
      const encounter = await consultationApi.createEncounter(appointmentId);
      consultationStoreActions.setEncounter(encounter);

      // 2. Load patient vitals for the encounter (may fail for new encounters — non-critical)
      let vitals: PatientVitals | null = null;
      try {
        vitals = await consultationApi.loadEncounterVitals(
          encounter.encounterId,
        );
        if (vitals) {
          consultationStoreActions.setVitals(vitals);
        }
      } catch {
        // Vitals may not exist yet for new encounters — continue
      }

      // 3. Initialize Consultation Draft
      const consultation = await consultationApi.initializeConsultation(
        encounter.encounterId,
        chiefComplaint || appointment.chiefComplaint || "",
      );

      // 4. Create Draft Prescription linked to encounter
      let prescription = null;
      try {
        prescription = await encountersApi.createPrescription(
          encounter.encounterId,
          {
            outcome: "NO_MEDICATION_REQUIRED",
          },
        );
      } catch {
        prescription = null;
      }
      consultationStoreActions.setPrescription(prescription);

      // 5. Build consultation record (status already IN_CONSULTATION from queue/encounter)
      const record: ConsultationRecord = {
        id: String(consultation.id),
        appointmentId,
        tokenNo: String(
          appointment.tokenNo ||
            appointment.tokenNumber ||
            appointment.queueToken ||
            "",
        ),
        patientName: appointment.patientName,
        mrn: appointment.mrn || appointment.patientMrn || "",
        age: Number(appointment.patientAge || appointment.age || 30),
        gender: (appointment.patientGender || appointment.gender || "Other") as
          "Male" | "Female" | "Other",
        phone: String(appointment.patientPhone || appointment.mobile || ""),
        doctor: appointment.doctorName,
        department:
          appointment.departmentName ||
          (typeof appointment.department === "string"
            ? appointment.department
            : appointment.department?.name ||
              appointment.department?.departmentName) ||
          "",
        appointmentTime: appointment.appointmentTime || "",
        visitType: (appointment.appointmentType ||
          appointment.visitType ||
          "New Consultation") as VisitType,
        status: "IN_CONSULTATION" as ConsultationStatus,
        chiefComplaint:
          consultation.chiefComplaint ||
          chiefComplaint ||
          appointment.chiefComplaint ||
          "",
        opdRoom: String(appointment.opdRoom || ""),
        date:
          appointment.appointmentDate || new Date().toISOString().split("T")[0],
        vitals: vitals || undefined,
        clinicalExamination:
          consultation.generalExamination ||
          consultation.physicalExamination ||
          undefined,
        advice: consultation.advice,
        doctorName: "",
        completionTime: "",
        allergies: [],
        bloodGroup: "",
        durationOfSymptoms: "",
      };

      consultationStoreActions.setConsultation(record);
      consultationStoreActions.setAppointment(appointment);
      consultationStoreActions.setStatus("IN_CONSULTATION");

      return {
        encounterId: encounter.encounterId,
        consultationId: consultation.id,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to start consultation";
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
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load vitals";
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
   * Action: Update vitals via appointment endpoint (for Doctor edit)
   * PUT /api/v1/nurse/appointments/{appointmentId}/vitals
   */
  updateAppointmentVitals: async (
    appointmentId: string | number,
    vitals: Record<string, unknown>,
  ): Promise<{ success: boolean; data: unknown }> => {
    try {
      return await consultationApi.updateAppointmentVitals(
        appointmentId,
        vitals,
      );
    } catch (err) {
      console.error("updateAppointmentVitals failed:", err);
      throw err;
    }
  },

  /**
   * Action: Save SOAP clinical notes
   * PUT /api/v1/consultations/{consultationId}/clinical-notes
   */
  saveClinicalNotes: async (
    consultationId: string | number,
    clinicalNotes: Record<string, unknown>,
  ): Promise<{ success: boolean; data: unknown }> => {
    try {
      return await consultationApi.saveClinicalNotes(
        consultationId,
        clinicalNotes,
      );
    } catch (err) {
      console.error("saveClinicalNotes failed:", err);
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
   * 1. Validate prescription (if exists)
   * 2. Finalize prescription (if exists)
   * 3. Set prescription resolution on encounter (PRESCRIPTION_CREATED)
   * 4. Finalize encounter → auto-completes appointment
   */
  finalizeConsultation: async (
    encounterId: string | number,
    appointmentId: string | number,
    advicePayload?: {
      generalAdvice?: string;
      dietAdvice?: string;
      precautions?: string;
    },
  ) => {
    consultationStoreActions.setLoading(true);
    try {
      const { selectedPrescription, selectedEncounter } =
        consultationStoreActions.getState();
      // Use numeric id for API calls (not the string prescriptionId like RX-20260806-2292)
      const rxId = selectedPrescription?.id;
      const hasValidRxId =
        rxId !== undefined && rxId !== null && !String(rxId).startsWith("RX-");

      // Step 16: Save prescription advice (if exists and payload provided)
      if (hasValidRxId && rxId && advicePayload) {
        try {
          await encountersApi.savePrescriptionAdvice(rxId, advicePayload);
        } catch {
          // non-blocking
        }
      }

      // Step 17: Validate prescription (if exists) — non-critical
      if (hasValidRxId && rxId) {
        try {
          await encountersApi.validatePrescription(rxId);
        } catch {
          // Validation failure is non-blocking
        }
      }

      // Step 18: Finalize prescription (if exists) — non-critical
      if (hasValidRxId && rxId) {
        try {
          await encountersApi.finalizePrescription(rxId, {
            confirmation: true,
          });
        } catch {
          // Prescription finalize failure is non-blocking
        }
      }

      // Step 14: Set prescription resolution (PRESCRIPTION_CREATED if meds exist, else NO_PRESCRIPTION_REQUIRED)
      const hasMeds =
        selectedPrescription?.medications &&
        selectedPrescription.medications.length > 0;
      if (encounterId && String(encounterId) !== "ENC-TEMP") {
        try {
          await consultationApi.setPrescriptionResolution(encounterId, {
            outcome: hasMeds
              ? "PRESCRIPTION_CREATED"
              : "NO_PRESCRIPTION_REQUIRED",
          });
        } catch (resErr) {
          console.warn("Prescription resolution warning:", resErr);
        }

        // Step 19: Finalization check (non-blocking)
        try {
          await encountersApi.getFinalizationCheck(encounterId);
        } catch {
          // non-blocking
        }

        // Step 20: Finalize encounter (non-blocking if encounter missing in backend)
        try {
          let version = selectedEncounter?.version;
          const latestEncounter =
            await consultationApi.getEncounter(encounterId);
          if (latestEncounter && latestEncounter.version !== undefined) {
            version = latestEncounter.version;
          }
          await encountersApi.finalizeEncounter(encounterId, {
            confirmation: true,
            version,
          });
        } catch (encErr) {
          console.warn("Finalize encounter warning:", encErr);
        }
      }

      // Complete appointment using dedicated doctor endpoint & update status to COMPLETED
      if (appointmentId) {
        try {
          const latestAppointment =
            await appointmentsApi.getAppointmentById(appointmentId);
          const currentStatus =
            latestAppointment?.data?.status;

          if (currentStatus !== "COMPLETED") {
            if (currentStatus !== "IN_CONSULTATION") {
              try {
                await appointmentsApi.updateAppointmentStatus(
                  appointmentId,
                  "IN_CONSULTATION",
                );
              } catch {
                // May already be in consultation
              }
            }
            try {
              await consultationApi.completeAppointment(appointmentId);
            } catch (compErr: unknown) {
              const msg =
                compErr instanceof Error
                  ? compErr.message
                  : String(compErr || "");
              if (!msg.includes("COMPLETED")) {
                try {
                  await appointmentsApi.updateAppointmentStatus(
                    appointmentId,
                    "COMPLETED",
                    "OPD consultation completed",
                  );
                } catch {
                  // Ignore if already completed in backend
                }
              }
            }
          }
        } catch (aptErr) {
          console.warn(
            "Non-blocking appointment status completion warning:",
            aptErr,
          );
        }
      }

      consultationStoreActions.setStatus("COMPLETED");
      consultationStoreActions.reset();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to finalize consultation";
      consultationStoreActions.setError(errorMessage);
      throw err;
    } finally {
      consultationStoreActions.setLoading(false);
    }
  },

  /**
   * Action: Load Full Consultation Details from APIs
   */
  loadFullConsultationDetails: async (
    consultationId: string | number,
  ): Promise<Record<string, unknown>> => {
    consultationStoreActions.setLoading(true);
    try {
      // 1. Fetch consultation details
      const consultation =
        await consultationApi.getConsultationDetails(consultationId);

      if (!consultation) {
        throw new Error("Consultation details not found");
      }

      const cnsRecord = consultation;

      const encounterId = cnsRecord.encounterId || `ENC-${consultationId}`;

      // 2. Fetch encounter
      const encounter = await consultationApi.getEncounter(encounterId);

      // 3. Fetch vitals
      const vitals = await consultationApi.loadEncounterVitals(encounterId);

      // 4. Fetch diagnoses
      const diagnoses = await consultationApi.getDiagnoses(encounterId);

      // 5. Fetch prescription
      const prescription = await consultationApi.getPrescription(encounterId);

      const normalizedVitals = vitals
        ? {
            height: vitals.height || cnsRecord.vitals?.height || "",
            weight: vitals.weight || cnsRecord.vitals?.weight || "",
            bmi: vitals.bmi || cnsRecord.vitals?.bmi || "",
            temp: vitals.temp || cnsRecord.vitals?.temp || "",
            bp: vitals.bp || cnsRecord.vitals?.bp || "",
            pulse: vitals.pulse || cnsRecord.vitals?.pulse || "",
            respiratoryRate:
              vitals.respiratoryRate || cnsRecord.vitals?.respiratoryRate || "",
            spo2: vitals.spo2 || cnsRecord.vitals?.spo2 || "",
            bloodSugar: vitals.bloodSugar || cnsRecord.vitals?.bloodSugar || "",
          }
        : cnsRecord.vitals;

      const fullRecord: ConsultationRecord = {
        ...cnsRecord,
        vitals: normalizedVitals,
        finalDiagnosis:
          diagnoses.length > 0
            ? diagnoses[0].diagnosisName
            : cnsRecord.finalDiagnosis,
        icdCode:
          diagnoses.length > 0
            ? `${diagnoses[0].diagnosisCode} — ${diagnoses[0].diagnosisName}`
            : cnsRecord.icdCode,
        medicines:
          prescription && prescription.medications
            ? prescription.medications.map(
                (med: Record<string, unknown>, idx: number) => ({
                  id: String(med.id || idx),
                  name: med.medicineName || med.name,
                  dosage: med.strength || med.dosage,
                  frequency: med.frequencyDisplay || med.frequency,
                  duration: `${med.durationValue || 7} Days`,
                  instructions: med.instructions || "",
                }),
              )
            : cnsRecord.medicines,
      };

      consultationStoreActions.setConsultation(fullRecord);
      consultationStoreActions.setEncounter(encounter);
      consultationStoreActions.setPrescription(prescription);
      consultationStoreActions.setVitals(vitals);
      consultationStoreActions.setDiagnoses(diagnoses);

      return {
        consultation: fullRecord,
        encounter,
        prescription,
        diagnoses,
        vitals,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load consultation details";
      consultationStoreActions.setError(errorMessage);
      throw new Error(errorMessage, { cause: err });
    } finally {
      consultationStoreActions.setLoading(false);
    }
  },
};
