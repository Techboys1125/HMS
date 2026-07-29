import { AppointmentManagementCenterScreen } from "../../appointments";

export function DoctorAppointmentsScreen({
  onStartConsultation,
}: {
  onStartConsultation?: (id: number) => void;
}) {
  return (
    <AppointmentManagementCenterScreen
      userRole="Doctor"
      onStartConsultation={() => onStartConsultation?.(1)}
    />
  );
}
