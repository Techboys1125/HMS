import { useState, useCallback } from "react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../auth";
import type { ReportFilters } from "../services/reports.service";
import {
  fetchDoctorPerformance,
  fetchDailyAppointments,
  fetchDailyAppointmentDetails,
  fetchCollectionRate,
  fetchHospitalDashboard,
  fetchDepartmentConsultationVolume,
  fetchHospitalDoctorPerformance,
  fetchInvoiceRegister,
  fetchInvoiceSummary,
  fetchOperationalTrend,
  fetchPatientRegistrationSummary,
  fetchPatientRegistrationDetails,
  fetchRevenueVsCollection,
  fetchDailyRevenue,
  fetchDailyRevenueDetails,
  fetchReportCategoryShare,
  fetchMostViewedReports,
  fetchPatientAgeDemographics,
  fetchPatientDashboard,
  fetchDepartmentPatientVisits,
  fetchDoctorPatientWorkload,
  fetchGenderBreakdown,
  fetchPatientMasterRegister,
  fetchPatientRegistrationTrend,
} from "../services/reports.service";

// ─── Query Key Factories ────────────────────────────────────────────────────

const reportKeys = {
  all: ["reports"] as const,

  doctorPerformance: (f?: ReportFilters) =>
    [...reportKeys.all, "doctor-performance", f] as const,
  dailyAppointments: (f?: ReportFilters) =>
    [...reportKeys.all, "daily-appointments", f] as const,
  dailyAppointmentDetails: (f?: ReportFilters) =>
    [...reportKeys.all, "daily-appointment-details", f] as const,
  collectionRate: (f?: ReportFilters) =>
    [...reportKeys.all, "collection-rate", f] as const,
  hospitalDashboard: (f?: ReportFilters) =>
    [...reportKeys.all, "hospital-dashboard", f] as const,
  departmentConsultationVolume: (f?: ReportFilters) =>
    [...reportKeys.all, "department-consultation-volume", f] as const,
  hospitalDoctorPerformance: (f?: ReportFilters) =>
    [...reportKeys.all, "hospital-doctor-performance", f] as const,
  invoiceRegister: (f?: ReportFilters) =>
    [...reportKeys.all, "invoice-register", f] as const,
  invoiceSummary: (f?: ReportFilters) =>
    [...reportKeys.all, "invoice-summary", f] as const,
  operationalTrend: (f?: ReportFilters) =>
    [...reportKeys.all, "operational-trend", f] as const,
  patientRegistrationSummary: (f?: ReportFilters) =>
    [...reportKeys.all, "patient-registration-summary", f] as const,
  patientRegistrationDetails: (f?: ReportFilters) =>
    [...reportKeys.all, "patient-registration-details", f] as const,
  revenueVsCollection: (f?: ReportFilters) =>
    [...reportKeys.all, "revenue-vs-collection", f] as const,
  dailyRevenue: (f?: ReportFilters) =>
    [...reportKeys.all, "daily-revenue", f] as const,
  dailyRevenueDetails: (f?: ReportFilters) =>
    [...reportKeys.all, "daily-revenue-details", f] as const,
  reportCategoryShare: () =>
    [...reportKeys.all, "report-category-share"] as const,
  mostViewedReports: () =>
    [...reportKeys.all, "most-viewed-reports"] as const,
  patientAgeDemographics: (f?: ReportFilters) =>
    [...reportKeys.all, "patient-age-demographics", f] as const,
  patientDashboard: (f?: ReportFilters) =>
    [...reportKeys.all, "patient-dashboard", f] as const,
  departmentPatientVisits: (f?: ReportFilters) =>
    [...reportKeys.all, "department-patient-visits", f] as const,
  doctorPatientWorkload: (f?: ReportFilters) =>
    [...reportKeys.all, "doctor-patient-workload", f] as const,
  genderBreakdown: (f?: ReportFilters) =>
    [...reportKeys.all, "gender-breakdown", f] as const,
  patientMasterRegister: (f?: ReportFilters) =>
    [...reportKeys.all, "patient-master-register", f] as const,
  patientRegistrationTrend: (period?: string) =>
    [...reportKeys.all, "patient-registration-trend", period] as const,
};

// ─── Navigation Hook (preserved) ───────────────────────────────────────────

export function useReports() {
  const role = useAuthStore((s) => s.user?.role);
  const r = String(role ?? "").toUpperCase();

  const [searchParams, setSearchParams] = useSearchParams();
  const reportParam = searchParams.get("report");
  const kpiParam = searchParams.get("kpi");

  const [localActiveView, setLocalActiveView] = useState<string | null>(null);
  const [localKpi, setLocalKpi] = useState<string | null>(null);

  const activeView = reportParam || localActiveView;
  const activeKpi = kpiParam || localKpi;

  const handleOpenReport = useCallback(
    (view: string) => {
      setSearchParams({ report: view });
      setLocalActiveView(view);
    },
    [setSearchParams],
  );

  const handleOpenKpi = useCallback(
    (kpi?: string) => {
      const kpiVal = kpi || "Collection Rate";
      setSearchParams({ kpi: kpiVal });
      setLocalKpi(kpiVal);
    },
    [setSearchParams],
  );

  const handleBack = useCallback(() => {
    setSearchParams({});
    setLocalActiveView(null);
    setLocalKpi(null);
  }, [setSearchParams]);

  return {
    role: r,
    activeView,
    activeKpi,
    handleOpenReport,
    handleOpenKpi,
    handleBack,
  };
}

// ─── Data Fetching Hooks ────────────────────────────────────────────────────

// 1. Doctor Performance Summary
export function useDoctorPerformance(filters?: ReportFilters) {
  return useQuery({
    queryKey: reportKeys.doctorPerformance(filters),
    queryFn: () => fetchDoctorPerformance(filters),
    enabled: !!filters?.fromDate && !!filters?.toDate,
    staleTime: 60_000,
  });
}

// 2. Daily Appointments Report
export function useDailyAppointments(filters?: ReportFilters) {
  return useQuery({
    queryKey: reportKeys.dailyAppointments(filters),
    queryFn: () => fetchDailyAppointments(filters),
    enabled: !!filters?.fromDate && !!filters?.toDate,
    staleTime: 60_000,
  });
}

// 3. Daily Appointments Detail
export function useDailyAppointmentDetails(filters?: ReportFilters) {
  return useQuery({
    queryKey: reportKeys.dailyAppointmentDetails(filters),
    queryFn: () => fetchDailyAppointmentDetails(filters),
    enabled: !!filters?.fromDate && !!filters?.toDate,
    staleTime: 60_000,
  });
}

// 4. Collection Rate
export function useCollectionRate(filters?: ReportFilters) {
  return useQuery({
    queryKey: reportKeys.collectionRate(filters),
    queryFn: () => fetchCollectionRate(filters),
    enabled: !!filters?.fromDate && !!filters?.toDate,
    staleTime: 60_000,
  });
}

// 5. Hospital Dashboard
export function useHospitalDashboard(filters?: ReportFilters) {
  return useQuery({
    queryKey: reportKeys.hospitalDashboard(filters),
    queryFn: () => fetchHospitalDashboard(filters),
    enabled: !!filters?.fromDate && !!filters?.toDate,
    staleTime: 60_000,
  });
}

// 6. Department Consultation Volume
export function useDepartmentConsultationVolume(filters?: ReportFilters) {
  return useQuery({
    queryKey: reportKeys.departmentConsultationVolume(filters),
    queryFn: () => fetchDepartmentConsultationVolume(filters),
    enabled: !!filters?.fromDate && !!filters?.toDate,
    staleTime: 60_000,
  });
}

// 7. Doctor Performance (Hospital alias)
export function useHospitalDoctorPerformance(filters?: ReportFilters) {
  return useQuery({
    queryKey: reportKeys.hospitalDoctorPerformance(filters),
    queryFn: () => fetchHospitalDoctorPerformance(filters),
    enabled: !!filters?.fromDate && !!filters?.toDate,
    staleTime: 60_000,
  });
}

// 8. Invoice Register Detail
export function useInvoiceRegister(filters?: ReportFilters) {
  return useQuery({
    queryKey: reportKeys.invoiceRegister(filters),
    queryFn: () => fetchInvoiceRegister(filters),
    enabled: !!filters?.fromDate && !!filters?.toDate,
    staleTime: 60_000,
  });
}

// 9. Invoice Summary
export function useInvoiceSummary(filters?: ReportFilters) {
  return useQuery({
    queryKey: reportKeys.invoiceSummary(filters),
    queryFn: () => fetchInvoiceSummary(filters),
    enabled: !!filters?.fromDate && !!filters?.toDate,
    staleTime: 60_000,
  });
}

// 10. Hospital Operational Trend
export function useOperationalTrend(filters?: ReportFilters) {
  return useQuery({
    queryKey: reportKeys.operationalTrend(filters),
    queryFn: () => fetchOperationalTrend(filters),
    enabled: !!filters?.fromDate && !!filters?.toDate,
    staleTime: 60_000,
  });
}

// 11. Patient Registration Summary
export function usePatientRegistrationSummary(filters?: ReportFilters) {
  return useQuery({
    queryKey: reportKeys.patientRegistrationSummary(filters),
    queryFn: () => fetchPatientRegistrationSummary(filters),
    enabled: !!filters?.fromDate && !!filters?.toDate,
    staleTime: 60_000,
  });
}

// 12. Patient Registration Detail
export function usePatientRegistrationDetails(filters?: ReportFilters) {
  return useQuery({
    queryKey: reportKeys.patientRegistrationDetails(filters),
    queryFn: () => fetchPatientRegistrationDetails(filters),
    enabled: !!filters?.fromDate && !!filters?.toDate,
    staleTime: 60_000,
  });
}

// 13. Revenue vs Collection
export function useRevenueVsCollection(filters?: ReportFilters) {
  return useQuery({
    queryKey: reportKeys.revenueVsCollection(filters),
    queryFn: () => fetchRevenueVsCollection(filters),
    enabled: !!filters?.fromDate && !!filters?.toDate,
    staleTime: 60_000,
  });
}

// 14. Daily Revenue
export function useDailyRevenue(filters?: ReportFilters) {
  return useQuery({
    queryKey: reportKeys.dailyRevenue(filters),
    queryFn: () => fetchDailyRevenue(filters),
    enabled: !!filters?.fromDate && !!filters?.toDate,
    staleTime: 60_000,
  });
}

// 15. Daily Revenue Detail
export function useDailyRevenueDetails(filters?: ReportFilters) {
  return useQuery({
    queryKey: reportKeys.dailyRevenueDetails(filters),
    queryFn: () => fetchDailyRevenueDetails(filters),
    enabled: !!filters?.fromDate && !!filters?.toDate,
    staleTime: 60_000,
  });
}

// 16. Report Category Share
export function useReportCategoryShare() {
  return useQuery({
    queryKey: reportKeys.reportCategoryShare(),
    queryFn: fetchReportCategoryShare,
    staleTime: 120_000,
  });
}

// 17. Most Viewed Reports
export function useMostViewedReports() {
  return useQuery({
    queryKey: reportKeys.mostViewedReports(),
    queryFn: fetchMostViewedReports,
    staleTime: 120_000,
  });
}

// 18. Patient Age Demographics
export function usePatientAgeDemographics(filters?: ReportFilters) {
  return useQuery({
    queryKey: reportKeys.patientAgeDemographics(filters),
    queryFn: () => fetchPatientAgeDemographics(filters),
    enabled: !!filters?.fromDate && !!filters?.toDate,
    staleTime: 60_000,
  });
}

// 19. Patient Dashboard
export function usePatientDashboard(filters?: ReportFilters) {
  return useQuery({
    queryKey: reportKeys.patientDashboard(filters),
    queryFn: () => fetchPatientDashboard(filters),
    enabled: !!filters?.fromDate && !!filters?.toDate,
    staleTime: 60_000,
  });
}

// 20. Department Patient Visits
export function useDepartmentPatientVisits(filters?: ReportFilters) {
  return useQuery({
    queryKey: reportKeys.departmentPatientVisits(filters),
    queryFn: () => fetchDepartmentPatientVisits(filters),
    enabled: !!filters?.fromDate && !!filters?.toDate,
    staleTime: 60_000,
  });
}

// 21. Doctor Patient Workload
export function useDoctorPatientWorkload(filters?: ReportFilters) {
  return useQuery({
    queryKey: reportKeys.doctorPatientWorkload(filters),
    queryFn: () => fetchDoctorPatientWorkload(filters),
    enabled: !!filters?.fromDate && !!filters?.toDate,
    staleTime: 60_000,
  });
}

// 22. Gender Breakdown
export function useGenderBreakdown(filters?: ReportFilters) {
  return useQuery({
    queryKey: reportKeys.genderBreakdown(filters),
    queryFn: () => fetchGenderBreakdown(filters),
    enabled: !!filters?.fromDate && !!filters?.toDate,
    staleTime: 60_000,
  });
}

// 23. Patient Master Register
export function usePatientMasterRegister(filters?: ReportFilters) {
  return useQuery({
    queryKey: reportKeys.patientMasterRegister(filters),
    queryFn: () => fetchPatientMasterRegister(filters),
    enabled: !!filters?.fromDate && !!filters?.toDate,
    staleTime: 60_000,
  });
}

// 24. Patient Registration Trend
export function usePatientRegistrationTrend(period?: string) {
  return useQuery({
    queryKey: reportKeys.patientRegistrationTrend(period),
    queryFn: () => fetchPatientRegistrationTrend(period),
    staleTime: 60_000,
  });
}
