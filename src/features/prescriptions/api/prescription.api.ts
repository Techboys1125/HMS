import { apiClient } from "../../../lib/axios";
import type { ApiPatientPrescription } from "../../patients/types/patient.types";

export interface ApiEnvelope<T> {
  data: T;
  status: number;
}

export const prescriptionApi = {
  getPrescriptions: async (mrn?: string): Promise<ApiPatientPrescription[]> => {
    try {
      const url = mrn 
        ? `/api/v1/patient/prescriptions?mrn=${mrn}`
        : "/api/v1/patient/prescriptions";
      const response = await apiClient.get<any>(url);
      const body = response.data;

      if (Array.isArray(body)) return body;
      if (body !== null && typeof body === "object" && "data" in body) {
        const inner = body.data;
        if (Array.isArray(inner)) return inner;
        if (inner && typeof inner === "object" && "content" in inner && Array.isArray(inner.content)) {
          return inner.content;
        }
      }
      if (body !== null && typeof body === "object" && "content" in body && Array.isArray(body.content)) {
        return body.content;
      }
      return [];
    } catch {
      return [];
    }
  },

  getPrescriptionById: async (id: string | number): Promise<ApiPatientPrescription | null> => {
    try {
      const response = await apiClient.get<any>(`/api/v1/patient/prescriptions/${id}`);
      return response.data?.data || response.data || null;
    } catch {
      return null;
    }
  },

  finalizePrescription: async (
    prescriptionId: string | number,
    payload: { confirmation: boolean } = { confirmation: true }
  ): Promise<any> => {
    const response = await apiClient.post<any>(
      `/api/v1/prescriptions/${prescriptionId}/finalize`,
      payload
    );
    return response.data?.data || response.data;
  }
};
