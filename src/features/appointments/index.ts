export * from "./types/appointment.types";
export * from "./api/appointments.api";
export * from "./services/appointment.service";
export * from "./hooks/useAppointments";
export * from "./hooks/useAppointment";
export * from "./hooks/useBookAppointment";
export * from "./hooks/useAppointmentSlots";
export * from "./permissions/appointment.permissions";
export {
  AppointmentManagementCenterScreen,
  AppointmentManagementCenterScreen as AppointmentManagementScreen,
} from "./pages/AppointmentManagementScreen";

// Backwards compatibility aliases for App.tsx and VitalsManagementScreen
export { AppointmentManagementCenterScreen as ReceptionBookAppointmentScreen } from "./pages/AppointmentManagementScreen";
export { AppointmentManagementCenterScreen as PatientCheckInScreen } from "./pages/AppointmentManagementScreen";
export { AppointmentManagementCenterScreen as ReceptionQueueManagementScreen } from "./pages/AppointmentManagementScreen";
