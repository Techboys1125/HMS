import { apiClient } from "../../../lib/axios";
import type {
  FinalizePrescriptionRequest,
  FinalizePrescriptionResponse,
  DoctorApiResponse,
} from "../types/doctors.types";

export const prescriptionsApi = {
  /**
   * POST /api/v1/prescriptions/{prescriptionId}/finalize
   */
  finalizePrescription: async (
    prescriptionId: string | number,
    payload: FinalizePrescriptionRequest = { confirmation: true },
  ): Promise<FinalizePrescriptionResponse> => {
    const response = await apiClient.post<
      DoctorApiResponse<FinalizePrescriptionResponse> | FinalizePrescriptionResponse
    >(`/api/v1/prescriptions/${prescriptionId}/finalize`, payload);

    const data =
      (response.data as DoctorApiResponse<FinalizePrescriptionResponse>)?.data ||
      (response.data as FinalizePrescriptionResponse);

    return data;
  },
};
