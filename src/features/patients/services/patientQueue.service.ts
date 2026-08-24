import { patientsApi } from "../api/patient.api";
import type { PatientQueueData } from "../types/patient.types";

export const patientQueueService = {
  async getPatientQueue(mrn?: string): Promise<PatientQueueData | null> {
    if (!mrn) {
      return null;
    }

    try {
      const res = await patientsApi.getPatientQueue(mrn);

      if (!res) {
        return null;
      }

      return {
        appointmentId: res.appointmentId ?? 0,
        token: res.token || "",
        tokenNumber: res.token || "",
        position: res.position || 0,
        patientsAhead: res.patientsAhead || 0,
        estimatedWaitMinutes: res.estimatedWaitMinutes || 0,
        status: res.status || res.queueStatus || "NONE",
        queueStatus: res.status || res.queueStatus || "NONE",
        doctorName: res.doctorName || "",
        departmentName: res.departmentName || "",
      };
    } catch (error) {
      console.error(
        "[patientQueueService] Failed to load patient queue:",
        error,
      );
      throw error;
    }
  },
};
