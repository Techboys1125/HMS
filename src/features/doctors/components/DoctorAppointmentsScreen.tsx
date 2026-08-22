import { AppointmentManagementCenterScreen } from "../../appointments/pages/AppointmentManagementCenterScreen";
import { useAuthStore } from "../../auth/store/auth.store";

export function DoctorAppointmentsScreen({
  onStartConsultation,
}: {
  onStartConsultation?: (id: number) => void;
}) {
  const { user } = useAuthStore();
  const doctorId =
    user?.doctorProfile?.doctorId ??
    user?.doctorId ??
    (String(user?.role || "").toUpperCase() === "DOCTOR"
      ? user?.id
      : undefined);

  return (
    <AppointmentManagementCenterScreen
      userRole="Doctor"
      doctorId={doctorId}
      onStartConsultation={() => onStartConsultation?.(1)}
    />
  );
}
