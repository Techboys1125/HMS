import { useQuery } from "@tanstack/react-query";
import { nurseDashboardApi } from "../api/nurseDashboard.api";

const nurseKeys = {
  all: ["nurse-dashboard"] as const,
  summary: () => [...nurseKeys.all, "summary"] as const,
  vitalsTrend: () => [...nurseKeys.all, "vitals-trend"] as const,
  preparationStatus: () => [...nurseKeys.all, "preparation-status"] as const,
  queue: (page: number, size: number) =>
    [...nurseKeys.all, "queue", page, size] as const,
  doctorAssistance: () => [...nurseKeys.all, "doctor-assistance"] as const,
  departments: () => [...nurseKeys.all, "departments"] as const,
  vitalsStatus: () => [...nurseKeys.all, "vitals-status"] as const,
  performance: () => [...nurseKeys.all, "performance"] as const,
};

export function useNurseDashboardSummary() {
  return useQuery({
    queryKey: nurseKeys.summary(),
    queryFn: nurseDashboardApi.getSummary,
    refetchInterval: 30000,
  });
}

export function useNurseVitalsTrend() {
  return useQuery({
    queryKey: nurseKeys.vitalsTrend(),
    queryFn: nurseDashboardApi.getVitalsTrend,
    refetchInterval: 60000,
  });
}

export function useNursePreparationStatus() {
  return useQuery({
    queryKey: nurseKeys.preparationStatus(),
    queryFn: nurseDashboardApi.getPreparationStatus,
    refetchInterval: 30000,
  });
}

export function useNurseQueue(page = 0, size = 10) {
  return useQuery({
    queryKey: nurseKeys.queue(page, size),
    queryFn: () => nurseDashboardApi.getQueue(page, size),
    refetchInterval: 15000,
  });
}

export function useNurseDoctorAssistance() {
  return useQuery({
    queryKey: nurseKeys.doctorAssistance(),
    queryFn: nurseDashboardApi.getDoctorAssistance,
    refetchInterval: 30000,
  });
}

export function useNurseDepartments() {
  return useQuery({
    queryKey: nurseKeys.departments(),
    queryFn: nurseDashboardApi.getDepartments,
    refetchInterval: 60000,
  });
}

export function useNurseVitalsStatus() {
  return useQuery({
    queryKey: nurseKeys.vitalsStatus(),
    queryFn: nurseDashboardApi.getVitalsStatus,
    refetchInterval: 30000,
  });
}

export function useNursePerformance() {
  return useQuery({
    queryKey: nurseKeys.performance(),
    queryFn: nurseDashboardApi.getPerformance,
    refetchInterval: 60000,
  });
}
