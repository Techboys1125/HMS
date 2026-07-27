import { useEffect, useState } from "react";
import { appointmentService } from "../services/appointment.service";

export function useAppointmentSlots(doctorId?: string | number, date?: string) {
  const [slots, setSlots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!doctorId || !date) {
        setSlots([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const data = await appointmentService.listAvailableSlots(doctorId, date);
        if (mounted) setSlots(data);
      } catch (err: any) {
        if (mounted) setError(err?.message || "Failed to load available slots.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [doctorId, date]);

  return { slots, setSlots, isLoading, error };
}

