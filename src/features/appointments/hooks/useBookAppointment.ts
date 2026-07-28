import { useState } from "react";
import { appointmentService } from "../services/appointment.service";
import type {
  AppointmentRecord,
  CreateAppointmentRequest,
} from "../types/appointment.types";

export function useBookAppointment() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bookAppointment = async (
    payload: CreateAppointmentRequest,
  ): Promise<AppointmentRecord> => {
    setIsSubmitting(true);
    setError(null);
    try {
      return await appointmentService.bookAppointment(payload);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to book appointment.";
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { bookAppointment, isSubmitting, error };
}
