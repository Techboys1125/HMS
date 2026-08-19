import type { ReactNode } from "react";

// Typography tokens
export const PP = "Poppins, system-ui, sans-serif";
export const RB = "Roboto, system-ui, sans-serif";

// Core shared interfaces
export interface DoctorSummaryPerformanceRecord {
  id: string;
  doctorName: string;
  department: string;
  appointments: number;
  completed: number;
  cancelled: number;
  revenue: number;
  rating: number;
  avatar: string;
}

export interface DoctorConsultationPerformanceRecord {
  consultationId: string;
  patientName: string;
  mrn: string;
  appointmentDate: string;
  consultationTime: string;
  diagnosis: string;
  prescriptionStatus: string;
  followUp: string;
  consultationStatus: string;
}

export interface ActivityItem {
  id: string;
  user: string;
  role: string;
  action: string;
  reportName: string;
  date: string;
  time: string;
  type: "generation" | "export" | "view" | "print" | "download";
}

export interface AvailableReportCard {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  lastGenerated: string;
  views: number;
  format: string;
}

// Appointment types
export interface AppointmentReportRecord {
  id: string;
  patientName: string;
  mrn: string;
  doctorName: string;
  department: string;
  appointmentDate: string;
  appointmentTime: string;
  visitType: "New Visit" | "Follow-up" | "Walk-in" | "Emergency";
  status: "Completed" | "Scheduled" | "Waiting" | "Cancelled" | "No Show";
}

// Revenue types
export interface RevenueReportRecord {
  id: string;
  patientName: string;
  mrn: string;
  doctorName: string;
  department: string;
  invoiceDate: string;
  invoiceAmount: number;
  collectedAmount: number;
  outstandingAmount: number;
  paymentMethod: "Cash" | "Card" | "UPI" | "Bank Transfer";
  paymentStatus: "Paid" | "Partially Paid" | "Pending" | "Cancelled";
}

// Patient types
export interface PatientReportRecord {
  mrn: string;
  patientName: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  mobile: string;
  department: string;
  doctorName: string;
  registrationDate: string;
  lastVisit: string;
  visitType: "New Visit" | "Follow-up" | "Walk-in" | "Emergency";
  status: "Active" | "Completed" | "Pending Follow-up";
}

// Doctor report types
export interface DoctorReportRecord {
  doctorId: string;
  doctorName: string;
  department: string;
  appointments: number;
  completed: number;
  pending: number;
  cancelled: number;
  followup: number;
  avgTimeMinutes: number;
  patientRating: number;
}

// Billing types
export interface BillingReportRecord {
  invoiceId: string;
  patientName: string;
  mrn: string;
  doctorName: string;
  department: string;
  invoiceDate: string;
  invoiceAmount: number;
  collectedAmount: number;
  outstandingAmount: number;
  paymentMethod: "Cash" | "Card" | "UPI" | "Bank Transfer";
  paymentStatus: "Paid" | "Pending" | "Partially Paid" | "Cancelled";
}

// KPI types
export interface KpiRevenueRecord {
  invoiceId: string;
  patientName: string;
  mrn: string;
  doctorName: string;
  department: string;
  invoiceDate: string;
  paymentMethod: "Cash" | "Card" | "UPI" | "Bank Transfer";
  invoiceAmount: number;
  collectedAmount: number;
  invoiceStatus: "Paid" | "Partially Paid" | "Pending" | "Cancelled";
}

export interface KpiAppointmentRecord {
  appointmentId: string;
  patientName: string;
  mrn: string;
  doctorName: string;
  department: string;
  visitType: "New Visit" | "Follow-up" | "Walk-in" | "Emergency";
  appointmentTime: string;
  tokenNumber: string;
  appointmentStatus: "Scheduled" | "Checked-In" | "Completed" | "Cancelled";
}

export interface KpiPatientRecord {
  patientId: string;
  patientName: string;
  mrn: string;
  gender: "Male" | "Female" | "Other";
  age: number;
  registrationDate: string;
  registeredBy: string;
  visitType: "New Visit" | "Follow-up" | "Walk-in" | "Emergency";
}

export interface KpiConsultationRecord {
  consultationId: string;
  patientName: string;
  doctorName: string;
  department: string;
  consultationTime: string;
  durationMinutes: number;
  status: "Completed" | "In-Progress" | "Cancelled";
}

export interface KpiPendingPaymentRecord {
  invoiceId: string;
  patientName: string;
  doctorName: string;
  department: string;
  pendingAmount: number;
  dueDate: string;
  status: "Pending" | "Overdue" | "Partially Paid";
}

// Doctor RBAC types
export interface DoctorConsultationRecord {
  id: string;
  patientName: string;
  mrn: string;
  appointmentDate: string;
  consultationTime: string;
  diagnosis: string;
  prescription: string;
  status: string;
}

export interface DoctorDailyAppointmentRecord {
  id: string;
  patientName: string;
  mrn: string;
  appointmentDate: string;
  appointmentTime: string;
  visitType: string;
  status: string;
  consultationStatus: string;
}

export interface DoctorPatientRecord {
  mrn: string;
  patientName: string;
  age: number;
  gender: string;
  mobileNumber: string;
  lastConsultationDate: string;
  visitType: string;
  diagnosis: string;
  followUpDate: string;
  status: string;
}

export type DoctorKpiKey =
  | "today-appointments"
  | "completed-consultations"
  | "my-patients"
  | "returning-patients"
  | "followup-patients"
  | "avg-consult-time"
  | "patient-satisfaction";

export interface DoctorKpiMeta {
  key: DoctorKpiKey;
  title: string;
  value: string;
  yesterdayComp: string;
  monthlyComp: string;
  growth: string;
  isPositive: boolean;
  unit: string;
}

// Receptionist types
export interface ReceptionistActivityRecord {
  mrn: string;
  patientName: string;
  appointmentId: string;
  visitType: string;
  registrationTime: string;
  checkInTime: string;
  queueStatus: string;
  appointmentStatus: string;
}

export interface ReceptionistDailyAppointmentRecord {
  appointmentId: string;
  patientName: string;
  mrn: string;
  mobileNumber: string;
  appointmentTime: string;
  visitType: string;
  checkInTime: string;
  queueStatus: string;
  appointmentStatus: string;
}

export interface ReceptionistPatientReportRecord {
  mrn: string;
  patientName: string;
  mobileNumber: string;
  age: number;
  gender: string;
  registrationDate: string;
  visitType: string;
  appointmentStatus: string;
  checkInStatus: string;
  registrationStatus: string;
}

export type ReceptionistKpiType =
  | "Today's Registrations"
  | "Today's Appointments"
  | "Checked-In Patients"
  | "Patients Waiting"
  | "Completed Check-Ins"
  | "Average Waiting Time"
  | "Walk-In Patients"
  | "Returning Patients";

export interface ReceptionistKpiMeta {
  title: string;
  currentValue: string;
  yesterdayComp: string;
  monthlyComp: string;
  growthPercent: string;
  isPositive: boolean;
  description: string;
  unit: string;
}

// Accountant types
export interface AccountantFinancialTransactionRecord {
  invoiceId: string;
  patientName: string;
  mrn: string;
  invoiceDate: string;
  grandTotal: number;
  amountPaid: number;
  balance: number;
  paymentMethod: string;
  paymentStatus: string;
  collectedBy: string;
}

export interface AccountantDailyRevenueRecord {
  invoiceId: string;
  patientName: string;
  mrn: string;
  invoiceDate: string;
  paymentTime: string;
  invoiceAmount: number;
  amountPaid: number;
  outstandingAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  collectedBy: string;
}

export interface AccountantBillingRecord {
  invoiceId: string;
  patientName: string;
  mrn: string;
  invoiceDate: string;
  invoiceAmount: number;
  amountPaid: number;
  outstandingBalance: number;
  paymentMethod: string;
  paymentStatus: string;
  invoiceStatus: string;
  collectedBy: string;
}

export type AccountantKpiType =
  | "Today's Revenue"
  | "Today's Invoices"
  | "Paid Bills"
  | "Pending Payments"
  | "Outstanding Amount"
  | "Refunded Bills"
  | "Payment Collection Rate"
  | "Average Invoice Value";

export interface AccountantKpiMeta {
  title: string;
  currentValue: string;
  yesterdayComp: string;
  monthlyComp: string;
  growthPercent: string;
  isPositive: boolean;
  description: string;
  unit: string;
}

// ─── Backend API Response Types ──────────────────────────────────────────────

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  timestamp: string;
  data: T;
}

export interface PaginatedData<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// 1. Doctor Performance Summary
export interface DoctorPerformanceSummary {
  doctorId: string;
  doctorName: string;
  department: string;
  appointments: number;
  completed: number;
  pending: number;
  cancelled: number;
  followUps: number;
  averageDurationMinutes: number;
  rating: number | null;
}

export interface DoctorPerformanceSummaryData {
  summary: {
    totalDoctors: number;
    activeDoctors: number;
    onLeaveDoctors: number;
    totalConsultations: number;
    completedConsultations: number;
    pendingConsultations: number;
    cancelledConsultations: number;
    followUpConsultations: number;
    averageConsultationDurationMinutes: number;
    doctorUtilizationPercentage: number;
    patientSatisfaction: number | null;
    totalAppointments: number;
    totalCompleted: number;
    totalCancelled: number;
    totalRevenue: number;
  };
  content: DoctorPerformanceSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// 2. Daily Appointments Report
export interface DailyAppointmentSummary {
  date: string;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  pendingAppointments: number;
}

// 3. Daily Appointments Detail
export interface DailyAppointmentDetail {
  appointmentTime: string;
  patientId: string;
  appointmentId: number;
  appointmentNumber: string;
  patientName: string;
  doctorName: string;
  department: string;
  appointmentDate: string;
  status: string;
  appointmentType: string;
  mrn?: string;
  queueNumber?: string;
  durationMinutes?: number;
  diagnosis?: string;
  prescriptionIssued?: boolean;
}

// 4. Collection Rate
export interface CollectionRateData {
  totalBilled: number;
  totalCollected: number;
  outstandingAmount: number;
  collectionRate: number;
}

// 5. Hospital Dashboard
export interface HospitalDashboardData {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  completedConsultations: number;
  pendingConsultations: number;
  cancelledConsultations: number;
  followUpConsultations: number;
  averageConsultationDurationMinutes: number;
  doctorUtilizationPercentage: number;
  patientSatisfaction: number | null;
  totalRevenue: number;
  collectionRate: number;
}

// 6. Department Consultation Volume
export interface DepartmentConsultationVolume {
  departmentId: string;
  departmentName: string;
  completedConsultations: number;
  totalConsultations: number;
}

// 8. Invoice Register Detail
export interface InvoiceRegisterRecord {
  paymentMethod: "Cash" | "Card" | "UPI" | "Bank Transfer";
  department: string;
  doctorName: string;
  mrn: string;
  invoiceNumber: string;
  patientName: string;
  billedAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  paymentStatus: string;
  invoiceDate: string;
  dueDate?: string;
  overdueDays?: number;
}

// 9. Invoice Summary
export interface InvoiceSummaryData {
  totalInvoices: number;
  paidInvoices: number;
  unpaidInvoices: number;
  totalBilledAmount: number;
  totalPaidAmount: number;
  totalOutstandingAmount: number;
}

// 10. Hospital Operational Trend
export interface OperationalTrendPoint {
  collected: number;
  date: string;
  registrations: number;
  appointments: number;
  revenue: number;
}

// 11. Patient Registration Summary
export interface PatientRegistrationSummary {
  totalRegistrations: number;
  newPatients: number;
  returningPatients: number;
}

// 12. Patient Registration Detail
export interface PatientRegistrationDetail {
  patientId: number;
  patientName: string;
  mrn: string;
  gender: string;
  registeredAt: string;
}

// 13. Revenue vs Collection
export interface RevenueVsCollectionPoint {
  outstanding: number;
  revenue: number;
  month: string;
  date: string;
  billed: number;
  collected: number;
}

// 14. Daily Revenue
export interface DailyRevenuePoint {
  invoiceDate: ReactNode;
  mrn: ReactNode;
  patientName: ReactNode;
  invoiceId: ReactNode;
  grandTotal: number | string | ReactNode;
  amountPaid: number | string | ReactNode;
  balance: number | string | ReactNode;
  paymentMethod: ReactNode;
  paymentStatus: string;
  collectedBy: ReactNode;
  date: string;
  amount: number;
}

// 15. Daily Revenue Detail
export interface DailyRevenueDetail {
  id: string;
  paymentId: string;
  receiptNumber: string;
  paymentMethod: string;
  amount: number;
  paidAt: string;
}

// 16. Report Category Share
export interface ReportCategoryShare {
  color: string;
  category: string;
  viewCount: number;
  percentage: number;
}

// 17. Most Viewed Reports
export interface MostViewedReport {
  reportName: string;
  path: string;
  viewCount: number;
}

// 18. Patient Age Demographics
export interface AgeGroup {
  ageGroup: string;
  count: number;
  percentage: number;
}

export interface PatientAgeDemographics {
  totalPatients: number;
  ageGroups: AgeGroup[];
}

// 19. Patient Dashboard
export interface PatientDashboardData {
  totalPatients: number;
  newPatients: number;
  returningPatients: number;
  activePatients: number;
  genderDistribution: {
    male: number;
    female: number;
    other: number;
  };
  topDepartments: {
    departmentName: string;
    visitCount: number;
  }[];
}

// 20. Department Patient Visits
export interface DepartmentPatientVisit {
  departmentId: number;
  departmentName: string;
  patientCount: number;
  percentage: number;
}

// 21. Doctor Patient Workload
export interface DoctorPatientWorkload {
  doctorId: number;
  doctorName: string;
  department: string;
  patientCount: number;
  activeEncounterCount: number;
}

// 22. Gender Breakdown
export interface GenderBreakdownData {
  maleCount: number;
  malePercentage: number;
  femaleCount: number;
  femalePercentage: number;
  otherCount: number;
  otherPercentage: number;
}

// 23. Patient Master Register
export interface PatientMasterRecord {
  registrationDate: string;
  visitType: string;
  doctorName: string;
  department: string;
  mobile: string;
  patientName: string;
  patientId: number;
  mrn: string;
  fullName: string;
  gender: string;
  age: number;
  mobileNumber: string;
  registeredDate: string;
  lastVisitDate: string;
  totalVisits: number;
  status: string;
  phone?: string;
  createdDate?: string;
}

export interface PatientMasterRegisterData {
  content: PatientMasterRecord[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
}

// 24. Patient Registration Trend
export interface RegistrationTrendPoint {
  date: string;
  newPatients: number;
  returningPatients: number;
}

export interface RegistrationTrendData {
  period: string;
  points: RegistrationTrendPoint[];
}

// ─── Doctor Personal Practice Reports Interfaces ─────────────────────────────

export interface DoctorDailyAppointmentsAnalyticsData {
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

export interface DoctorPracticeSummary {
  myPatients: number;
  newPatients: number;
  returningPatients: number;
  completedConsultations: number;
  scheduledFollowUps: number;
  averagePatientsPerDay: number;
  todayConsultations: number;
  monthlyConsultations: number;
}

export interface DoctorDailyAppointmentsDashboardData {
  doctor: {
    doctorId: string;
    doctorName: string;
    department: string;
  };
  reportDate: string;
  lastUpdated: string;
  summary: DoctorPracticeSummary;
}

export interface DoctorDailyAppointmentRegisterItem {
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

export interface DoctorDailyAppointmentRegisterResponse {
  content: DoctorDailyAppointmentRegisterItem[];
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

export interface DoctorPatientReportDashboardData {
  doctor: {
    doctorId: string;
    doctorName: string;
    department: string;
  };
  reportPeriod: {
    fromDate: string;
    toDate: string;
  };
  lastUpdated: string;
  summary: DoctorPracticeSummary;
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

// ─── Accountant Financial Reports Interfaces ─────────────────────────────────

export interface AccountantMainReportData {
  revenueTrends: Array<{
    date: string;
    amount: number;
  }>;
  collectionTrends: Array<{
    date: string;
    amount: number;
  }>;
  paymentStatusDistribution: {
    paid: number;
    pending: number;
    partial: number;
    cancelled: number;
  };
  monthlyPerformance: {
    totalRevenue: number;
    totalInvoices: number;
    averageDailyRevenue: number;
  };
  billingAnalysis: Array<{
    billingType: string;
    amount: number;
    count: number;
  }>;
  financialSummary: {
    totalBilled: number;
    totalCollected: number;
    totalPending: number;
    totalRefunded: number;
  };
  reportTable: Array<{
    date: string;
    invoiceId: string;
    patientName: string;
    billType: string;
    billedAmount: number;
    paidAmount: number;
    paymentMethod: string;
    status: string;
  }>;
}

export interface AccountantBillingAnalysisData {
  fromDate: string;
  toDate: string;
  totalBilledAmount: number;
  totalBills: number;
  breakdown: Array<{
    billingType: string;
    grossAmount: number;
    discountAmount: number;
    netAmount: number;
    count: number;
  }>;
}

export interface AccountantPaymentMethodItem {
  paymentMethod: string;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
}

export interface AccountantPaymentCollectionData {
  fromDate: string;
  toDate: string;
  totalCollectedAmount: number;
  totalTransactions: number;
  methodBreakdown: AccountantPaymentMethodItem[];
}

export interface AccountantRefundItem {
  refundId?: string;
  invoiceId?: string;
  patientName?: string;
  amount?: number;
  reason?: string;
  refundedAt?: string;
}

export interface AccountantRefundLogData {
  fromDate: string;
  toDate: string;
  totalRefundedAmount: number;
  totalRefundedBills: number;
  refunds: AccountantRefundItem[];
}

export interface AccountantRevenueDataPoint {
  label: string;
  amount: number;
  invoiceCount: number;
}

export interface AccountantRevenueReportData {
  fromDate: string;
  toDate: string;
  groupBy: string;
  totalRevenue: number;
  dataPoints: AccountantRevenueDataPoint[];
}

export interface AccountantTransactionItem {
  paymentNumber: string;
  invoiceId: string;
  patientName: string;
  amount: number;
  paymentMethod: string;
  status: string;
  referenceNumber: string;
  transactionDate: string;
}

export interface AccountantTransactionRegisterResponse {
  content: AccountantTransactionItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
