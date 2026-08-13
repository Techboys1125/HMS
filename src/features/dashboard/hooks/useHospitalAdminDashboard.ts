import { useQuery } from "@tanstack/react-query";
import { hospitalAdminDashboardApi } from "../api/hospitalAdminDashboard.api";

const hospitalAdminKeys = {
  all: ["hospital-admin-dashboard"] as const,
  summary: () => [...hospitalAdminKeys.all, "summary"] as const,
  appointmentFlow: () => [...hospitalAdminKeys.all, "appointment-flow"] as const,
  statusDistribution: () => [...hospitalAdminKeys.all, "status-distribution"] as const,
  departmentWorkload: () => [...hospitalAdminKeys.all, "department-workload"] as const,
  doctorAvailability: () => [...hospitalAdminKeys.all, "doctor-availability"] as const,
  todayTimeline: () => [...hospitalAdminKeys.all, "today-timeline"] as const,
  revenueDistribution: () => [...hospitalAdminKeys.all, "revenue-distribution"] as const,
  departmentSummary: () => [...hospitalAdminKeys.all, "department-summary"] as const,
};

export function useHospitalAdminSummary() {
  return useQuery({
    queryKey: hospitalAdminKeys.summary(),
    queryFn: hospitalAdminDashboardApi.getSummary,
    refetchInterval: 30000,
  });
}

export function useHospitalAdminAppointmentFlow() {
  return useQuery({
    queryKey: hospitalAdminKeys.appointmentFlow(),
    queryFn: hospitalAdminDashboardApi.getAppointmentFlow,
    refetchInterval: 60000,
  });
}

export function useHospitalAdminStatusDistribution() {
  return useQuery({
    queryKey: hospitalAdminKeys.statusDistribution(),
    queryFn: hospitalAdminDashboardApi.getStatusDistribution,
    refetchInterval: 60000,
  });
}

export function useHospitalAdminDepartmentWorkload() {
  return useQuery({
    queryKey: hospitalAdminKeys.departmentWorkload(),
    queryFn: hospitalAdminDashboardApi.getDepartmentWorkload,
    refetchInterval: 60000,
  });
}

export function useHospitalAdminDoctorAvailability() {
  return useQuery({
    queryKey: hospitalAdminKeys.doctorAvailability(),
    queryFn: hospitalAdminDashboardApi.getDoctorAvailability,
    refetchInterval: 60000,
  });
}

export function useHospitalAdminTodayTimeline() {
  return useQuery({
    queryKey: hospitalAdminKeys.todayTimeline(),
    queryFn: hospitalAdminDashboardApi.getTodayTimeline,
    refetchInterval: 30000,
  });
}

export function useHospitalAdminRevenueDistribution() {
  return useQuery({
    queryKey: hospitalAdminKeys.revenueDistribution(),
    queryFn: hospitalAdminDashboardApi.getRevenueDistribution,
    refetchInterval: 60000,
  });
}

export function useHospitalAdminDepartmentSummary() {
  return useQuery({
    queryKey: hospitalAdminKeys.departmentSummary(),
    queryFn: hospitalAdminDashboardApi.getDepartmentSummary,
    refetchInterval: 60000,
  });
}
