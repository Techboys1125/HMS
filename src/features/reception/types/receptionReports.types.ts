// ─── Reception Reports API Types ─────────────────────────────────────────────

export interface ReceptionActivityLogItem {
  time: string;
  title: string;
  description: string;
}

export interface ReceptionActivityLogResponse {
  content: ReceptionActivityLogItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ReceptionAppointmentStatusData {
  booked: number;
  checkedIn: number;
  completed: number;
  waiting: number;
  cancelled: number;
  noShow: number;
}

export interface ReceptionCheckinAnalyticsData {
  morning: number;
  afternoon: number;
  evening: number;
}

export interface ReceptionDashboardSummaryData {
  date: string;
  registrations: {
    total: number;
    newPatients: number;
    returningPatients: number;
    growthPercentage: number;
  };
  appointments: {
    booked: number;
    completed: number;
    cancelled: number;
    noShow: number;
  };
  checkIn: {
    checkedIn: number;
    completionRate: number;
  };
  queue: {
    waiting: number;
    averageQueueTimeMinutes: number;
  };
  waitingTime: {
    averageMinutes: number;
    targetMet: boolean;
  };
}

export interface ReceptionQueuePerformanceData {
  completedQueue: number;
  waitingPatients: number;
  averageWaitingMinutes: number;
}

export interface ReceptionRegisterItem {
  mrn: string;
  patientName: string;
  appointmentId: string;
  visitType: string;
  registrationTime: string;
  checkInTime: string;
  queueStatus: string;
  appointmentStatus: string;
}

export interface ReceptionRegisterResponse {
  content: ReceptionRegisterItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ReceptionRegistrationTrendData {
  labels: string[];
  newPatients: number[];
  returningPatients: number[];
}

export interface ReceptionSummaryWidgetData {
  registrations: number;
  appointments: number;
  checkedIn: number;
  waiting: number;
  completedCheckIns: number;
  averageWaitingMinutes: number;
}
