export type QueueStatus =
  | "BOOKED"
  | "CHECKED_IN"
  | "WAITING"
  | "WAITING_FOR_VITALS"
  | "IN_VITALS"
  | "WAITING_FOR_DOCTOR"
  | "CALLED"
  | "IN_CONSULTATION"
  | "CONSULTATION_COMPLETED"
  | "BILLING_PENDING"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export type QueuePriority = "LOW" | "NORMAL" | "HIGH" | "EMERGENCY";

export interface QueuePatientInfo {
  id?: number | string;
  name: string;
  fullName?: string;
  mrn: string;
  age: number | string;
  gender: string;
  contact?: string;
  mobile?: string;
  bloodGroup?: string;
}

export interface QueueDoctorInfo {
  doctorId: number | string;
  name: string;
  doctorCode?: string;
  department?: string;
  specialty?: string;
}

export interface BaseQueueItem {
  queueId?: number | string;
  appointmentId: number | string;
  appointmentNumber: string;
  token: string;
  queueNumber: number;
  position: number;
  priority: QueuePriority | string;
  status: QueueStatus | string;
  checkInTime?: string;
  patient: QueuePatientInfo;
  doctor?: QueueDoctorInfo;
  estimatedWaitMinutes?: number;
  patientsAhead?: number;
}

export interface QueueSummaryData {
  waitingCount: number;
  inConsultationCount: number;
  completedCount: number;
  totalCount: number;
  [key: string]: number;
}

export interface QueuePageMeta {
  pageNumber?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?: number;
  [key: string]: unknown;
}

export interface GenericQueueResponse<T = BaseQueueItem[]> {
  success: boolean;
  code?: string;
  message?: string;
  timestamp?: string;
  data: {
    summary?: QueueSummaryData;
    content?: T;
    page?: QueuePageMeta;
  } | T;
  errors?: Record<string, unknown>;
}
