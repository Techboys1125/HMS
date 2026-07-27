import { useState } from "react";
import { appointmentService } from "../services/appointment.service";
import type { AppointmentRecord, RescheduleAppointmentRequest } from "../types/appointment.types";

export function useRescheduleAppointment() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rescheduleAppointment = async (
    appointmentId: string | number,
    payload: RescheduleAppointmentRequest
  ): Promise<AppointmentRecord> => {
    setIsSubmitting(true);
    setError(null);
    try {
      return await appointmentService.rescheduleAppointment(appointmentId, payload);
    } catch (err: any) {
      setError(err?.message || "Failed to reschedule appointment.");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { rescheduleAppointment, isSubmitting, error };
}

