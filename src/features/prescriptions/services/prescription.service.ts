import { prescriptionApi } from "../api/prescription.api";
import { encountersApi } from "../../encounters/api/encounters.api";
import { prescriptionStoreActions } from "../store/prescription.store";
import type {
  UnifiedPrescription,
  RxStatus,
  PatientPrescriptionSummary,
} from "../types/prescription.types";
import type { ApiPatientPrescription } from "../../patients/types/patient.types";

export const prescriptionService = {
  mapApiToUnified: (
    apiRx: ApiPatientPrescription,
    fallbackPatientName?: string,
  ): UnifiedPrescription => {
    const statusRaw = String(apiRx.status ?? "").toUpperCase();
    let status: RxStatus = "Issued";
    if (statusRaw.startsWith("DRAFT")) {
      status = "Draft";
    } else if (
      statusRaw.startsWith("FINALIZED") ||
      statusRaw.startsWith("COMPLETED")
    ) {
      status = "Completed";
    } else if (statusRaw.startsWith("CANCELLED")) {
      status = "Cancelled";
    } else if (statusRaw.startsWith("ARCHIVED")) {
      status = "Archived";
    }

    const medicines = (apiRx.medicines || []).map((m) => ({
      name: m.medicineName || m.name || "",
      strength: m.strength || "",
      route: m.route || "ORAL",
      dosage: m.dose != null ? String(m.dose) : m.dosage || "",
      frequency: m.frequency != null ? String(m.frequency) : "",
      duration: m.duration != null ? String(m.duration) : "",
      instructions: m.instructions || "",
    }));

    return {
      id: String(apiRx.id ?? ""),
      patientName: fallbackPatientName || "Patient",
      mrn: "",
      consultationId: "",
      department: apiRx.department || "",
      consultationDate: apiRx.date || "",
      medicineCount: apiRx.medicineCount || medicines.length,
      followup: !!apiRx.followUpDate,
      followupDate: apiRx.followUpDate || "",
      status,
      doctorName: apiRx.doctorName || "",
      diagnosis: apiRx.diagnosis || "",
      medicines,
    };
  },

  mapPatientSummaryToUnified: (
    rx: PatientPrescriptionSummary,
  ): UnifiedPrescription => {
    const statusRaw = String(rx.prescriptionStatus ?? "").toUpperCase();
    let status: RxStatus = "Issued";
    if (statusRaw === "DRAFT") status = "Draft";
    else if (statusRaw === "FINALIZED" || statusRaw === "COMPLETED")
      status = "Completed";
    else if (statusRaw === "CANCELLED") status = "Cancelled";
    else if (statusRaw === "ARCHIVED") status = "Archived";

    const medicineCount = rx.medications?.totalMedicines ?? 0;
    const sampleMedicines = rx.medications?.sampleMedicines ?? [];

    return {
      id: String(rx.prescriptionId ?? ""),
      patientName: "Patient",
      mrn: "",
      consultationId: String(rx.encounterId || rx.appointmentId || ""),
      department: rx.department?.departmentName || "",
      consultationDate: rx.visitDateTime || rx.createdAt || "",
      medicineCount,
      followup: !!rx.followUp?.required,
      followupDate: rx.followUp?.followUpDate || "",
      status,
      doctorName: rx.doctor?.doctorName || "",
      diagnosis: rx.diagnosis?.primaryDiagnosis || "",
      medicines: sampleMedicines.map((name) => ({
        name,
        strength: "",
        route: "ORAL",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      })),
    };
  },

  loadPrescriptions: async (
    mrn?: string,
    doctorNameFilter?: string,
  ): Promise<UnifiedPrescription[]> => {
    prescriptionStoreActions.setLoading(true);
    try {
      const records = await prescriptionApi.getPrescriptions(mrn);
      let mapped = records.map((rx) =>
        prescriptionService.mapApiToUnified(
          rx,
          mrn ? undefined : "General Patient",
        ),
      );

      if (doctorNameFilter) {
        const query = doctorNameFilter.toLowerCase();
        mapped = mapped.filter((rx) =>
          rx.doctorName.toLowerCase().includes(query),
        );
      }

      prescriptionStoreActions.setPrescriptions(mapped);
      return mapped;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to load prescriptions";
      prescriptionStoreActions.setError(msg);
      return [];
    } finally {
      prescriptionStoreActions.setLoading(false);
    }
  },

  loadPatientPrescriptions: async (
    mrn: string,
    params?: {
      page?: number;
      size?: number;
      status?: string;
      fromDate?: string;
      toDate?: string;
    },
  ): Promise<UnifiedPrescription[]> => {
    prescriptionStoreActions.setLoading(true);
    try {
      const result = await prescriptionApi.getPatientPrescriptions(mrn, params);
      const mapped = (result.content || []).map((rx) =>
        prescriptionService.mapPatientSummaryToUnified(rx),
      );
      prescriptionStoreActions.setPrescriptions(mapped);
      return mapped;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to load prescriptions";
      prescriptionStoreActions.setError(msg);
      return [];
    } finally {
      prescriptionStoreActions.setLoading(false);
    }
  },

  getPrescriptionDetails: async (
    id: string | number,
  ): Promise<UnifiedPrescription | null> => {
    prescriptionStoreActions.setLoading(true);
    try {
      const apiRx = await prescriptionApi.getPrescriptionById(id);
      if (apiRx) {
        const unified = prescriptionService.mapApiToUnified(apiRx);
        prescriptionStoreActions.setSelectedPrescription(unified);
        return unified;
      }
      return null;
    } catch {
      return null;
    } finally {
      prescriptionStoreActions.setLoading(false);
    }
  },

  getEncounterPrescription: async (
    encounterId: string | number,
  ): Promise<UnifiedPrescription | null> => {
    try {
      const apiRx = await prescriptionApi.getEncounterPrescription(encounterId);
      if (apiRx) {
        const unified = prescriptionService.mapApiToUnified(apiRx);
        prescriptionStoreActions.setSelectedPrescription(unified);
        return unified;
      }
      return null;
    } catch {
      return null;
    }
  },

  createPrescription: async (
    encounterId: string | number,
    payload: { outcome: string },
  ) => {
    try {
      return await encountersApi.createPrescription(encounterId, payload);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to create prescription";
      prescriptionStoreActions.setError(msg);
      throw err;
    }
  },

  addMedication: async (
    prescriptionId: string | number,
    payload: Record<string, unknown>,
  ) => {
    try {
      return await encountersApi.addMedication(prescriptionId, payload);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to add medication";
      prescriptionStoreActions.setError(msg);
      throw err;
    }
  },

  saveAdvice: async (
    prescriptionId: string | number,
    payload: {
      generalAdvice?: string;
      dietAdvice?: string;
      precautions?: string;
    },
  ) => {
    try {
      return await encountersApi.savePrescriptionAdvice(
        prescriptionId,
        payload,
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save advice";
      prescriptionStoreActions.setError(msg);
      throw err;
    }
  },

  validatePrescription: async (prescriptionId: string | number) => {
    try {
      return await encountersApi.validatePrescription(prescriptionId);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to validate prescription";
      prescriptionStoreActions.setError(msg);
      throw err;
    }
  },

  finalizePrescription: async (id: string | number): Promise<boolean> => {
    try {
      await prescriptionApi.finalizePrescription(id);
      return true;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to finalize prescription";
      prescriptionStoreActions.setError(msg);
      return false;
    }
  },

  createAmendment: async (
    prescriptionId: string | number,
    payload?: { reason?: string },
  ) => {
    try {
      return await prescriptionApi.createAmendment(prescriptionId, payload);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to create amendment";
      prescriptionStoreActions.setError(msg);
      throw err;
    }
  },

  reprintPrescription: async (
    prescriptionId: string | number,
    payload?: { reason?: string },
  ) => {
    try {
      return await prescriptionApi.reprintPrescription(prescriptionId, payload);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to reprint prescription";
      prescriptionStoreActions.setError(msg);
      throw err;
    }
  },

  getPrintOutput: async (prescriptionId: string | number) => {
    try {
      return await prescriptionApi.getPrintOutput(prescriptionId);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to load print layout";
      prescriptionStoreActions.setError(msg);
      return null;
    }
  },
};
