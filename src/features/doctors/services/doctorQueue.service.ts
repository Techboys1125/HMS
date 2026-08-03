import { doctorsApi } from "../api/doctors.api";
import type { DoctorQueueItem, DoctorCallNextResponse, DoctorQueueSummary } from "../types/doctors.types";

export const doctorQueueService = {
  async getDoctorQueue(doctorId: number | string): Promise<{
    summary: DoctorQueueSummary;
    content: DoctorQueueItem[];
    currentPatient: DoctorQueueItem | null;
    nextPatient: DoctorQueueItem | null;
  }> {
    const res = await doctorsApi.getQueue(doctorId);
    const content = res.content || [];
    const currentPatient = content.find((item) => item.status === "CALLED" || item.status === "IN_CONSULTATION") || null;
    const nextPatient = content.find((item) => item.status === "WAITING" || item.status === "WAITING_FOR_DOCTOR") || null;

    return {
      summary: res.summary || {},
      content,
      currentPatient,
      nextPatient,
    };
  },

  async callNextPatient(doctorId: number | string): Promise<DoctorCallNextResponse> {
    return doctorsApi.callNext(doctorId);
  },
};
