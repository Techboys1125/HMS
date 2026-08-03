import { apiClient, axios } from "../../../lib/axios";
import type { BaseQueueItem } from "../types/queue.types";



export const queueApi = {
  /**
   * Generic fetch for reception/general queue
   */
  async getQueue(params?: {
    date?: string;
    departmentId?: string | number;
    doctorId?: string | number;
    status?: string;
  }): Promise<BaseQueueItem[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.date) queryParams.append("date", params.date);
      if (params?.departmentId) queryParams.append("departmentId", String(params.departmentId));
      if (params?.doctorId) queryParams.append("doctorId", String(params.doctorId));
      if (params?.status) queryParams.append("status", params.status);

      const qStr = queryParams.toString() ? `?${queryParams.toString()}` : "";
      let res;
      try {
        res = await apiClient.get<any>(`/api/v1/reception/queue${qStr}`);
      } catch (err) {
        if (axios.isAxiosError(err) && (err.response?.status === 404 || err.response?.status === 403)) {
          res = await apiClient.get<any>(`/api/v1/reception/worklist${qStr}`);
        } else {
          throw err;
        }
      }

      const raw = res.data;
      const list = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw?.data?.content)
        ? raw.data.content
        : Array.isArray(raw?.content)
        ? raw.content
        : [];

      return list.map((item: any, idx: number) => ({
        queueId: item.queueId || item.id || `Q-${idx + 1}`,
        appointmentId: item.appointmentId || item.id || idx + 1,
        appointmentNumber: item.appointmentNumber || item.tokenNumber || `APT-${1000 + idx}`,
        token: item.token || item.tokenNumber || `TK-${100 + idx}`,
        queueNumber: item.queueNumber || idx + 1,
        position: item.position || idx + 1,
        priority: item.priority || "NORMAL",
        status: item.status || item.queueStatus || "WAITING",
        checkInTime: item.checkInTime || item.arrivalTime,
        patient: {
          id: item.patient?.id || item.patientId,
          name: item.patient?.name || item.patient?.fullName || item.patientName || "Patient",
          mrn: item.patient?.mrn || item.mrn || `MRN-${100 + idx}`,
          age: item.patient?.age || item.age || 30,
          gender: item.patient?.gender || item.gender || "MALE",
          contact: item.patient?.contact || item.mobile || item.phone,
        },
        doctor: {
          doctorId: item.doctor?.doctorId || item.doctor?.id || item.doctorId || 1,
          name: item.doctor?.name || item.doctorName || "Duty Doctor",
          department: item.doctor?.department || item.departmentName || "General Medicine",
        },
      }));
    } catch (error) {
      console.warn("[queueApi] Fallback for getQueue:", error);
      return [];
    }
  },
};
