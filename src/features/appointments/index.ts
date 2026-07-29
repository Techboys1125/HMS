export * from "./types/appointment.types";
export * from "./types/appointment-screen.types";
export * from "./api/appointments.api";
export * from "./services/appointment.service";
export * from "./hooks/useAppointments";
export * from "./hooks/useAppointment";
export * from "./hooks/useBookAppointment";
export * from "./hooks/useAppointmentSlots";
export * from "./hooks/useCancelAppointment";
export * from "./hooks/useRescheduleAppointment";
export * from "./permissions/appointment.permissions";
export * from "./constants/appointment.constants";
export { appointmentStore, useAppointmentStore } from "./store/appointment.store";

// Components
export { Chip } from "./components/Chip";
export { StatusBadge } from "./components/StatusBadge";
export { Avatar } from "./components/Avatar";
export { RescheduleAppointmentConfirmationDialog } from "./components/RescheduleAppointmentConfirmationDialog";
export { CancelAppointmentConfirmationDialog } from "./components/CancelAppointmentConfirmationDialog";
export { BookAppointmentDrawer } from "./components/BookAppointmentDrawer";
export { EditAppointmentDrawer } from "./components/EditAppointmentDrawer";
export { AppointmentDetailsDrawer } from "./components/AppointmentDetailsDrawer";
export { DockableQueueWorkspace } from "./components/DockableQueueWorkspace";

// Pages
export { AppointmentManagementCenterScreen, AppointmentCenterScreen } from "./pages/AppointmentManagementCenterScreen";
export { ReceptionBookAppointmentScreen } from "./pages/ReceptionBookAppointmentScreen";
export { PatientCheckInScreen } from "./pages/PatientCheckInScreen";
export { ReceptionQueueManagementScreen } from "./pages/ReceptionQueueManagementScreen";

// Legacy alias
export { AppointmentManagementCenterScreen as AppointmentManagementScreen } from "./pages/AppointmentManagementCenterScreen";
