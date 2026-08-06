import { useState, useCallback } from "react";
import { consultationService } from "../services/consultationService";
import type { PatientVitals } from "../types/vitals";

export const useVitals = (encounterId?: string | number) => {
  const [vitals, setVitals] = useState<PatientVitals | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadVitals = useCallback(
    async (encId?: string | number) => {
      const targetId = encId || encounterId;
      if (!targetId) return null;

      setLoading(true);
      setError(null);
      try {
        const data = await consultationService.loadEncounterContext(targetId);
        setVitals(data);
        return data;
      } catch (err) {
        const errMsg =
          err instanceof Error ? err.message : "Failed to load vitals";
        setError(errMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [encounterId],
  );

  const saveVitals = useCallback(
    async (newVitals: Partial<PatientVitals>, encId?: string | number) => {
      const targetId = encId || encounterId;
      if (!targetId) throw new Error("No active encounter ID");

      setLoading(true);
      setError(null);
      try {
        const saved = await consultationService.saveVitals(targetId, newVitals);
        setVitals(saved);
        return saved;
      } catch (err) {
        const errMsg =
          err instanceof Error ? err.message : "Failed to save vitals";
        setError(errMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [encounterId],
  );

  return {
    vitals,
    loading,
    error,
    loadVitals,
    saveVitals,
  };
};
