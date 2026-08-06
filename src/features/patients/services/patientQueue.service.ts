import { patientsApi } from "../api/patient.api";
import type { PatientQueueData } from "../types/patient.types";

export const patientQueueService = {
  async getPatientQueue(mrn?: string): Promise<PatientQueueData | null> {
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
  },
};
