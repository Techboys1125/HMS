import { patientsApi } from "../api/patient.api";
import type { PatientQueueData } from "../types/patient.types";
import { ApiError } from "../../../lib/axios";

export const patientQueueService = {
  async getPatientQueue(mrn?: string): Promise<PatientQueueData | null> {
    if (!mrn) return null;
    try {
      const res = await patientsApi.getPatientQueue(mrn);
      if (!res) return null;
      return {
        appointmentId: res.appointmentId,
        token: res.token || "",
        tokenNumber: res.token || "",
        position: res.position || 0,
        patientsAhead: res.patientsAhead,
        estimatedWaitMinutes: res.estimatedWaitMinutes,
        status: res.status,
        queueStatus: res.status,
        doctorName: res.doctorName,
        departmentName: res.departmentName,
      };
    } catch (err) {
      if (err instanceof ApiError && err.response?.status === 404) {
        return null;
      }
      throw err;
    }
  },
};
