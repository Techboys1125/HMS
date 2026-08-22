import { useQueryClient } from "@tanstack/react-query";
import { useConsultationStore } from "../store/consultationStore";
import { consultationService } from "../services/consultationService";
import { QUEUE_QUERY_KEY } from "./useQueue";

export const useEncounter = () => {
  const queryClient = useQueryClient();
  const selectedEncounter = useConsultationStore((s) => s.selectedEncounter);
  const selectedPrescription = useConsultationStore(
    (s) => s.selectedPrescription,
  );
  const loading = useConsultationStore((s) => s.loading);
  const error = useConsultationStore((s) => s.error);

  const finalizeConsultation = async (
    encounterId: string | number,
    appointmentId: string | number,
    advicePayload?: {
      generalAdvice?: string;
      dietAdvice?: string;
      precautions?: string;
    },
  ) => {
    const result = await consultationService.finalizeConsultation(
      encounterId,
      appointmentId,
      advicePayload,
    );

    // Invalidate all related queries so the UI reflects the COMPLETED status
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: QUEUE_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: ["queue"] }),
      queryClient.invalidateQueries({ queryKey: ["appointments"] }),
      queryClient.invalidateQueries({ queryKey: ["encounters"] }),
      queryClient.invalidateQueries({ queryKey: ["consultations"] }),
      queryClient.invalidateQueries({ queryKey: ["doctor"] }),
      queryClient.invalidateQueries({ queryKey: ["doctor", "appointments"] }),
      queryClient.invalidateQueries({ queryKey: ["nurse"] }),
    ]);

    return result;
  };

  return {
    selectedEncounter,
    selectedPrescription,
    loading,
    error,
    finalizeConsultation,
  };
};
