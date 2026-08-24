import { useQueryClient } from "@tanstack/react-query";
import type { AppointmentRecord } from "../../appointments/types/appointment.types";
import { useConsultationStore } from "../store/consultationStore";
import { consultationService } from "../services/consultationService";
import { QUEUE_QUERY_KEY } from "./useQueue";

export const useConsultation = () => {
  const queryClient = useQueryClient();
  const selectedAppointment = useConsultationStore(
    (s) => s.selectedAppointment,
  );
  const selectedConsultation = useConsultationStore(
    (s) => s.selectedConsultation,
  );
  const selectedVitals = useConsultationStore((s) => s.selectedVitals);
  const selectedDiagnoses = useConsultationStore((s) => s.selectedDiagnoses);
  const consultationStatus = useConsultationStore((s) => s.consultationStatus);
  const loading = useConsultationStore((s) => s.loading);
  const error = useConsultationStore((s) => s.error);

  const callPatient = async (
    appointmentId: string | number,
    alternateId?: string | number,
  ) => {
    const result = await consultationService.callPatient(
      appointmentId,
      alternateId,
    );
    // Invalidate queue so the patient moves from Waiting to Called
    await queryClient.invalidateQueries({ queryKey: QUEUE_QUERY_KEY });
    return result;
  };

  const startConsultation = async (
    appointment: AppointmentRecord,
    chiefComplaint: string = "",
  ) => {
    const result = await consultationService.startConsultation(
      appointment,
      chiefComplaint,
    );
    // Invalidate queue so the patient moves from Called to In Consultation
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: QUEUE_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: ["appointments"] }),
      queryClient.invalidateQueries({ queryKey: ["encounters"] }),
    ]);
    return result;
  };

  const loadFullConsultationDetails = async (
    consultationId: string | number,
  ) => {
    return await consultationService.loadFullConsultationDetails(
      consultationId,
    );
  };

  return {
    selectedAppointment,
    selectedConsultation,
    selectedVitals,
    selectedDiagnoses,
    consultationStatus,
    loading,
    error,
    callPatient,
    startConsultation,
    loadFullConsultationDetails,
  };
};
