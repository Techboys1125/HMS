import { useConsultationStore } from "../store/consultationStore";
import { consultationService } from "../services/consultationService";

export const useEncounter = () => {
  const selectedEncounter = useConsultationStore((s) => s.selectedEncounter);
  const selectedPrescription = useConsultationStore((s) => s.selectedPrescription);
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
    return await consultationService.finalizeConsultation(
      encounterId,
      appointmentId,
      advicePayload,
    );
  };

  return {
    selectedEncounter,
    selectedPrescription,
    loading,
    error,
    finalizeConsultation,
  };
};
