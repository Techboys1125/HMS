import { useState, useCallback } from "react";
import {
  receptionService,
  type CheckInResponseData,
} from "../services/reception.service";

export function useCheckIn() {
  const [checkingIn, setCheckingIn] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const checkIn = useCallback(
    async (appointmentId: string | number): Promise<CheckInResponseData> => {
      try {
        setCheckingIn(true);
        setError(null);
        const res = await receptionService.checkInPatient(appointmentId);
        return res;
      } catch (err: any) {
        setError(err?.message || "Check-in failed");
        return {
          success: false,
          appointmentId,
          tokenNumber: "N/A",
          status: "Failed",
          checkInTime: "",
        };
      } finally {
        setCheckingIn(false);
      }
    },
    [],
  );

  return {
    checkIn,
    checkingIn,
    error,
  };
}
