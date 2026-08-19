/**
 * Appointment Service – Patient-centric appointment operations
 * Wraps patientsApi appointment calls with proper data mapping
 */
import { patientsApi } from "../api/patient.api";
import type { ApiPatientAppointment } from "../types/patient.types";

export interface AppointmentFilters {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const appointmentService = {
  /**
   * Get all appointments for a patient by MRN
   * GET /api/v1/appointments?mrn=
   */
  async getPatientAppointments(
    mrn: string,
    filters?: AppointmentFilters,
  ): Promise<ApiPatientAppointment[]> {
    const appointments = await patientsApi.getAppointments(mrn);
    if (!filters) return appointments;

    return appointments.filter((appt) => {
      if (filters.status && appt.status !== filters.status) return false;
      if (filters.dateFrom && appt.date && appt.date < filters.dateFrom)
        return false;
      if (filters.dateTo && appt.date && appt.date > filters.dateTo)
        return false;
      return true;
    });
  },

  /**
   * Get upcoming appointments
   */
  async getUpcomingAppointments(mrn: string): Promise<ApiPatientAppointment[]> {
    const appointments = await patientsApi.getAppointments(mrn);
    const today = new Date().toISOString().split("T")[0];
    return appointments.filter(
      (a) =>
        a.status !== "Cancelled" &&
        a.status !== "Completed" &&
        (!a.date || a.date >= today),
    );
  },

  /**
   * Get appointment history (completed/cancelled)
   */
  async getAppointmentHistory(mrn: string): Promise<ApiPatientAppointment[]> {
    const appointments = await patientsApi.getAppointments(mrn);
    return appointments.filter(
      (a) => a.status === "Completed" || a.status === "Cancelled",
    );
  },

  /**
   * Categorize appointments by status
   */
  categorizeAppointments(appointments: ApiPatientAppointment[]) {
    return {
      upcoming: appointments.filter(
        (a) => a.status === "Scheduled" || a.status === "Confirmed",
      ),
      completed: appointments.filter((a) => a.status === "Completed"),
      cancelled: appointments.filter((a) => a.status === "Cancelled"),
      inProgress: appointments.filter((a) => a.status === "In Progress"),
    };
  },
};
