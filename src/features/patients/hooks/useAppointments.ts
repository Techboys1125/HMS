/**
 * useAppointments – React Query hooks for patient appointments
 */
import { useQuery } from "@tanstack/react-query";
import { appointmentService } from "../services/appointment.service";

export const appointmentKeys = {
  all: ["patientAppointments"] as const,
  list: (mrn: string) => [...appointmentKeys.all, "list", mrn] as const,
  upcoming: (mrn: string) => [...appointmentKeys.all, "upcoming", mrn] as const,
  history: (mrn: string) => [...appointmentKeys.all, "history", mrn] as const,
};

export function usePatientAppointments(mrn: string) {
  return useQuery({
    queryKey: appointmentKeys.list(mrn),
    queryFn: () => appointmentService.getPatientAppointments(mrn),
    enabled: !!mrn,
  });
}

export function useUpcomingAppointments(mrn: string) {
  return useQuery({
    queryKey: appointmentKeys.upcoming(mrn),
    queryFn: () => appointmentService.getUpcomingAppointments(mrn),
    enabled: !!mrn,
  });
}

export function useAppointmentHistory(mrn: string) {
  return useQuery({
    queryKey: appointmentKeys.history(mrn),
    queryFn: () => appointmentService.getAppointmentHistory(mrn),
    enabled: !!mrn,
  });
}
