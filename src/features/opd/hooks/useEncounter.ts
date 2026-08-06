import { useConsultationStore } from "../store/consultationStore";
import { consultationService } from "../services/consultationService";

export const useEncounter = () => {
  const selectedEncounter = useConsultationStore((s) => s.selectedEncounter);
  const loading = useConsultationStore((s) => s.loading);
  const error = useConsultationStore((s) => s.error);

  const finalizeConsultation = async (
    encounterId: string | number,
    appointmentId: string | number,
  ) => {
    return await consultationService.finalizeConsultation(
      encounterId,
      appointmentId,
    );
  };

  return {
    selectedEncounter,
    loading,
    error,
    finalizeConsultation,
  };
};
