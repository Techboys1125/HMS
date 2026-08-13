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
  paymentMethodDistribution: { paymentMethod: string; amount: number }[];
  hourlyRevenue: { hour: string; amount: number }[];
  pendingBillsCount?: number | string;
  overdueBillsCount?: number | string;
  avgDueAmount?: number;
  topSource?: string;
  peakHourLabel?: string;
}

export interface AccountantPaymentMethods {
  paymentMethod: string;
  amount: number;
}

export interface AdminDashboardSummary {
  totalPatientsToday?: number;
  totalRevenueToday?: number;
  activeDoctors?: number;
  pendingAppointments?: number;
  date?: string;
  opdPatients?: {
    today: number;
    yesterday?: number;
    change?: number;
  };
  appointments?: {
    today: number;
    yesterday?: number;
    changePercentage?: number;
  };
  revenue?: {
    today: number;
    currency?: string;
    changePercentage?: number;
  };
  newPatients?: {
    today: number;
    yesterday?: number;
    change?: number;
  };
  doctors?: {
    available: number;
    total?: number;
    activeOnDuty?: number;
  };
}

export interface AdminAppointmentFlowResponse {
  startTime: string;
  endTime: string;
  totalCompleted: number;
  peakHour: string;
  peakAppointments: number;
  flow: AdminAppointmentFlowPoint[];
}

export interface AdminAppointmentFlowPoint {
  hour: string;
  completed: number;
}

export interface AdminAppointmentFlow {
  flow: AdminAppointmentFlowPoint[];
}

export interface AdminDepartmentSummaryItem {
  departmentId: number;
  departmentName: string;
  appointments: number;
  completed: number;
  waiting: number;
  doctorsAvailable: number;
  status: string;
}

export interface AdminDepartments {
  departments: AdminDepartmentSummaryItem[];
}

export interface AdminDeptWorkloadItem {
  departmentName: string;
  avgWaitTimeMinutes: number;
  patientLoad: string;
}

export interface AdminDeptWorkload {
  workload: AdminDeptWorkloadItem[];
}

export interface AdminDoctorAvailability {
  totalDoctors: number;
  available: number;
  inConsultation: number;
  onLeave: number;
}

export interface AdminPatientStatus {
  scheduled: number;
  checkedIn: number;
  inConsultation: number;
  completed: number;
  cancelled: number;
  noShow: number;
}

export interface AdminRevenueSummary {
  totalRevenue: number;
  cashCollected: number;
  upiCollected: number;
  cardCollected: number;
  pendingCollection: number;
}

export interface HospitalAdminSummary {
  todayOpdPatients: number;
  todayAppointments: number;
  todayRevenue: number;
  pendingAppointments: number;
  doctorsAvailable: number;
  date?: string;
  opdPatients?: {
    today: number;
  };
  appointments?: {
    today: number;
  };
  revenue?: {
    today: number;
  };
  doctors?: {
    available: number;
  };
}

export interface HospitalAdminAppointmentFlow {
  startTime: string;
  endTime: string;
  totalCompleted: number;
  peakHour: string;
  peakAppointments: number;
  flow: { hour: string; completed: number }[];
}

export interface HospitalAdminStatusDist {
  name: string;
  value: number;
  color: string;
}

export interface HospitalAdminDeptWorkload {
  dept: string;
  appts: number;
  avgWaitTimeMinutes?: number;
  patientLoad?: string;
}

export interface HospitalAdminDoctorAvailability {
  status: string;
  count: number;
  color: string;
}

export interface HospitalAdminTimelineItem {
  time: string;
  patient: string;
  doctor: string;
  dept: string;
  status: string;
  token: string;
  room: string;
  stage: string;
}

export interface HospitalAdminRevenueDist {
  name: string;
  value: number;
  color: string;
}

export interface HospitalAdminDeptSummary {
  departmentId: number;
  departmentName: string;
  appointments: number;
  completed: number;
  waiting: number;
  doctorsAvailable: number;
  status: string;
}

// ===== DOCTOR DASHBOARD TYPES =====
export interface DoctorDashboardStatistics {
  todayAppointments: number;
  completed: number;
  completedConsultations?: number;
  pending: number;
  pendingConsultations?: number;
  cancelled: number;
  averageConsultationTime: string;
  averageConsultationTimeMinutes?: number;
}

export interface DoctorVitals {
  bp: string;
  pulse: string;
  temperature: string;
}

export interface DoctorCurrentPatient {
  token: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  vitals: DoctorVitals;
  consultationStatus: string;
}

export interface DoctorNextPatient {
  token: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  priority: string;
  appointmentTime: string;
}

export interface DoctorTimelineItem {
  appointmentId: string;
  token: string;
  patientName: string;
  time: string;
  status: string;
}

export interface DoctorTodayAppointments {
  doctor: {
    doctorId: string;
    doctorName: string;
    department: string;
    room: string;
    date: string;
  };
  summary: {
    totalAppointments: number;
    completed: number;
    inConsultation: number;
    waiting: number;
    ready: number;
    scheduled: number;
    cancelled: number;
  };
  timeline: DoctorTimelineItem[];
}

export interface DoctorMeAppointment {
  appointmentId: string;
  patientName: string;
  department: string;
  status: string;
}

export interface DoctorMeAppointments {
  doctorId: string;
  totalAppointments: number;
  list: DoctorMeAppointment[];
}

export interface DoctorQueueSummary {
  waiting: number;
  consulting: number;
  completed: number;
  averageWaitingMinutes: number;
  nextToken: string | null;
}

export interface DoctorQueuePagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface DoctorQueueItem {
  token: string;
  patientId: string;
  patientName: string;
  appointmentId: string;
  appointmentTime: string;
  status: string;
  queueStatus: string;
  priority: string;
  doctorName: string;
  departmentName: string;
  vitalsRecorded: boolean;
}

export interface DoctorConsultationQueueResponse {
  summary: DoctorQueueSummary;
  queue: DoctorQueueItem[];
  pagination: DoctorQueuePagination;
}

// ===== PATIENT DASHBOARD TYPES =====
export interface PatientDashboardData {
  patient: {
    patientId: string;
    mrn: string;
    fullName: string;
  };
  summary: {
    upcomingAppointment: unknown;
    activePrescriptions: { count: number };
    outstandingBills: { amount: number; currency: string; pendingCount: number };
    completedConsultations: { count: number; lastConsultationDate: string | null };
    healthNotifications: {
      unreadCount: number;
      reminderCount: number;
      billingCount: number;
      prescriptionCount: number;
    };
  };
  appointmentTimeline: {
    items: PatientAppointmentItem[];
    nextVisit: unknown;
  };
  consultationHistory: {
    totalVisits: number;
    averageVisitsPerMonth: number;
    monthlyVisits: { month: string; count: number }[];
  };
  prescriptionSummary: {
    active: number;
    completed: number;
    expired: number;
    total: number;
  };
  billingSummary: {
    totalBillingHistory: number;
    paidAmount: number;
    pendingAmount: number;
    currency: string;
    pendingInvoiceCount: number;
  };
  recentPrescriptions: unknown[];
  recentBills: unknown[];
}

export interface PatientAppointmentItem {
  appointmentId: string;
  appointmentNumber: string;
  date: string;
  time: string;
  doctorName: string;
  department: string;
  status: string;
}

export interface PatientDashboardAppointments {
  items: PatientAppointmentItem[];
  nextVisit: unknown;
}

export interface PatientAppointmentDetail {
  id: number;
  appointmentNumber: string;
  queueToken: string;
  mrn: string;
  patientName: string;
  gender: string;
  age: number;
  doctorId: number;
  doctorName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  appointmentType: string;
  reason: string;
  departmentId: number;
  departmentCode: string;
  departmentName: string;
  symptoms: string;
  appointmentId: number;
}

export interface PatientPrescriptionSummary {
  active: number;
  completed: number;
  expired: number;
  total: number;
}

export interface PatientConsultationHistory {
  totalVisits: number;
  averageVisitsPerMonth: number;
  monthlyVisits: { month: string; count: number }[];
}

export interface PatientBillWorkspace {
  patient: {
    id: number;
    mrn: string;
    name: string;
    phone: string;
  };
  doctor: {
    id: number;
    name: string;
    doctorCode: string;
  };
  appointment: {
    id: number;
    appointmentNumber: string;
    date: string;
  };
  bill: {
    id: number;
    billNumber: string;
    billType: string;
    status: string;
    paymentStatus: string;
  };
  summary: {
    grossAmount: number;
    discountAmount: number;
    taxableAmount: number;
    taxAmount: number;
    netAmount: number;
    paidAmount: number;
    balanceAmount: number;
  };
  items: {
    id: number;
    serviceName: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
  }[];
  paymentHistory: {
    id: number;
    paymentNumber: string;
    method: string;
    status: string;
    amount: number;
    referenceNumber: string;
  }[];
}

export interface PatientNotificationItem {
  id: string;
  eventType: string;
  module: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  status: string;
  referenceId: string;
  isRead: boolean;
  createdAt: string;
}

export interface PatientNotificationsResponse {
  notifications: PatientNotificationItem[];
  totalCount: number;
  unreadCount: number;
}

export interface PatientUnreadNotificationsResponse {
  count: number;
}

// ===== COMMON API RESPONSE =====
export interface DashboardApiResponse<T> {
  success: boolean;
  message: string;
  timestamp: string;
  data: T;
}
