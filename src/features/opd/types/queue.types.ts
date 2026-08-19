export type QueueStatus = "WAITING" | "WAITING_FOR_VITALS" | "WAITING_FOR_DOCTOR" | "WAITING_FOR_DOCTOR_CALL" | "CALLED" | "IN_CONSULTATION" | "COMPLETED";

export interface QueuePatient {
  name: string;
  mrn: string;
  age: number;
  gender: string;
  contact: string;
}

export interface QueueDoctor {
  doctorId: number;
  name: string;
  doctorCode: string;
  department: string;
  specialty: string;
}

export interface QueueItem {
  queueId: number;
  appointmentId: number;
  appointmentNumber: string;
  token: string;
  queueNumber: number;
  position: number;
  priority: string;
  status: QueueStatus;
  queueStatus?: QueueStatus;
  checkInTime: string;
  patient: QueuePatient;
  doctor: QueueDoctor;
}

export interface QueueSummary {
  completed: number;
  waiting: number;
  called: number;
  inConsultation: number;
}

export interface QueuePage {
  size: number;
  totalElements: number;
  page: number;
}

export interface QueueApiResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    summary: QueueSummary;
    content: QueueItem[];
    page: QueuePage;
  };
  errors: Record<string, unknown>;
}

export interface QueueListParams {
  doctorId?: number;
  departmentId?: number;
  date?: string;
  status?: QueueStatus;
  search?: string;
  page?: number;
  size?: number;
}
