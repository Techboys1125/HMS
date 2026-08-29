export interface DoctorInfo {
  id: number;
  name: string;
  doctorCode: string;
}

export interface DoctorReportSummary {
  myPatients: number;
  newPatients: number;
  returningPatients: number;
  completedConsultations: number;
  scheduledFollowUps: number;
  averagePatientsPerDay: number;
  todayConsultations: number;
  monthlyConsultations: number;
}

export interface DoctorDailyAnalyticsData {
  statusBreakdown: {
    completed: number;
    scheduled: number;
    cancelled: number;
    waiting: number;
  };
  appointmentTrend: Array<{
    date: string;
    appointments: number;
    completed: number;
  }>;
  dailyWorkload: Array<{
    shift: string;
    appointments: number;
    completed: number;
  }>;
  visitTypeDistribution: Array<{
    visitType: string;
    count: number;
  }>;
}

export interface DoctorDailyDashboardData {
  doctor: DoctorInfo;
  reportDate: string;
  lastUpdated: string;
  summary: DoctorReportSummary;
}

export interface DoctorDailyRegisterItem {
  appointmentId: string;
  patientId: string;
  patientName: string;
  mrn: string;
  appointmentDate: string;
  appointmentTime: string;
  visitType: string;
  appointmentStatus: string;
  consultationStatus: string;
}

export interface DoctorDailyRegisterResponse {
  content: DoctorDailyRegisterItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface DoctorPatientAnalyticsData {
  consultationTrend: Array<{
    date: string;
    patients: number;
    completedConsultations: number;
  }>;
  followUpCompliance: {
    completed: number;
    scheduled: number;
    pending: number;
    missed: number;
  };
}

export interface DoctorPatientDashboardData {
  doctor: DoctorInfo;
  reportPeriod: {
    fromDate: string;
    toDate: string;
  };
  lastUpdated: string;
  summary: DoctorReportSummary;
}

export interface DoctorPatientRegisterItem {
  patientId: string;
  patientName: string;
  mrn: string;
  lastConsultationDate: string;
  totalConsultations: number;
  lastVisitType: string;
  nextFollowUpDate: string;
  followUpStatus: string;
}

export interface DoctorPatientRegisterResponse {
  content: DoctorPatientRegisterItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
