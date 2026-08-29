import { useQuery } from "@tanstack/react-query";
import { doctorReportsApi } from "../api/doctorReports.api";

export const doctorReportKeys = {
  all: ["doctor-reports"] as const,
  dailyAnalytics: (params?: { date?: string; period?: string }) =>
    [...doctorReportKeys.all, "daily-analytics", params] as const,
  dailyDashboard: (date?: string) =>
    [...doctorReportKeys.all, "daily-dashboard", date] as const,
  dailyRegister: (params?: {
    date?: string;
    search?: string;
    status?: string;
    page?: number;
    size?: number;
  }) => [...doctorReportKeys.all, "daily-register", params] as const,
  patientAnalytics: (params?: {
    fromDate?: string;
    toDate?: string;
    period?: string;
  }) => [...doctorReportKeys.all, "patient-analytics", params] as const,
  patientDashboard: (params?: { fromDate?: string; toDate?: string }) =>
    [...doctorReportKeys.all, "patient-dashboard", params] as const,
  patientRegister: (params?: {
    fromDate?: string;
    toDate?: string;
    search?: string;
    followUpStatus?: string;
    page?: number;
    size?: number;
  }) => [...doctorReportKeys.all, "patient-register", params] as const,
};

// 1. Doctor Daily Appointments Analytics Hook
export function useDoctorDailyAnalytics(params?: {
  date?: string;
  period?: string;
}) {
  return useQuery({
    queryKey: doctorReportKeys.dailyAnalytics(params),
    queryFn: () => doctorReportsApi.getDailyAnalytics(params),
    staleTime: 60_000,
  });
}

// 2. Doctor Daily Appointments Dashboard Hook
export function useDoctorDailyDashboard(date?: string) {
  return useQuery({
    queryKey: doctorReportKeys.dailyDashboard(date),
    queryFn: () => doctorReportsApi.getDailyDashboard(date),
    staleTime: 60_000,
  });
}

// 3. Doctor Daily Appointment Register Hook
export function useDoctorDailyRegister(params?: {
  date?: string;
  search?: string;
  status?: string;
  page?: number;
  size?: number;
}) {
  return useQuery({
    queryKey: doctorReportKeys.dailyRegister(params),
    queryFn: () => doctorReportsApi.getDailyRegister(params),
    staleTime: 60_000,
  });
}

// 4. Doctor Patient Analytics Hook
export function useDoctorPatientAnalytics(params?: {
  fromDate?: string;
  toDate?: string;
  period?: string;
}) {
  return useQuery({
    queryKey: doctorReportKeys.patientAnalytics(params),
    queryFn: () => doctorReportsApi.getPatientAnalytics(params),
    staleTime: 60_000,
  });
}

// 5. Doctor Patient Dashboard Hook
export function useDoctorPatientDashboard(params?: {
  fromDate?: string;
  toDate?: string;
}) {
  return useQuery({
    queryKey: doctorReportKeys.patientDashboard(params),
    queryFn: () => doctorReportsApi.getPatientDashboard(params),
    staleTime: 60_000,
  });
}

// 6. Doctor Patient Register Hook
export function useDoctorPatientRegister(params?: {
  fromDate?: string;
  toDate?: string;
  search?: string;
  followUpStatus?: string;
  page?: number;
  size?: number;
}) {
  return useQuery({
    queryKey: doctorReportKeys.patientRegister(params),
    queryFn: () => doctorReportsApi.getPatientRegister(params),
    staleTime: 60_000,
  });
}
