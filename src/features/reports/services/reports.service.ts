import { apiClient } from "../../../lib/axios";
import type {
  ApiEnvelope,
  PaginatedData,
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
  PatientRegistrationDetail,
  RevenueVsCollectionPoint,
  DailyRevenuePoint,
  DailyRevenueDetail,
  ReportCategoryShare,
  MostViewedReport,
  PatientAgeDemographics,
  PatientDashboardData,
  DepartmentPatientVisit,
  DoctorPatientWorkload,
  GenderBreakdownData,
  PatientMasterRecord,
  RegistrationTrendData,
} from "../types/reports.types";

function unwrap<T>(response: { data: ApiEnvelope<T> | T }): T {
  const body = response.data;
  if (body && typeof body === "object" && "data" in body) {
    return (body as ApiEnvelope<T>).data;
  }
  return body as T;
}

// Unwrap that always returns an array — handles cases where API returns
// { data: [...] } or { data: { content: [...] } } or just [...]
function unwrapArray<T>(response: { data: ApiEnvelope<T[] | { content: T[] }> | T[] | { content: T[] } }): T[] {
  const unwrapped = unwrap(response) as T[] | { content: T[] } | undefined;
  if (Array.isArray(unwrapped)) return unwrapped;
  if (unwrapped && typeof unwrapped === "object" && "content" in unwrapped) {
    return (unwrapped as { content: T[] }).content;
  }
  return [];
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== "",
  );
  if (entries.length === 0) return "";
  return "?" + entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join("&");
}

export interface ReportFilters {
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
  period?: string;
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
  const res = await apiClient.get<ApiEnvelope<PaginatedData<DailyAppointmentDetail>>>(
    `/api/v1/admin/reports/hospital/appointments/daily/details${qs}`,
  );
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

// ─── 7. Doctor Performance (Hospital alias) ─────────────────────────────────

export async function fetchHospitalDoctorPerformance(
  filters?: ReportFilters,
): Promise<DoctorPerformanceSummaryData> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
    page: filters?.page ?? 0,
    size: filters?.size ?? 20,
  });
  const res = await apiClient.get<ApiEnvelope<DoctorPerformanceSummaryData>>(
    `/api/v1/admin/reports/hospital/doctors/performance${qs}`,
  );
  return unwrap(res);
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
  const res = await apiClient.get<ApiEnvelope<PaginatedData<InvoiceRegisterRecord>>>(
    `/api/v1/admin/reports/hospital/invoices${qs}`,
  );
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

// ─── 12. Patient Registration Detail ────────────────────────────────────────

export async function fetchPatientRegistrationDetails(
  filters?: ReportFilters,
): Promise<PaginatedData<PatientRegistrationDetail>> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
    page: filters?.page ?? 0,
    size: filters?.size ?? 10,
  });
  const res = await apiClient.get<ApiEnvelope<PaginatedData<PatientRegistrationDetail>>>(
    `/api/v1/admin/reports/hospital/patient-registrations/details${qs}`,
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
  const res = await apiClient.get<ApiEnvelope<PaginatedData<DailyRevenueDetail>>>(
    `/api/v1/admin/reports/hospital/revenue/daily/details${qs}`,
  );
  return unwrap(res);
}

// ─── 16. Report Category Share ──────────────────────────────────────────────

export async function fetchReportCategoryShare(): Promise<ReportCategoryShare[]> {
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

// ─── 19. Patient Dashboard ──────────────────────────────────────────────────

export async function fetchPatientDashboard(
  filters?: ReportFilters,
): Promise<PatientDashboardData> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
  });
  const res = await apiClient.get<ApiEnvelope<PatientDashboardData>>(
    `/api/v1/admin/reports/hospital/patients/dashboard${qs}`,
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

// ─── 21. Doctor Patient Workload ────────────────────────────────────────────

export async function fetchDoctorPatientWorkload(
  filters?: ReportFilters,
): Promise<DoctorPatientWorkload[]> {
  const qs = buildQuery({
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
  });
  const res = await apiClient.get<ApiEnvelope<DoctorPatientWorkload[]>>(
    `/api/v1/admin/reports/hospital/patients/doctor-workload${qs}`,
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
  const res = await apiClient.get<ApiEnvelope<PaginatedData<PatientMasterRecord>>>(
    `/api/v1/admin/reports/hospital/patients/register${qs}`,
  );
  return unwrap(res);
}

// ─── 24. Patient Registration Trend ─────────────────────────────────────────

export async function fetchPatientRegistrationTrend(
  period?: string,
): Promise<RegistrationTrendData> {
  const qs = period ? `?period=${encodeURIComponent(period)}` : "";
  const res = await apiClient.get<ApiEnvelope<RegistrationTrendData>>(
    `/api/v1/admin/reports/hospital/patients/registration-trend${qs}`,
  );
  return unwrap(res);
}
