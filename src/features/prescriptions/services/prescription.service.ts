import { prescriptionApi } from "../api/prescription.api";
import { prescriptionStoreActions } from "../store/prescription.store";
import type {
  UnifiedPrescription,
  RxStatus,
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

    const medicines = (apiRx.medicines || []).map((m: any) => ({
      name: m.medicineName || m.name || "",
      strength: m.strength || "",
      route: m.route || "ORAL",
      dosage: m.dose?.value
        ? `${m.dose.value}${m.dose.unit || ""}`
        : m.dosage || "",
      frequency: m.frequency?.display || m.frequencyCode || m.frequency || "",
      duration: m.duration?.value
        ? `${m.duration.value} ${m.duration.unit || "DAYS"}`
        : m.duration || "",
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

  finalizePrescription: async (id: string | number): Promise<boolean> => {
    try {
      await prescriptionApi.finalizePrescription(id);
      return true;
    } catch {
      return false;
    }
  },
};
