import { useEffect, useState } from "react";
import { appointmentService } from "../services/appointment.service";
import type { AppointmentRecord } from "../types/appointment.types";

export function useAppointment(appointmentId?: string | number) {
  const [appointment, setAppointment] = useState<AppointmentRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!appointmentId) {
        setAppointment(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const data = await appointmentService.getAppointment(appointmentId);
        if (mounted) setAppointment(data);
      } catch (err: any) {
        if (mounted) setError(err?.message || "Failed to load appointment.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [appointmentId]);

  return { appointment, setAppointment, isLoading, error };
}

