import { useState, useEffect, useCallback } from "react";
import { appointmentService } from "../services/appointment.service";
import type {
  AppointmentRecord,
  CreateAppointmentRequest,
  RescheduleAppointmentRequest,
  CancelAppointmentRequest,
  UserRole,
} from "../types/appointment.types";

export function useAppointments(
  userRole: UserRole = "Receptionist",
  date?: string,
  params?: {
    doctorId?: string | number;
    patientId?: string | number;
    status?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    size?: number;
    sort?: string;
  },
) {
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const todayStr = date || new Date().toISOString().split("T")[0];

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let items: AppointmentRecord[] = [];
      if (userRole === "Doctor") {
        items = await appointmentService.listDoctorAppointments(
          todayStr,
          params?.status,
        );
      } else if (userRole === "Patient" && params?.patientId) {
        items = await appointmentService.listPatientAppointments(
          params.patientId,
        );
      } else {
        items = await appointmentService.listAppointments({
          doctorId: params?.doctorId,
          patientId: params?.patientId,
          date: todayStr,
          fromDate: params?.fromDate,
          toDate: params?.toDate,
          status: params?.status,
          page: params?.page,
          size: params?.size,
          sort: params?.sort,
        });
      }

      setAppointments(items);
    } catch (err: any) {
      setError(err?.message || "Failed to load appointments from server.");
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  }, [
    userRole,
    todayStr,
    params?.doctorId,
    params?.patientId,
    params?.status,
    params?.fromDate,
    params?.toDate,
    params?.page,
    params?.size,
    params?.sort,
  ]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    appointments,
    setAppointments,
    isLoading,
    error,
    refetch: fetchAppointments,
  };
}

export function useCreateAppointment() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createAppointment = async (
    payload: CreateAppointmentRequest,
  ): Promise<AppointmentRecord | null> => {
    setIsSubmitting(true);
    setError(null);
    try {
      return await appointmentService.bookAppointment(payload);
    } catch (err: any) {
      setError(err?.message || "Failed to create appointment.");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createAppointment, isSubmitting, error };
}

export function useRescheduleAppointment() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const rescheduleAppointment = async (
    appointmentId: string | number,
    payload: RescheduleAppointmentRequest,
  ): Promise<AppointmentRecord | null> => {
    setIsSubmitting(true);
    setError(null);
    try {
      return await appointmentService.rescheduleAppointment(
        appointmentId,
        payload,
      );
    } catch (err: any) {
      setError(err?.message || "Failed to reschedule appointment.");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { rescheduleAppointment, isSubmitting, error };
}

export function useCancelAppointment() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cancelAppointment = async (
    appointmentId: string | number,
    payload: CancelAppointmentRequest,
  ): Promise<AppointmentRecord | null> => {
    setIsSubmitting(true);
    setError(null);
    try {
      return await appointmentService.cancelAppointment(appointmentId, payload);
    } catch (err: any) {
      setError(err?.message || "Failed to cancel appointment.");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { cancelAppointment, isSubmitting, error };
}
