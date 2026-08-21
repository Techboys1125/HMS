import { useQuery } from "@tanstack/react-query";
import { patientDashboardApi } from "../api/patientDashboard.api";
import type { PatientAppointmentsTimeline } from "../types/dashboard.types";

const patientKeys = {
  all: ["patient-dashboard"] as const,
  dashboard: () => [...patientKeys.all, "dashboard"] as const,
  appointments: () => [...patientKeys.all, "appointments"] as const,
  appointmentsTimeline: (params?: {
    mrn?: string;
    fromDate?: string;
    toDate?: string;
    limit?: number;
  }) => [...patientKeys.all, "appointments-timeline", params] as const,
  appointmentDetail: (id: string | number) =>
    [...patientKeys.all, "appointment", id] as const,
  prescriptionSummary: () =>
    [...patientKeys.all, "prescription-summary"] as const,
  consultationHistory: () =>
    [...patientKeys.all, "consultation-history"] as const,
  billWorkspace: (billId: string | number) =>
    [...patientKeys.all, "bill", billId] as const,
  notifications: (page: number, size: number) =>
    [...patientKeys.all, "notifications", page, size] as const,
  unreadNotificationsCount: () =>
    [...patientKeys.all, "notifications-unread"] as const,
};

export function usePatientDashboard() {
  return useQuery({
    queryKey: patientKeys.dashboard(),
    queryFn: patientDashboardApi.getDashboard,
    refetchInterval: 60000,
  });
}

export function usePatientAppointmentsTimeline(params?: {
  mrn?: string;
  fromDate?: string;
  toDate?: string;
  limit?: number;
}) {
  return useQuery<PatientAppointmentsTimeline>({
    queryKey: patientKeys.appointmentsTimeline(params),
    queryFn: () => patientDashboardApi.getAppointmentsTimeline(params),
    refetchInterval: 30000,
  });
}

export function usePatientPrescriptionSummary() {
  return useQuery({
    queryKey: patientKeys.prescriptionSummary(),
    queryFn: patientDashboardApi.getPrescriptionSummary,
    refetchInterval: 60000,
  });
}

export function usePatientConsultationHistory() {
  return useQuery({
    queryKey: patientKeys.consultationHistory(),
    queryFn: patientDashboardApi.getConsultationHistory,
    refetchInterval: 60000,
  });
}

export function usePatientUnreadNotificationsCount() {
  return useQuery({
    queryKey: patientKeys.unreadNotificationsCount(),
    queryFn: patientDashboardApi.getUnreadNotificationsCount,
    refetchInterval: 15000,
  });
}
