import { AppointmentRecord } from "../../appointments/types/appointment.types";
import { useConsultationStore } from "../store/consultationStore";
import { consultationService } from "../services/consultationService";

export const useConsultation = () => {
  const selectedAppointment = useConsultationStore(
    (s) => s.selectedAppointment,
  );
  const selectedConsultation = useConsultationStore(
    (s) => s.selectedConsultation,
  );
  const consultationStatus = useConsultationStore((s) => s.consultationStatus);
  const loading = useConsultationStore((s) => s.loading);
  const error = useConsultationStore((s) => s.error);

  const callPatient = async (appointmentId: string | number) => {
    return await consultationService.callPatient(appointmentId);
  };

  const startConsultation = async (
    appointment: AppointmentRecord,
    chiefComplaint: string = "",
  ) => {
    return await consultationService.startConsultation(
      appointment,
      chiefComplaint,
    );
  };

  return {
    selectedAppointment,
    selectedConsultation,
    consultationStatus,
    loading,
    error,
    callPatient,
    startConsultation,
  };
};
