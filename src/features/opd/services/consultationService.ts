import type { AppointmentRecord } from "../../appointments/types/appointment.types";
import { consultationApi } from "../api/consultationApi";
import { consultationStoreActions } from "../store/consultationStore";
import type { PatientVitals } from "../types/vitals";
import type {
  ConsultationRecord,
  VisitType,
  ConsultationStatus,
  MedicineItem,
} from "../types/consultation";
import { encountersApi } from "../../encounters/api/encounters.api";
import { appointmentsApi } from "../../appointments/api/appointments.api";
import type { Diagnosis } from "../../encounters";

export const consultationService = {
  /**
   * Action: Doctor calls patient from queue
   * PATCH /api/v1/queue/{appointmentId}/call → transitions to CALLED
   * Falls back to PATCH /api/v1/appointments/{id}/status
   */
  callPatient: async (
    appointmentId: string | number,
    alternateId?: string | number,
  ) => {
    let numericId: string | number = appointmentId;
    if (typeof appointmentId === "string" && appointmentId.includes("-")) {
      const parsed = parseInt(appointmentId.split("-").pop() || "", 10);
      if (!isNaN(parsed) && parsed > 0) {
        numericId = parsed;
      }
    }

    let altNumericId: string | number | undefined = alternateId;
    if (typeof alternateId === "string" && alternateId.includes("-")) {
      const parsed = parseInt(alternateId.split("-").pop() || "", 10);
      if (!isNaN(parsed) && parsed > 0) {
        altNumericId = parsed;
      }
    }

    const idsToTry = Array.from(
      new Set(
        [numericId, appointmentId, altNumericId, alternateId].filter(
          (id): id is string | number =>
            id !== undefined && id !== null && id !== "" && id !== 0,
        ),
      ),
    );

    let lastError: unknown;
    for (const id of idsToTry) {
      try {
        await consultationApi.callPatientFromQueue(id);
        consultationStoreActions.setStatus("CALLED");
        return;
      } catch (err) {
        lastError = err;
      }
    }

    for (const id of idsToTry) {
      try {
        await appointmentsApi.updateAppointmentStatus(id, "CALLED");
        consultationStoreActions.setStatus("CALLED");
        return;
      } catch (err) {
        lastError = err;
      }
    }

    if (lastError) throw lastError;
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

      // Transition appointment status to IN_CONSULTATION in backend
      try {
        await appointmentsApi.doctorStartConsultation(appointmentId);
      } catch (startErr) {
        console.warn(
          "Transition appointment to IN_CONSULTATION warning:",
          startErr,
        );
      }

      // 1. Create Encounter with linked patient
      const patientId =
        appointment.patientId ||
        (typeof (appointment as unknown as Record<string, unknown>).patient === "object"
          ? ((appointment as unknown as Record<string, unknown>).patient as { id?: string | number })?.id
          : undefined);
      const encounter = await consultationApi.createEncounter(
        appointmentId,
        patientId,
      );
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
      const { selectedPrescription } = consultationStoreActions.getState();
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

        // Ensure appointment status is IN_CONSULTATION in backend before finalization
        if (appointmentId) {
          try {
            await appointmentsApi.doctorStartConsultation(appointmentId);
          } catch {
            // non-blocking
          }
        }

        let encounterFinalized = false;
        const MAX_RETRIES = 3;
        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
          try {
            // Always fetch the freshest encounter right before finalizing
            const freshEncounter = await consultationApi
              .getEncounter(encounterId)
              .catch(() => null);
            const freshVersion = freshEncounter?.version;
            if (freshEncounter) {
              consultationStoreActions.setEncounter(freshEncounter);
            }

            await encountersApi.finalizeEncounter(encounterId, {
              confirmation: true,
              version: freshVersion,
            });
            encounterFinalized = true;
            break; // Success — exit retry loop
          } catch (finalizeErr: unknown) {
            const errMsg = String(
              (finalizeErr as { message?: string })?.message || finalizeErr,
            );
            const isStale =
              errMsg.includes("STALE_ENCOUNTER") ||
              errMsg.includes("modified") ||
              errMsg.includes("409");
            const isStateErr =
              errMsg.includes("IN_CONSULTATION") ||
              errMsg.includes("INVALID_STATE");

            if (isStateErr && appointmentId && attempt < MAX_RETRIES - 1) {
              try {
                await appointmentsApi.doctorStartConsultation(appointmentId);
              } catch {
                // non-blocking
              }
            }

            if ((isStale || isStateErr) && attempt < MAX_RETRIES - 1) {
              // Brief delay to let any pending DB writes settle, then retry
              await new Promise((r) => setTimeout(r, 200 * (attempt + 1)));
              continue;
            }

            // Fallback to legacy adapter endpoint: POST /api/v1/encounters/appointment/{appointmentId}/finalize
            if (appointmentId) {
              try {
                const legacyRes =
                  await encountersApi.finalizeEncounterByAppointment(
                    appointmentId,
                  );
                if (legacyRes) {
                  encounterFinalized = true;
                  break;
                }
              } catch {
                // non-blocking
              }
            }

            // Fallback to appointment status completion endpoint if encounter finalization failed due to state
            if (!encounterFinalized && appointmentId) {
              try {
                const compRes = await consultationApi.completeAppointment(appointmentId);
                if (compRes?.success) {
                  encounterFinalized = true;
                  break;
                }
              } catch (aptErr) {
                console.warn("Appointment completion fallback warning:", aptErr);
              }
            }

            if (!encounterFinalized) {
              throw finalizeErr;
            }
          }
        }

        // If encounter finalization didn't run or wasn't applicable, complete appointment as fallback
        if (appointmentId && !encounterFinalized) {
          try {
            await consultationApi.completeAppointment(appointmentId);
          } catch (aptErr) {
            console.warn(
              "Non-blocking appointment status completion warning:",
              aptErr,
            );
          }
        }
      } else if (appointmentId) {
        // No encounter exists, complete appointment directly
        try {
          await consultationApi.completeAppointment(appointmentId);
        } catch (aptErr) {
          console.warn(
            "Non-blocking appointment status completion warning:",
            aptErr,
          );
        }
      }

      const currentStoreState = consultationStoreActions.getState();
      if (currentStoreState.selectedAppointment) {
        consultationStoreActions.setAppointment({
          ...currentStoreState.selectedAppointment,
          status: "COMPLETED",
        });
      }
      if (currentStoreState.selectedConsultation) {
        consultationStoreActions.setConsultation({
          ...currentStoreState.selectedConsultation,
          status: "COMPLETED",
        });
      }
      consultationStoreActions.setStatus("COMPLETED");
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
        // Fallback: Check aggregated clinical workspace endpoint GET /api/v1/encounters/{id}/workspace
        const workspace =
          await consultationApi.getEncounterWorkspace(consultationId);
        if (workspace && (workspace.consultation || workspace.encounter)) {
          return workspace;
        }
        throw new Error("Consultation details not found");
      }

      const cnsRecord = consultation as unknown as Record<string, unknown>;

      const encounterId =
        (cnsRecord.encounterId as string | number) || `ENC-${consultationId}`;

      // 2-5. Fetch encounter, vitals, diagnoses, and prescription in parallel
      const [encounter, vitals, rawDiagnoses, prescription] = await Promise.all(
        [
          consultationApi.getEncounter(encounterId),
          consultationApi.loadEncounterVitals(encounterId),
          consultationApi.getDiagnoses(encounterId),
          consultationApi.getPrescription(encounterId),
        ],
      );

      const diagnoses: Diagnosis[] = Array.isArray(rawDiagnoses)
        ? rawDiagnoses
        : [];

      const vitalsRecord = (cnsRecord.vitals || {}) as Record<string, unknown>;
      const patientRecord = (cnsRecord.patient || {}) as Record<
        string,
        unknown
      >;

      const normalizedVitals = vitals
        ? {
            height: String(vitals.height || vitalsRecord.height || ""),
            weight: String(vitals.weight || vitalsRecord.weight || ""),
            bmi: String(vitals.bmi || vitalsRecord.bmi || ""),
            temp: String(vitals.temp || vitalsRecord.temp || ""),
            bp: String(vitals.bp || vitalsRecord.bp || ""),
            pulse: String(vitals.pulse || vitalsRecord.pulse || ""),
            respiratoryRate: String(
              vitals.respiratoryRate || vitalsRecord.respiratoryRate || "",
            ),
            spo2: String(vitals.spo2 || vitalsRecord.spo2 || ""),
            bloodSugar: String(
              vitals.bloodSugar || vitalsRecord.bloodSugar || "",
            ),
          }
        : (cnsRecord.vitals as PatientVitals | undefined);

      const fullRecord: ConsultationRecord = {
        id: String(cnsRecord.id || consultationId),
        appointmentId: Number(cnsRecord.appointmentId || consultationId),
        tokenNo: String(cnsRecord.tokenNo || cnsRecord.token || ""),
        patientName: String(
          cnsRecord.patientName || patientRecord.name || "Patient",
        ),
        mrn: String(cnsRecord.mrn || patientRecord.mrn || ""),
        age: Number(cnsRecord.age || patientRecord.age || 0),
        gender: (cnsRecord.gender || patientRecord.gender || "Other") as
          "Male" | "Female" | "Other",
        phone: String(cnsRecord.phone || patientRecord.contact || ""),
        doctor: String(cnsRecord.doctor || cnsRecord.doctorName || ""),
        department: String(
          cnsRecord.department || cnsRecord.departmentName || "",
        ),
        appointmentTime: String(
          cnsRecord.appointmentTime || cnsRecord.checkInTime || "",
        ),
        visitType: (cnsRecord.visitType || "First Visit") as
          "First Visit" | "Follow-up",
        status: (cnsRecord.status || "IN_CONSULTATION") as ConsultationStatus,
        chiefComplaint: String(cnsRecord.chiefComplaint || ""),
        opdRoom: String(cnsRecord.opdRoom || ""),
        date: String(cnsRecord.date || new Date().toISOString().split("T")[0]),
        vitals: normalizedVitals as PatientVitals,
        finalDiagnosis: String(
          diagnoses.length > 0 && diagnoses[0].diagnosisName
            ? diagnoses[0].diagnosisName
            : cnsRecord.finalDiagnosis || "",
        ),
        icdCode: String(
          diagnoses.length > 0 && diagnoses[0].diagnosisCode
            ? `${diagnoses[0].diagnosisCode} — ${diagnoses[0].diagnosisName || ""}`
            : cnsRecord.icdCode || "",
        ),
        medicines:
          prescription && prescription.medications
            ? prescription.medications.map(
                (med: Record<string, unknown>, idx: number): MedicineItem => ({
                  id: String(med.id || idx),
                  name: String(med.medicineName || med.name || ""),
                  dosage: String(med.strength || med.dosage || ""),
                  frequency: String(
                    med.frequencyDisplay || med.frequency || "",
                  ),
                  duration: `${med.durationValue || 7} Days`,
                  instructions: String(med.instructions || ""),
                }),
              )
            : Array.isArray(cnsRecord.medicines)
              ? cnsRecord.medicines.map(
                  (
                    med: Record<string, unknown>,
                    idx: number,
                  ): MedicineItem => ({
                    id: String(med.id || idx),
                    name: String(med.medicineName || med.name || ""),
                    dosage: String(med.strength || med.dosage || ""),
                    frequency: String(
                      med.frequencyDisplay || med.frequency || "",
                    ),
                    duration: String(
                      med.duration || `${med.durationValue || 7} Days`,
                    ),
                    instructions: String(med.instructions || ""),
                  }),
                )
              : [],
        ...cnsRecord,
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
