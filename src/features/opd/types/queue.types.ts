export type QueueStatus =
  | "WAITING"
  | "WAITING_FOR_VITALS"
  | "WAITING_FOR_DOCTOR"
  | "WAITING_FOR_DOCTOR_CALL"
  | "CALLED"
  | "IN_CONSULTATION"
  | "COMPLETED";

interface QueuePatient {
  name: string;
  mrn: string;
  age: number;
  gender: string;
  contact: string;
  dateOfBirth?: string;
}

interface QueueDoctor {
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
  appointmentTime?: string;
  visitType?: string;
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

export interface QueueListParams {
  doctorId?: number;
  departmentId?: number;
  date?: string;
  status?: QueueStatus;
  search?: string;
  page?: number;
  size?: number;
}
