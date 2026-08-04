import { useCallback, useState } from "react";
import { encounterService } from "../services/encounter.service";
import type {
  AddDiagnosisRequest,
  AddMedicationRequest,
  Consultation,
  CreatePrescriptionRequest,
  Diagnosis,
  EncounterSummary,
  FinalizeEncounterRequest,
  FinalizePrescriptionRequest,
  FinalizePrescriptionResponse,
  Prescription,
  SaveConsultationRequest,
} from "../types/encounter.types";

interface ActionState<TResult> {
  run: (...args: never[]) => Promise<TResult | null>;
  loading: boolean;
  error: string | null;
  resetError: () => void;
}

function useAction<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
): {
  run: (...args: TArgs) => Promise<TResult | null>;
  loading: boolean;
  error: string | null;
  resetError: () => void;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (...args: TArgs): Promise<TResult | null> => {
      setLoading(true);
      setError(null);
      try {
        return await fn(...args);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Action failed");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fn],
  );

  const resetError = useCallback(() => setError(null), []);

  return { run, loading, error, resetError };
}

export type { ActionState };

export const useStartEncounter = () =>
  useAction((appointmentId: string | number) =>
    encounterService.startEncounter(appointmentId),
  );

export const useSaveConsultation = () =>
  useAction((encounterId: string | number, payload: SaveConsultationRequest) =>
    encounterService.saveConsultation(encounterId, payload),
  );

export const useAddDiagnosis = () =>
  useAction((encounterId: string | number, payload: AddDiagnosisRequest) =>
    encounterService.addDiagnosis(encounterId, payload),
  );

export const useFinalizeEncounter = () =>
  useAction((encounterId: string | number, payload: FinalizeEncounterRequest) =>
    encounterService.finalizeEncounter(encounterId, payload),
  );

export const useCreatePrescription = () =>
  useAction(
    (encounterId: string | number, payload: CreatePrescriptionRequest) =>
      encounterService.createPrescription(encounterId, payload),
  );

export const useAddMedication = () =>
  useAction((prescriptionId: string | number, payload: AddMedicationRequest) =>
    encounterService.addMedication(prescriptionId, payload),
  );

export const useFinalizePrescription = () =>
  useAction(
    (
      prescriptionId: string | number,
      payload: FinalizePrescriptionRequest = { confirmation: true },
    ) => encounterService.finalizePrescription(prescriptionId, payload),
  );

export type {
  Consultation,
  Diagnosis,
  EncounterSummary,
  FinalizePrescriptionResponse,
  Prescription,
};
