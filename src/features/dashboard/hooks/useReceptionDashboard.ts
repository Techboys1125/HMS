import { useQuery } from "@tanstack/react-query";
import { receptionDashboardApi } from "../api/receptionDashboard.api";

const receptionKeys = {
  all: ["reception-dashboard"] as const,
  summary: () => [...receptionKeys.all, "summary"] as const,
  registrationTrend: () => [...receptionKeys.all, "registration-trend"] as const,
  appointmentStatus: () => [...receptionKeys.all, "appointment-status"] as const,
  patientsByDepartment: () => [...receptionKeys.all, "patients-by-department"] as const,
  registrationCategories: () => [...receptionKeys.all, "registration-categories"] as const,
  performanceSummary: () => [...receptionKeys.all, "performance-summary"] as const,
};

export function useReceptionSummary() {
  return useQuery({
    queryKey: receptionKeys.summary(),
    queryFn: receptionDashboardApi.getSummary,
    refetchInterval: 30000,
  });
}

export function useReceptionRegistrationTrend() {
  return useQuery({
    queryKey: receptionKeys.registrationTrend(),
    queryFn: receptionDashboardApi.getRegistrationTrend,
    refetchInterval: 60000,
  });
}

export function useReceptionAppointmentStatus() {
  return useQuery({
    queryKey: receptionKeys.appointmentStatus(),
    queryFn: receptionDashboardApi.getAppointmentStatus,
    refetchInterval: 30000,
  });
}

export function useReceptionPatientsByDepartment() {
  return useQuery({
    queryKey: receptionKeys.patientsByDepartment(),
    queryFn: receptionDashboardApi.getPatientsByDepartment,
    refetchInterval: 60000,
  });
}

export function useReceptionRegistrationCategories() {
  return useQuery({
    queryKey: receptionKeys.registrationCategories(),
    queryFn: receptionDashboardApi.getRegistrationCategories,
    refetchInterval: 60000,
  });
}

export function useReceptionPerformanceSummary() {
  return useQuery({
    queryKey: receptionKeys.performanceSummary(),
    queryFn: receptionDashboardApi.getPerformanceSummary,
    refetchInterval: 60000,
  });
}
