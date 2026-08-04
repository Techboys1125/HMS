import { useState, useCallback } from "react";
import { doctorQueueService } from "../services/doctorQueue.service";
import type { DoctorCallNextResponse } from "../types/doctors.types";

export function useCallNext() {
  const [calling, setCalling] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const callNext = useCallback(
    async (
      doctorId: number | string,
    ): Promise<
      (Partial<DoctorCallNextResponse> & { token?: string }) | null
    > => {
      try {
        setCalling(true);
        setError(null);
        const res = await doctorQueueService.callNextPatient(doctorId);
        return res;
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to call next patient",
        );
        return null;
      } finally {
        setCalling(false);
      }
    },
    [],
  );

  return {
    callNext,
    calling,
    error,
  };
}
