import { useState, useCallback } from "react";
import { consultationService } from "../services/consultationService";
import type { Diagnosis } from "../types/encounter";

export const useDiagnosis = (encounterId?: string | number) => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addDiagnosis = useCallback(
    async (code: string, name: string, encId?: string | number) => {
      const targetId = encId || encounterId;
      if (!targetId) throw new Error("No active encounter ID");

      setLoading(true);
      setError(null);
      try {
        const added = await consultationService.addDiagnosis(
          targetId,
          code,
          name,
        );
        setDiagnoses((prev) => [...prev, added]);
        return added;
      } catch (err) {
        const errMsg =
          err instanceof Error ? err.message : "Failed to add diagnosis";
        setError(errMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [encounterId],
  );

  return {
    diagnoses,
    loading,
    error,
    addDiagnosis,
    setDiagnoses,
  };
};
