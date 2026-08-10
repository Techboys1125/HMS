// ===== NURSE DASHBOARD TYPES =====
export interface NurseDashboardSummary {
  patientsAssignedToday: number;
  vitalsRecorded: number;
  waitingForVitals: number;
  doctorAssistances: number;
  completedTasks: number;
}

export interface NurseDashboardProgress {
  patientsGrowth: number;
  vitalsCompletion: number;
  doctorSupportRate: number;
  completedTaskRate: number;
}

export interface NurseDashboardData {
  summary: NurseDashboardSummary;
  progress: NurseDashboardProgress;
  generatedAt: string;
}

export interface NurseVitalsTrendHour {
  hour: string;
  count: number;
}

export interface NurseVitalsTrend {
  completed: number;
  hours: NurseVitalsTrendHour[];
}

export interface NursePreparationStatus {
  waitingForVitals: number;
  vitalsCompleted: number;
  readyForConsultation: number;
  consultationCompleted: number;
  totalPatients: number;
}

export interface NurseQueuePatient {
  token: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  department: string;
  appointmentTime: string;
  vitalsStatus: string;
  consultationStatus: string;
  priority: string;
}

export interface NurseQueue {
  waitingForVitals: number;
  patients: NurseQueuePatient[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface NurseDoctorAssistance {
  doctorsAssistedToday: number;
  patientsPrepared: number;
  averagePreparationMinutes: number;
  activeConsultations: number;
}

export interface NurseDepartmentBreakdown {
  department: string;
  patients: number;
}

export interface NurseDepartments {
  departments: NurseDepartmentBreakdown[];
  totalAssisted: number;
}

export interface NurseVitalsStatus {
  completed: number;
  pending: number;
  delayed: number;
  notRequired: number;
  total: number;
}

export interface NursePerformanceDay {
  patientsAssisted: number;
  vitalsRecorded: number;
  patientsPrepared: number;
  doctorAssistances: number;
  averagePreparationMinutes: number;
  completedTasks: number;
}

export interface NursePerformanceStatus {
  patientsAssisted: string;
  vitalsRecorded: string;
  patientsPrepared: string;
  doctorAssistances: string;
  averagePreparationTime: string;
  completedTasks: string;
}

export interface NursePerformance {
  today: NursePerformanceDay;
  yesterday: NursePerformanceDay;
  status: NursePerformanceStatus;
}

// ===== RECEPTION DASHBOARD TYPES =====
export interface ReceptionRegistrations {
  today: number;
  yesterday: number;
  change: number;
  changePercentage: number;
}

export interface ReceptionAppointments {
  today: number;
  completed: number;
  completionPercentage: number;
}

export interface ReceptionWaitingPatients {
  count: number;
  averageWaitMinutes: number;
}

export interface ReceptionBillingPending {
  count: number;
  yesterday: number;
  difference: number;
}

export interface ReceptionCheckedIn {
  count: number;
}

export interface ReceptionSummaryData {
  date: string;
  registrations: ReceptionRegistrations;
  appointments: ReceptionAppointments;
  waitingPatients: ReceptionWaitingPatients;
  billingPending: ReceptionBillingPending;
  checkedIn: ReceptionCheckedIn;
}

export interface ReceptionRegistrationTrendHour {
  hour: string;
  count: number;
}

export interface ReceptionRegistrationTrend {
  date: string;
  totalRegistrations: number;
  peakHour: string;
  peakRegistrations: number;
  registrations: ReceptionRegistrationTrendHour[];
}

export interface ReceptionAppointmentStatus {
  totalAppointments: number;
  scheduled: number;
  checkedIn: number;
  inConsultation: number;
  completed: number;
  cancelled: number;
  noShow: number;
}

export interface ReceptionDepartmentPatient {
  departmentId: number;
  departmentName: string;
  patientCount: number;
}

export interface ReceptionPatientsByDepartment {
  totalPatients: number;
  departments: ReceptionDepartmentPatient[];
}

export interface ReceptionRegistrationCategories {
  totalRegistrations: number;
  newPatients: number;
  returningPatients: number;
  walkIn: number;
  followUp: number;
}

export interface ReceptionPerformanceMetric {
  today: number;
  yesterday: number;
  status: string;
  changePercentage: number;
}

export interface ReceptionPerformanceSummary {
  patientsRegistered: ReceptionPerformanceMetric;
  appointmentsBooked: ReceptionPerformanceMetric;
  patientsCheckedIn: ReceptionPerformanceMetric;
  appointmentsRescheduled: ReceptionPerformanceMetric;
  billingInitiated: ReceptionPerformanceMetric;
  cancelledAppointments: ReceptionPerformanceMetric;
}

// ===== ACCOUNTANT DASHBOARD TYPES =====
export interface AccountantTransaction {
  invoiceId: string;
  patientId: string;
  patientName: string;
  billType: string;
  amount: number;
  paymentMethod: string;
  status: string;
  generatedAt: string;
}

export interface AccountantPaymentMethodDist {
  paymentMethod: string;
  amount: number;
}

export interface AccountantHourlyRevenue {
  hour: string;
  amount: number;
}

export interface AccountantDashboardData {
  todayRevenue: number;
  todayInvoices: number;
  pendingPayments: number;
  collectionRate: number;
  recentTransactions: AccountantTransaction[];
  paymentMethodDistribution: AccountantPaymentMethodDist[];
  hourlyRevenue: AccountantHourlyRevenue[];
  peakHourLabel?: string;
  pendingBillsCount?: number | string;
  overdueBillsCount?: number | string;
  avgDueAmount?: number;
  topSource?: string;
}

export interface AccountantPaymentMethods {
  paymentMethod: string;
  amount: number;
}

// ===== COMMON API RESPONSE =====
export interface DashboardApiResponse<T> {
  success: boolean;
  message: string;
  timestamp: string;
  data: T;
}
