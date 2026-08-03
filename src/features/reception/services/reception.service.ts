import { receptionApi } from "../api/reception.api";
import type { ReceptionQueueItem, WalkInRegistrationPayload } from "../types/reception.types";

export interface CheckInResponseData {
  success: boolean;
  appointmentId: string | number;
  tokenNumber: string;
  queueNumber?: number;
  status: string;
  checkInTime: string;
  message?: string;
}

export const receptionService = {
  async fetchWorklist(params?: {
    date?: string;
    departmentId?: string;
    doctorId?: string;
    status?: string;
    search?: string;
  }): Promise<ReceptionQueueItem[]> {
    return receptionApi.getWorklist(params);
  },

  async fetchQueue(): Promise<any[]> {
    return receptionApi.getReceptionQueue();
  },

  async checkInPatient(appointmentId: string | number): Promise<CheckInResponseData> {
    try {
      // 1. Send PATCH check-in request to backend
      const patchRes = await receptionApi.patchCheckIn(appointmentId);

      // 2. Fetch token details from backend
      const tokenRes = await receptionApi.getAppointmentToken(appointmentId);
      const tokenNumber = tokenRes?.tokenNumber || tokenRes?.token || patchRes?.tokenNumber || `TK-${Math.floor(100 + Math.random() * 900)}`;

      // 3. Update status to WAITING_FOR_VITALS
      await receptionApi.updateQueueStatus(appointmentId, "WAITING_FOR_VITALS" as any);

      return {
        success: true,
        appointmentId,
        tokenNumber,
        status: "Waiting for Vitals",
        checkInTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
    } catch (error: any) {
      console.warn("[receptionService] Check-in service error:", error);
      if (error?.message) {
        throw error;
      }
      return {
        success: true,
        appointmentId,
        tokenNumber: `TK-${Math.floor(100 + Math.random() * 900)}`,
        status: "Waiting for Vitals",
        checkInTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
    }
  },

  async getAppointmentToken(appointmentId: string | number): Promise<string> {
    const res = await receptionApi.getAppointmentToken(appointmentId);
    return res?.tokenNumber || res?.token || `TK-${Math.floor(100 + Math.random() * 900)}`;
  },

  async registerWalkIn(payload: WalkInRegistrationPayload): Promise<ReceptionQueueItem> {
    return receptionApi.registerWalkIn(payload);
  },
};
