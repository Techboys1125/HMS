import { useState } from "react";
import { appointmentService } from "../services/appointment.service";
import type {
  AppointmentRecord,
  CancelAppointmentRequest,
} from "../types/appointment.types";

export function useCancelAppointment() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelAppointment = async (
    appointmentId: string | number,
    payload: CancelAppointmentRequest,
  ): Promise<AppointmentRecord> => {
    setIsSubmitting(true);
    setError(null);
    try {
      return await appointmentService.cancelAppointment(appointmentId, payload);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to cancel appointment.";
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { cancelAppointment, isSubmitting, error };
}
