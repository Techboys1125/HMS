import { apiClient, API_BASE_URL } from "../../../lib/axios";
import { getToken } from "../../../lib/cookie-token-storage";
import type {
  ApiEnvelope,
  PaginatedData,
  DoctorPerformanceSummary,
  DoctorPerformanceSummaryData,
  DailyAppointmentSummary,
  DailyAppointmentDetail,
  CollectionRateData,
  HospitalDashboardData,
  DepartmentConsultationVolume,
  InvoiceRegisterRecord,
  InvoiceSummaryData,
  OperationalTrendPoint,
  PatientRegistrationSummary,
  RevenueVsCollectionPoint,
  DailyRevenuePoint,
  DailyRevenueDetail,
  ReportCategoryShare,
  MostViewedReport,
  PatientAgeDemographics,
  DepartmentPatientVisit,
  GenderBreakdownData,
  PatientMasterRecord,
  DoctorDailyAppointmentsAnalyticsData,
  DoctorDailyAppointmentsDashboardData,
  DoctorDailyAppointmentRegisterResponse,
  DoctorPatientRegisterResponse,
  AccountantMainReportData,
  AccountantBillingAnalysisData,
  AccountantPaymentCollectionData,
  AccountantRefundLogData,
  AccountantRevenueReportData,
  AccountantTransactionRegisterResponse,
  DoctorPatientWorkload,
} from "../types/reports.types";

function unwrap<T>(response: { data: ApiEnvelope<T> | T }): T {
  const body = response.data;
  if (
    body &&
    typeof body === "object" &&
    "data" in body &&
    (body as { data: unknown }).data !== undefined
  ) {
    return (body as ApiEnvelope<T>).data;
  }
  return body as T;
}

// Robust array unwrapper supporting all backend payload structures
function unwrapArray<T>(response: { data: unknown }): T[] {
  const unwrapped = unwrap(response) as unknown;
  return extractList<T>(unwrapped);
}

export function extractList<T>(data: unknown): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as T[];
  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.content)) return obj.content as T[];
    if (Array.isArray(obj.data)) return obj.data as T[];
    if (Array.isArray(obj.items)) return obj.items as T[];
    if (Array.isArray(obj.registers)) return obj.registers as T[];
    if (Array.isArray(obj.records)) return obj.records as T[];
    if (Array.isArray(obj.doctors)) return obj.doctors as T[];
    if (Array.isArray(obj.departments)) return obj.departments as T[];
    if (Array.isArray(obj.reports)) return obj.reports as T[];
    if (Array.isArray(obj.categories)) return obj.categories as T[];
  }
  return [];
}

function buildQuery(
  params: Record<string, string | number | undefined>,
): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== "",
  );
  if (entries.length === 0) return "";
  return (
    "?" +
    entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join("&")
  );
}

export interface ReportFilters {
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
  period?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  status?: string;
  departmentId?: string | number;
  doctorId?: string | number;
  search?: string;
}

// ─── 1. Doctor Performance Summary ──────────────────────────────────────────

export async function fetchDoctorPerformance(
  filters?: ReportFilters,
): Promise<DoctorPerformanceSummaryData> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
    page: filters?.page ?? 0,
    size: filters?.size ?? 10,
  });
  const res = await apiClient.get<ApiEnvelope<DoctorPerformanceSummaryData>>(
    `/api/v1/admin/reports/doctors/performance${qs}`,
  );
  return unwrap(res);
}

// ─── 2. Daily Appointments Report ───────────────────────────────────────────

export async function fetchDailyAppointments(
  filters?: ReportFilters,
): Promise<DailyAppointmentSummary[]> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
  });
  const res = await apiClient.get<ApiEnvelope<DailyAppointmentSummary[]>>(
    `/api/v1/admin/reports/hospital/appointments/daily${qs}`,
  );
  return unwrapArray(res);
}

// ─── 3. Daily Appointments Detail ───────────────────────────────────────────

export async function fetchDailyAppointmentDetails(
  filters?: ReportFilters,
): Promise<PaginatedData<DailyAppointmentDetail>> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
    page: filters?.page ?? 0,
    size: filters?.size ?? 10,
  });
  const res = await apiClient.get<
    ApiEnvelope<PaginatedData<DailyAppointmentDetail>>
  >(`/api/v1/admin/reports/hospital/appointments/daily/details${qs}`);
  return unwrap(res);
}

// ─── 4. Collection Rate ─────────────────────────────────────────────────────

export async function fetchCollectionRate(
  filters?: ReportFilters,
): Promise<CollectionRateData> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
  });
  const res = await apiClient.get<ApiEnvelope<CollectionRateData>>(
    `/api/v1/admin/reports/hospital/collection-rate${qs}`,
  );
  return unwrap(res);
}

// ─── 5. Hospital Dashboard ──────────────────────────────────────────────────

export async function fetchHospitalDashboard(
  filters?: ReportFilters,
): Promise<HospitalDashboardData> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
  });
  const res = await apiClient.get<ApiEnvelope<HospitalDashboardData>>(
    `/api/v1/admin/reports/hospital/dashboard${qs}`,
  );
  return unwrap(res);
}

// ─── 6. Department Consultation Volume ──────────────────────────────────────

export async function fetchDepartmentConsultationVolume(
  filters?: ReportFilters,
): Promise<DepartmentConsultationVolume[]> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
  });
  const res = await apiClient.get<ApiEnvelope<DepartmentConsultationVolume[]>>(
    `/api/v1/admin/reports/hospital/departments/consultation-volume${qs}`,
  );
  return unwrapArray(res);
}

// ─── 8. Invoice Register Detail ─────────────────────────────────────────────

export async function fetchInvoiceRegister(
  filters?: ReportFilters,
): Promise<PaginatedData<InvoiceRegisterRecord>> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
    page: filters?.page ?? 0,
    size: filters?.size ?? 10,
  });
  const res = await apiClient.get<
    ApiEnvelope<PaginatedData<InvoiceRegisterRecord>>
  >(`/api/v1/admin/reports/hospital/invoices${qs}`);
  return unwrap(res);
}

// ─── 9. Invoice Summary ─────────────────────────────────────────────────────

export async function fetchInvoiceSummary(
  filters?: ReportFilters,
): Promise<InvoiceSummaryData> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
  });
  const res = await apiClient.get<ApiEnvelope<InvoiceSummaryData>>(
    `/api/v1/admin/reports/hospital/invoices/summary${qs}`,
  );
  return unwrap(res);
}

// ─── 10. Hospital Operational Trend ─────────────────────────────────────────

export async function fetchOperationalTrend(
  filters?: ReportFilters,
): Promise<OperationalTrendPoint[]> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
  });
  const res = await apiClient.get<ApiEnvelope<OperationalTrendPoint[]>>(
    `/api/v1/admin/reports/hospital/operational-trend${qs}`,
  );
  return unwrapArray(res);
}

// ─── 11. Patient Registration Summary ───────────────────────────────────────

export async function fetchPatientRegistrationSummary(
  filters?: ReportFilters,
): Promise<PatientRegistrationSummary> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
  });
  const res = await apiClient.get<ApiEnvelope<PatientRegistrationSummary>>(
    `/api/v1/admin/reports/hospital/patient-registrations${qs}`,
  );
  return unwrap(res);
}

// ─── 13. Revenue vs Collection ──────────────────────────────────────────────

export async function fetchRevenueVsCollection(
  filters?: ReportFilters,
): Promise<RevenueVsCollectionPoint[]> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
  });
  const res = await apiClient.get<ApiEnvelope<RevenueVsCollectionPoint[]>>(
    `/api/v1/admin/reports/hospital/revenue-vs-collection${qs}`,
  );
  return unwrapArray(res);
}

// ─── 14. Daily Revenue ──────────────────────────────────────────────────────

export async function fetchDailyRevenue(
  filters?: ReportFilters,
): Promise<DailyRevenuePoint[]> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
  });
  const res = await apiClient.get<ApiEnvelope<DailyRevenuePoint[]>>(
    `/api/v1/admin/reports/hospital/revenue/daily${qs}`,
  );
  return unwrapArray(res);
}

// ─── 15. Daily Revenue Detail ───────────────────────────────────────────────

export async function fetchDailyRevenueDetails(
  filters?: ReportFilters,
): Promise<PaginatedData<DailyRevenueDetail>> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
    page: filters?.page ?? 0,
    size: filters?.size ?? 10,
  });
  const res = await apiClient.get<
    ApiEnvelope<PaginatedData<DailyRevenueDetail>>
  >(`/api/v1/admin/reports/hospital/revenue/daily/details${qs}`);
  return unwrap(res);
}

// ─── 16. Report Category Share ──────────────────────────────────────────────

export async function fetchReportCategoryShare(): Promise<
  ReportCategoryShare[]
> {
  const res = await apiClient.get<ApiEnvelope<ReportCategoryShare[]>>(
    `/api/v1/admin/reports/usage/category-share`,
  );
  return unwrapArray(res);
}

// ─── 17. Most Viewed Reports ────────────────────────────────────────────────

export async function fetchMostViewedReports(): Promise<MostViewedReport[]> {
  const res = await apiClient.get<ApiEnvelope<MostViewedReport[]>>(
    `/api/v1/admin/reports/usage/most-viewed`,
  );
  return unwrapArray(res);
}

// ─── 18. Patient Age Demographics ───────────────────────────────────────────

export async function fetchPatientAgeDemographics(
  filters?: ReportFilters,
): Promise<PatientAgeDemographics> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
  });
  const res = await apiClient.get<ApiEnvelope<PatientAgeDemographics>>(
    `/api/v1/admin/reports/hospital/patients/age-demographics${qs}`,
  );
  return unwrap(res);
}

// ─── 20. Department Patient Visits ──────────────────────────────────────────

export async function fetchDepartmentPatientVisits(
  filters?: ReportFilters,
): Promise<DepartmentPatientVisit[]> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
  });
  const res = await apiClient.get<ApiEnvelope<DepartmentPatientVisit[]>>(
    `/api/v1/admin/reports/hospital/patients/department-visits${qs}`,
  );
  return unwrapArray(res);
}

// ─── 22. Gender Breakdown ───────────────────────────────────────────────────

export async function fetchGenderBreakdown(
  filters?: ReportFilters,
): Promise<GenderBreakdownData> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
  });
  const res = await apiClient.get<ApiEnvelope<GenderBreakdownData>>(
    `/api/v1/admin/reports/hospital/patients/gender-breakdown${qs}`,
  );
  return unwrap(res);
}

// ─── 23. Patient Master Register ────────────────────────────────────────────

export async function fetchPatientMasterRegister(
  filters?: ReportFilters,
): Promise<PaginatedData<PatientMasterRecord>> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
    page: filters?.page ?? 0,
    size: filters?.size ?? 10,
  });
  const res = await apiClient.get<
    ApiEnvelope<PaginatedData<PatientMasterRecord>>
  >(`/api/v1/admin/reports/hospital/patients/register${qs}`);
  return unwrap(res);
}

// ─── Modern Core Admin Reports ──────────────────────────────────────────────

export async function fetchAdminReportsDashboard(
  filters?: ReportFilters,
): Promise<HospitalDashboardData> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
  });
  const res = await apiClient.get<ApiEnvelope<HospitalDashboardData>>(
    `/api/v1/admin/reports/dashboard${qs}`,
  );
  return unwrap(res);
}

// ─── Modern Collection Rate Reports ─────────────────────────────────────────

export async function fetchCollectionRateSummary(
  filters?: ReportFilters,
): Promise<CollectionRateData> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
  });
  const res = await apiClient.get<ApiEnvelope<CollectionRateData>>(
    `/api/v1/admin/reports/collection-rate/summary${qs}`,
  );
  return unwrap(res);
}

export async function fetchCollectionRateRegister(
  filters?: ReportFilters,
): Promise<PaginatedData<InvoiceRegisterRecord>> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
    page: filters?.page ?? 0,
    size: filters?.size ?? 10,
  });
  const res = await apiClient.get<
    ApiEnvelope<PaginatedData<InvoiceRegisterRecord>>
  >(`/api/v1/admin/reports/collection-rate/register${qs}`);
  return unwrap(res);
}

export async function fetchCollectionActivityTrend(
  filters?: ReportFilters,
): Promise<OperationalTrendPoint[]> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
  });
  const res = await apiClient.get<ApiEnvelope<OperationalTrendPoint[]>>(
    `/api/v1/admin/reports/collection-rate/activity-trend${qs}`,
  );
  return unwrapArray(res);
}

export async function fetchCollectionRateDepartments(
  filters?: ReportFilters,
): Promise<DepartmentConsultationVolume[]> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
  });
  const res = await apiClient.get<ApiEnvelope<DepartmentConsultationVolume[]>>(
    `/api/v1/admin/reports/collection-rate/departments${qs}`,
  );
  return unwrapArray(res);
}

export async function fetchCollectionRateStatusShare(
  filters?: ReportFilters,
): Promise<ReportCategoryShare[]> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
  });
  const res = await apiClient.get<ApiEnvelope<ReportCategoryShare[]>>(
    `/api/v1/admin/reports/collection-rate/status-share${qs}`,
  );
  return unwrapArray(res);
}

async function fetchBlob(path: string): Promise<Blob> {
  const fullUrl = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  const token = getToken("accessToken");
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(fullUrl, { headers });

  if (!response.ok) {
    throw new Error(
      `Request failed: ${response.status} ${response.statusText}`,
    );
  }

  return await response.blob();
}

export async function exportCollectionRateExcel(
  filters?: ReportFilters,
): Promise<Blob> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
  });
  return fetchBlob(`/api/v1/admin/reports/collection-rate/export/excel${qs}`);
}

export async function exportCollectionRatePdf(
  filters?: ReportFilters,
): Promise<Blob> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
  });
  return fetchBlob(`/api/v1/admin/reports/collection-rate/export/pdf${qs}`);
}

// ─── Modern Doctor Reports ──────────────────────────────────────────────────

export async function fetchDoctorDetailPerformance(
  doctorId: string | number,
  filters?: ReportFilters,
): Promise<DoctorPerformanceSummary> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
  });
  const res = await apiClient.get<ApiEnvelope<DoctorPerformanceSummary>>(
    `/api/v1/admin/reports/doctors/${doctorId}/performance${qs}`,
  );
  return unwrap(res);
}

export async function fetchDoctorActivities(
  doctorId: string | number,
  filters?: ReportFilters,
): Promise<PaginatedData<DailyAppointmentDetail>> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
    page: filters?.page ?? 0,
    size: filters?.size ?? 10,
  });
  const res = await apiClient.get<
    ApiEnvelope<PaginatedData<DailyAppointmentDetail>>
  >(`/api/v1/admin/reports/doctors/${doctorId}/activities${qs}`);
  return unwrap(res);
}

export async function fetchDoctorWorkload(
  filters?: ReportFilters,
): Promise<DoctorPatientWorkload[]> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
  });
  const res = await apiClient.get<ApiEnvelope<DoctorPatientWorkload[]>>(
    `/api/v1/admin/reports/doctors/workload${qs}`,
  );
  return unwrapArray(res);
}

export async function fetchDoctorConsultationDuration(
  filters?: ReportFilters,
): Promise<DoctorPerformanceSummary[]> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
  });
  const res = await apiClient.get<ApiEnvelope<DoctorPerformanceSummary[]>>(
    `/api/v1/admin/reports/doctors/consultation-duration${qs}`,
  );
  return unwrapArray(res);
}

export async function fetchDoctorConsultationStatus(
  filters?: ReportFilters,
): Promise<ReportCategoryShare[]> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
  });
  const res = await apiClient.get<ApiEnvelope<ReportCategoryShare[]>>(
    `/api/v1/admin/reports/doctors/consultation-status${qs}`,
  );
  return unwrapArray(res);
}

export async function fetchDoctorConsultationTrend(
  filters?: ReportFilters,
): Promise<OperationalTrendPoint[]> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
  });
  const res = await apiClient.get<ApiEnvelope<OperationalTrendPoint[]>>(
    `/api/v1/admin/reports/doctors/consultation-trend${qs}`,
  );
  return unwrapArray(res);
}

export async function exportDoctorPerformanceExcel(
  filters?: ReportFilters,
): Promise<Blob> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
  });
  return fetchBlob(
    `/api/v1/admin/reports/doctors/performance/export/excel${qs}`,
  );
}

export async function exportDoctorPerformancePdf(
  filters?: ReportFilters,
): Promise<Blob> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
  });
  return fetchBlob(`/api/v1/admin/reports/doctors/performance/export/pdf${qs}`);
}

export async function exportDoctorPerformanceRegisterExcel(
  filters?: ReportFilters,
): Promise<Blob> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
  });
  return fetchBlob(
    `/api/v1/admin/reports/doctors/performance/register/export/excel${qs}`,
  );
}

// ─── Doctor Personal Practice Reports APIs (/api/v1/doctors/me/reports/**) ──

export async function fetchDoctorSelfDailyAppointmentsAnalytics(params?: {
  date?: string;
  period?: string;
}): Promise<DoctorDailyAppointmentsAnalyticsData> {
  const qs = buildQuery({
    date: params?.date,
    period: params?.period,
  });
  const res = await apiClient.get<
    ApiEnvelope<DoctorDailyAppointmentsAnalyticsData>
  >(`/api/v1/doctors/me/reports/daily-appointments/analytics${qs}`);
  return unwrap(res);
}

export async function fetchDoctorSelfDailyAppointmentsDashboard(
  date?: string,
): Promise<DoctorDailyAppointmentsDashboardData> {
  const qs = buildQuery({ date });
  const res = await apiClient.get<
    ApiEnvelope<DoctorDailyAppointmentsDashboardData>
  >(`/api/v1/doctors/me/reports/daily-appointments/dashboard${qs}`);
  return unwrap(res);
}

export async function fetchDoctorSelfDailyAppointmentRegister(params?: {
  date?: string;
  page?: number;
  size?: number;
}): Promise<DoctorDailyAppointmentRegisterResponse> {
  const qs = buildQuery({
    date: params?.date,
    page: params?.page ?? 0,
    size: params?.size ?? 20,
  });
  const res = await apiClient.get<
    ApiEnvelope<DoctorDailyAppointmentRegisterResponse>
  >(`/api/v1/doctors/me/reports/daily-appointments/register${qs}`);
  return unwrap(res);
}

export async function fetchDoctorSelfPatientRegister(params?: {
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}): Promise<DoctorPatientRegisterResponse> {
  const qs = buildQuery({
    fromDate: params?.fromDate,
    toDate: params?.toDate,
    page: params?.page ?? 0,
    size: params?.size ?? 20,
  });
  const res = await apiClient.get<ApiEnvelope<DoctorPatientRegisterResponse>>(
    `/api/v1/doctors/me/reports/patients/register${qs}`,
  );
  return unwrap(res);
}

// ─── Accountant Financial Reports APIs (/api/v1/accountant/reports/**) ──────

export async function fetchAccountantMainReport(params?: {
  fromDate?: string;
  toDate?: string;
  type?: string;
}): Promise<AccountantMainReportData> {
  const qs = buildQuery({
    fromDate: params?.fromDate,
    toDate: params?.toDate,
    type: params?.type,
  });
  const res = await apiClient.get<ApiEnvelope<AccountantMainReportData>>(
    `/api/v1/accountant/reports${qs}`,
  );
  return unwrap(res);
}

export async function fetchAccountantBillingAnalysis(params?: {
  fromDate?: string;
  toDate?: string;
  billType?: string;
}): Promise<AccountantBillingAnalysisData> {
  const qs = buildQuery({
    fromDate: params?.fromDate,
    toDate: params?.toDate,
    billType: params?.billType,
  });
  const res = await apiClient.get<ApiEnvelope<AccountantBillingAnalysisData>>(
    `/api/v1/accountant/reports/billing${qs}`,
  );
  return unwrap(res);
}

export async function fetchAccountantPaymentCollection(params?: {
  fromDate?: string;
  toDate?: string;
  paymentMethod?: string;
}): Promise<AccountantPaymentCollectionData> {
  const qs = buildQuery({
    fromDate: params?.fromDate,
    toDate: params?.toDate,
    paymentMethod: params?.paymentMethod,
  });
  const res = await apiClient.get<ApiEnvelope<AccountantPaymentCollectionData>>(
    `/api/v1/accountant/reports/payments${qs}`,
  );
  return unwrap(res);
}

export async function fetchAccountantRefundLog(params?: {
  fromDate?: string;
  toDate?: string;
}): Promise<AccountantRefundLogData> {
  const qs = buildQuery({
    fromDate: params?.fromDate,
    toDate: params?.toDate,
  });
  const res = await apiClient.get<ApiEnvelope<AccountantRefundLogData>>(
    `/api/v1/accountant/reports/refunds${qs}`,
  );
  return unwrap(res);
}

export async function fetchAccountantRevenueReport(params?: {
  fromDate?: string;
  toDate?: string;
  groupBy?: string;
}): Promise<AccountantRevenueReportData> {
  const qs = buildQuery({
    fromDate: params?.fromDate,
    toDate: params?.toDate,
    groupBy: params?.groupBy,
  });
  const res = await apiClient.get<ApiEnvelope<AccountantRevenueReportData>>(
    `/api/v1/accountant/reports/revenue${qs}`,
  );
  return unwrap(res);
}

export async function fetchAccountantTransactionReport(params?: {
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}): Promise<AccountantTransactionRegisterResponse> {
  const qs = buildQuery({
    fromDate: params?.fromDate,
    toDate: params?.toDate,
    page: params?.page ?? 0,
    size: params?.size ?? 10,
  });
  const res = await apiClient.get<
    ApiEnvelope<AccountantTransactionRegisterResponse>
  >(`/api/v1/accountant/reports/transactions${qs}`);
  return unwrap(res);
}
